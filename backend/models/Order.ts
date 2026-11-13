import mongoose, { Schema, Document } from 'mongoose';
import { localDb, IOrder, IOrderItem, IShippingAddress } from '../config/db.js';
import { ProductRepo } from './Product.js';

export interface IOrderDocument extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  statusHistory: Array<{
    status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    timestamp: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }
});

const shippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true }
});

const orderSchema = new Schema<IOrderDocument>(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    subtotal: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    statusHistory: [
      {
        status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', orderSchema);

export const OrderRepo = {
  async findById(idOrOrderId: string): Promise<IOrder | null> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const isObjectId = mongoose.Types.ObjectId.isValid(idOrOrderId);
      const query = isObjectId ? { $or: [{ _id: idOrOrderId }, { orderId: idOrOrderId }] } : { orderId: idOrOrderId };
      const doc = await OrderModel.findOne(query).populate('user', 'name email');
      return doc ? (doc.toObject() as unknown as IOrder) : null;
    }
    const found = localDb.orders.find(o => o._id === idOrOrderId || o.orderId === idOrOrderId);
    return found ? { ...found } : null;
  },

  async findByUser(userId: string): Promise<IOrder[]> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const list = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
      return list.map(d => d.toObject() as unknown as IOrder);
    }
    return localDb.orders
      .filter(o => o.user._id === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findAll(status?: string): Promise<IOrder[]> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const filter = status && status !== 'All' ? { orderStatus: status } : {};
      const list = await OrderModel.find(filter).sort({ createdAt: -1 });
      return list.map(d => d.toObject() as unknown as IOrder);
    }
    let list = [...localDb.orders];
    if (status && status !== 'All') {
      list = list.filter(o => o.orderStatus === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(orderInput: {
    user: { _id: string; name: string; email: string };
    orderItems: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod?: 'Cash on Delivery';
  }): Promise<IOrder> {
    // 1. Stock validation & calculation
    let subtotal = 0;
    for (const item of orderInput.orderItems) {
      const product = await ProductRepo.findById(item.productId);
      if (!product) {
        throw new Error(`Product "${item.name}" not found`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
      }
      subtotal += Number(product.price) * item.quantity;
    }

    // Free shipping for orders >= $50, else $9.99
    const shippingPrice = subtotal >= 50 ? 0 : 9.99;
    const totalPrice = Number((subtotal + shippingPrice).toFixed(2));
    subtotal = Number(subtotal.toFixed(2));

    // Decrement stock for ordered products
    for (const item of orderInput.orderItems) {
      const product = await ProductRepo.findById(item.productId);
      if (product) {
        const newStock = Math.max(0, product.stockQuantity - item.quantity);
        await ProductRepo.update(product._id, { stockQuantity: newStock });
      }
    }

    const uniqueOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newOrder: IOrder = {
      _id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId: uniqueOrderId,
      user: orderInput.user,
      orderItems: orderInput.orderItems,
      shippingAddress: orderInput.shippingAddress,
      paymentMethod: 'Cash on Delivery',
      subtotal,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Order successfully placed. Cash on Delivery selected.'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await OrderModel.create({
        ...newOrder,
        user: new mongoose.Types.ObjectId(orderInput.user._id)
      });
      return doc.toObject() as unknown as IOrder;
    }

    localDb.orders.unshift(newOrder);
    localDb.save();
    return { ...newOrder };
  },

  async updateStatus(
    idOrOrderId: string,
    newStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled',
    note?: string
  ): Promise<IOrder | null> {
    const now = new Date().toISOString();
    const historyEntry = {
      status: newStatus,
      timestamp: now,
      note: note || `Status updated to ${newStatus}`
    };

    const isDelivered = newStatus === 'Delivered';

    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const query = mongoose.Types.ObjectId.isValid(idOrOrderId)
        ? { $or: [{ _id: idOrOrderId }, { orderId: idOrOrderId }] }
        : { orderId: idOrOrderId };

      const updated = await OrderModel.findOneAndUpdate(
        query,
        {
          $set: { orderStatus: newStatus, isDelivered },
          $push: { statusHistory: historyEntry }
        },
        { new: true }
      );
      return updated ? (updated.toObject() as unknown as IOrder) : null;
    }

    const index = localDb.orders.findIndex(o => o._id === idOrOrderId || o.orderId === idOrOrderId);
    if (index === -1) return null;

    const order = localDb.orders[index];

    // If changing to Cancelled and was not cancelled before, restore stock
    if (newStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        const prod = await ProductRepo.findById(item.productId);
        if (prod) {
          await ProductRepo.update(prod._id, { stockQuantity: prod.stockQuantity + item.quantity });
        }
      }
    }

    order.orderStatus = newStatus;
    order.isDelivered = isDelivered;
    if (isDelivered) {
      // In Cash on Delivery, delivered means customer paid cash
      order.isPaid = true;
    }
    order.updatedAt = now;
    order.statusHistory.push(historyEntry);

    localDb.save();
    return { ...order };
  },

  async count(): Promise<number> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      return await OrderModel.countDocuments();
    }
    return localDb.orders.length;
  }
};
