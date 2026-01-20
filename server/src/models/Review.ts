import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpfulCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product ratings after review is saved
reviewSchema.post('save', async function () {
  const product = await mongoose.model('Product').findById(this.product);
  
  if (product) {
    const reviews = await mongoose
      .model('Review')
      .find({ product: this.product });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings = totalRating / reviews.length;
    product.numReviews = reviews.length;
    
    await product.save();
  }
});

// Update product ratings after review is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const product = await mongoose.model('Product').findById(doc.product);
    
    if (product) {
      const reviews = await mongoose
        .model('Review')
        .find({ product: doc.product });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        product.ratings = totalRating / reviews.length;
        product.numReviews = reviews.length;
      } else {
        product.ratings = 0;
        product.numReviews = 0;
      }
      
      await product.save();
    }
  }
});

export default mongoose.model<IReview>('Review', reviewSchema);
