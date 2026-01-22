import mongoose, { Document, Types } from 'mongoose';
export interface IAddress {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
    isDefault: boolean;
    _id?: Types.ObjectId;
}
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    avatar?: string;
    phone?: string;
    addresses: Types.DocumentArray<IAddress>;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map