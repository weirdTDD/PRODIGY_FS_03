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
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true
});
// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
// Update product ratings after review is saved
reviewSchema.post('save', async function () {
    const product = await mongoose_1.default.model('Product').findById(this.product);
    if (product) {
        const reviews = await mongoose_1.default
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
        const product = await mongoose_1.default.model('Product').findById(doc.product);
        if (product) {
            const reviews = await mongoose_1.default
                .model('Review')
                .find({ product: doc.product });
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                product.ratings = totalRating / reviews.length;
                product.numReviews = reviews.length;
            }
            else {
                product.ratings = 0;
                product.numReviews = 0;
            }
            await product.save();
        }
    }
});
exports.default = mongoose_1.default.model('Review', reviewSchema);
//# sourceMappingURL=Review.js.map