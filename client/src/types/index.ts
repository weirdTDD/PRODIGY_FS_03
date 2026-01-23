interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: Address[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: Category | string;
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
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: User | string;
  product: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  price: number;
  size: string;
  color?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  color?: string;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  phone: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'stripe' | 'cash_on_delivery' | 'mobile_money';
  paymentResult?: PaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface ProductFilters {
  category?: string;
  condition?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  available?: boolean;
}
