import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map