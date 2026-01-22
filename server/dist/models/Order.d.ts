import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map