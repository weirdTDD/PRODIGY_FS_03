import mongoose, { Document } from 'mongoose';
export interface ICartItem {
    _id?: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    size: string;
    color?: string;
}
export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, {}> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map