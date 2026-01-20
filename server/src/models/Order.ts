import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  size: string;
  color?: string;
  image: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  phone: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'stripe' | 'cash_on_delivery' | 'mobile_money';
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  size: {
    type: String,
    required: true
  },
  color: String,
  image: {
    type: String,
    required: true
  }
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'Ghana'
  },
  postalCode: String,
  phone: {
    type: String,
    required: true
  }
});

const paymentResultSchema = new Schema<IPaymentResult>({
  id: String,
  status: String,
  update_time: String,
  email_address: String
});

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (v: IOrderItem[]) {
          return v && v.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cash_on_delivery', 'mobile_money'],
      required: true
    },
    paymentResult: paymentResultSchema,
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Items price cannot be negative']
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Shipping price cannot be negative']
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Tax price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total price cannot be negative']
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    trackingNumber: String,
    notes: String
  },
  {
    timestamps: true
  }
);

// Update product stock and sold count after order is paid
orderSchema.post('save', async function () {
  if (this.isPaid && this.isModified('isPaid')) {
    for (const item of this.items) {
      const product = await mongoose.model('Product').findById(item.product);
      
      if (product) {
        product.stock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
      }
    }
  }
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
