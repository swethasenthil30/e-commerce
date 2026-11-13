import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { initialProducts } from '../data/seedData.js';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'Cash on Delivery';
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  statusHistory: Array<{
    status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Store file path
const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// In-Memory & Local JSON Store
class LocalStore {
  users: IUser[] = [];
  products: IProduct[] = [];
  orders: IOrder[] = [];
  mode: 'file-store' | 'mongodb' = 'file-store';
  isConnected = false;

  async init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      try {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.products = data.products || [];
        this.orders = data.orders || [];
      } catch (err) {
        console.warn('Could not read existing store file, initializing fresh store:', err);
      }
    }

    if (this.users.length === 0 || this.products.length === 0) {
      await this.seedDefaults();
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        STORE_FILE,
        JSON.stringify(
          {
            users: this.users,
            products: this.products,
            orders: this.orders,
            lastSaved: new Date().toISOString()
          },
          null,
          2
        )
      );
    } catch (err) {
      console.error('Failed to write store file:', err);
    }
  }

  async seedDefaults() {
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const now = new Date().toISOString();

    if (this.users.length === 0) {
      this.users = [
        {
          _id: 'usr-admin-001',
          name: 'NovaMart Admin',
          email: 'admin@novamart.com',
          password: adminPassword,
          role: 'admin',
          phone: '+1 (555) 019-2834',
          address: {
            street: '100 Innovation Way',
            city: 'San Francisco',
            postalCode: '94105',
            country: 'USA'
          },
          createdAt: now,
          updatedAt: now
        },
        {
          _id: 'usr-customer-001',
          name: 'Alex Johnson',
          email: 'user@novamart.com',
          password: userPassword,
          role: 'user',
          phone: '+1 (555) 438-9210',
          address: {
            street: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '97477',
            country: 'USA'
          },
          createdAt: now,
          updatedAt: now
        }
      ];
    }

    if (this.products.length === 0) {
      this.products = initialProducts.map((p, idx) => ({
        _id: `prod-${String(idx + 1).padStart(3, '0')}`,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        stockQuantity: p.stockQuantity,
        rating: p.rating,
        numReviews: p.numReviews,
        isFeatured: !!p.isFeatured,
        createdAt: now,
        updatedAt: now
      }));
    }

    if (this.orders.length === 0) {
      const demoOrder: IOrder = {
        _id: 'ord-demo-001',
        orderId: 'ORD-94281',
        user: {
          _id: 'usr-customer-001',
          name: 'Alex Johnson',
          email: 'user@novamart.com'
        },
        orderItems: [
          {
            productId: 'prod-001',
            name: 'Sony WH-1000XM5 Wireless Headphones',
            quantity: 1,
            price: 399.99,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
          }
        ],
        shippingAddress: {
          fullName: 'Alex Johnson',
          phone: '+1 (555) 438-9210',
          address: '742 Evergreen Terrace',
          city: 'Springfield',
          postalCode: '97477'
        },
        paymentMethod: 'Cash on Delivery',
        subtotal: 399.99,
        shippingPrice: 0,
        totalPrice: 399.99,
        isPaid: false,
        isDelivered: false,
        orderStatus: 'Confirmed',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Order placed by customer' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 43200000).toISOString(), note: 'Order verified and processed' }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString()
      };
      this.orders.push(demoOrder);
    }

    this.save();
    console.log(`[Database] Initialized persistent store with ${this.products.length} products, ${this.users.length} users, and ${this.orders.length} orders.`);
  }
}

export const localDb = new LocalStore();

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.startsWith('mongodb')) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri.replace(/:([^:@]{3,})@/, ':***@')}...`);
      // Short timeout to avoid hanging server startup
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      localDb.mode = 'mongodb';
      localDb.isConnected = true;
      console.log('[Database] MongoDB successfully connected via Mongoose.');
      return;
    } catch (err) {
      console.warn('[Database] MongoDB connection failed or not available locally. Seamlessly falling back to persistent LocalStore engine.');
    }
  }

  // Fallback to local persistent store
  await localDb.init();
  localDb.mode = 'file-store';
  localDb.isConnected = true;
  console.log('[Database] Running on High-Performance Persistent Local Database engine.');
}
