export type UserRole = 'admin' | 'user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'Cash on Delivery';
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderStatus: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  statusCounts: Record<OrderStatus, number>;
  lowStockCount: number;
  lowStockItems: Array<{
    _id: string;
    name: string;
    stockQuantity: number;
    category: string;
    price: number;
  }>;
  categoryCounts: Record<string, number>;
  recentOrders: Order[];
  database: {
    mode: 'mongodb' | 'file-store';
    isConnected: boolean;
    storageType: string;
  };
}
