"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const shippingAddressSchema = new mongoose_1.Schema({
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
const paymentResultSchema = new mongoose_1.Schema({
    id: String,
    status: String,
    update_time: String,
    email_address: String
});
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function (v) {
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
}, {
    timestamps: true
});
// Update product stock and sold count after order is paid
orderSchema.post('save', async function () {
    if (this.isPaid && this.isModified('isPaid')) {
        for (const item of this.items) {
            const product = await mongoose_1.default.model('Product').findById(item.product);
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
exports.default = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map