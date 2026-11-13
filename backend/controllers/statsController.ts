import { Request, Response } from 'express';
import { localDb } from '../config/db.js';
import { ProductRepo } from '../models/Product.js';
import { OrderRepo } from '../models/Order.js';
import { UserRepo } from '../models/User.js';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductRepo.find({});
    const orders = await OrderRepo.findAll();
    const totalUsers = await UserRepo.count();

    const totalProducts = products.length;
    const totalOrders = orders.length;

    // Calculate revenue from non-cancelled orders
    const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    // Status breakdown
    const statusCounts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    orders.forEach(o => {
      if (statusCounts[o.orderStatus] !== undefined) {
        statusCounts[o.orderStatus]++;
      }
    });

    // Low stock items (stock <= 10)
    const lowStock = products.filter(p => p.stockQuantity <= 10);

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalUsers,
        statusCounts,
        lowStockCount: lowStock.length,
        lowStockItems: lowStock.map(p => ({
          _id: p._id,
          name: p.name,
          stockQuantity: p.stockQuantity,
          category: p.category,
          price: p.price
        })),
        categoryCounts,
        recentOrders,
        database: {
          mode: localDb.mode,
          isConnected: localDb.isConnected,
          storageType: localDb.mode === 'mongodb' ? 'MongoDB Atlas / Local Server' : 'Persistent File Storage (JSON)'
        }
      }
    });
  } catch (error: any) {
    console.error('Error in stats controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetSeedData = async (_req: Request, res: Response): Promise<void> => {
  try {
    localDb.products = [];
    localDb.users = [];
    localDb.orders = [];
    await localDb.seedDefaults();

    res.status(200).json({
      success: true,
      message: 'Database has been restored to pristine seed state with default products, admin, and test user!'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
