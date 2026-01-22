import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  condition: 'excellent' | 'good' | 'fair';
  brand?: string;
  size: string;
  color?: string;
  material?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    sleeves?: number;
  };
  isFeatured: boolean;
  isAvailable: boolean;
  ratings: number;
  numReviews: number;
  views: number;
  sold: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category']
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 1
    },
    condition: {
      type: String,
      enum: {
        values: ['excellent', 'good', 'fair'],
        message: 'Condition must be either excellent, good, or fair'
      },
      required: [true, 'Please specify the condition']
    },
    brand: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      required: [true, 'Please provide a size'],
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    material: {
      type: String,
      trim: true
    },
    measurements: {
      chest: Number,
      waist: Number,
      length: Number,
      sleeves: Number
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    numReviews: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    this.slug = `${this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${randomSuffix}`;
  }
  next();
});

// Update stock availability based on stock quantity
productSchema.pre('save', function (next) {
  if (this.isModified('stock')) {
    this.isAvailable = this.stock > 0;
  }
  next();
});

// Virtual populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Indexes for better query performance
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
