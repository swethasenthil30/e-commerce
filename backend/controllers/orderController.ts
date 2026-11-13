import { Response } from 'express';
import { OrderRepo } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please login to place an order' });
      return;
    }

    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400).json({ success: false, message: 'Shopping cart is empty. Please add items.' });
      return;
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone ||
      !shippingAddress.postalCode
    ) {
      res.status(400).json({
        success: false,
        message: 'Please provide full delivery address and phone number'
      });
      return;
    }

    // Default payment method is Cash on Delivery
    const order = await OrderRepo.create({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      orderItems,
      shippingAddress,
      paymentMethod: 'Cash on Delivery'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Cash on Delivery confirmed.',
      order
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to place order' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const orders = await OrderRepo.findByUser(req.user._id);
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const order = await OrderRepo.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Check authorization: must be the order owner or an admin
    if (order.user._id !== req.user._id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      return;
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const orders = await OrderRepo.findAll(status as string);
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
      return;
    }

    const updated = await OrderRepo.updateStatus(id, status, note);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}" successfully`,
      order: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { reason } = req.body;

    const order = await OrderRepo.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Only order owner or admin can cancel
    const isOwner = order.user._id === req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
      return;
    }

    if (order.orderStatus === 'Delivered') {
      res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled.' });
      return;
    }

    if (order.orderStatus === 'Cancelled') {
      res.status(400).json({ success: false, message: 'Order is already cancelled' });
      return;
    }

    const updated = await OrderRepo.updateStatus(
      id,
      'Cancelled',
      reason ? `Cancelled: ${reason}` : (isAdmin ? 'Cancelled by Administrator' : 'Cancelled by Customer')
    );

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and product inventory has been restored',
      order: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
