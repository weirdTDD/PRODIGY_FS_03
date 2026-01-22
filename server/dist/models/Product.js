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
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category']
    },
    images: {
        type: [String],
        required: [true, 'Please provide at least one image'],
        validate: {
            validator: function (v) {
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
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
exports.default = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=Product.js.map