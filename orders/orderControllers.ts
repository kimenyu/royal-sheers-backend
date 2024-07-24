import { Request, Response } from 'express';
import Order, { OrderStatus } from '../models/orderModel';
import Cart, { ICartItem, ICart } from '../models/cartModel';
import { AuthRequest } from '../middlewares/userAuthMiddleware';
import { IProduct } from '../models/productModel';
import Notification from '../models/notificationModel';
import { client as redisClient } from '../utils/redisclient/myredis';

interface IPopulatedCartItem {
  product: IProduct;
  quantity: number;
}

interface IPopulatedCart extends Omit<ICart, 'items'> {
  items: IPopulatedCartItem[];
}

// Helper function to create a notification
const createNotification = async (userId: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
  const notification = new Notification({
    user: userId,
    message,
    type
  });
  await notification.save();
};

// Helper function to get order from cache or database
async function getOrderFromCacheOrDB(orderId: string, userId: string) {
  const cacheKey = `order:${orderId}:${userId}`;
  const cachedOrder = await redisClient.get(cacheKey);
  
  if (cachedOrder) {
    return JSON.parse(cachedOrder);
  }
  
  const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product');
  if (order) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(order)); // Cache for 1 hour
  }
  
  return order;
}

// Helper function to update order cache
async function updateOrderCache(orderId: string, userId: string, order: any) {
  const cacheKey = `order:${orderId}:${userId}`;
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(order));
}

// Helper function to invalidate user's orders cache
async function invalidateUserOrdersCache(userId: string) {
  const cacheKey = `orders:${userId}`;
  await redisClient.del(cacheKey);
}

// Create Order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const populatedCart = cart as unknown as IPopulatedCart;

    const orderItems = populatedCart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const order = new Order({
      user: req.user?.userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
      status: OrderStatus.PENDING
    });

    await order.save();
    await Cart.deleteOne({ _id: cart._id });

    // Invalidate user's orders cache
    await invalidateUserOrdersCache(req.user?.userId as string);

    // Create a notification for the new order
    await createNotification(req.user?.userId as string, `New order created with ID: ${order._id}`, 'success');

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all orders for a user
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const cacheKey = `orders:${userId}`;
    
    const cachedOrders = await redisClient.get(cacheKey);
    if (cachedOrders) {
      return res.status(200).json(JSON.parse(cachedOrders));
    }

    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(orders)); // Cache for 1 hour

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user?.userId as string;

    const order = await getOrderFromCacheOrDB(orderId, userId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user?.userId as string;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: userId },
      { status: status as OrderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order cache
    await updateOrderCache(orderId, userId, order);

    // Invalidate user's orders cache
    await invalidateUserOrdersCache(userId);

    // Create a notification for the status update
    await createNotification(userId, `Order ${orderId} status updated to ${status}`, 'info');

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cancel order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user?.userId as string;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: userId, status: OrderStatus.PENDING },
      { status: OrderStatus.CANCELLED },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    // Update order cache
    await updateOrderCache(orderId, userId, order);

    // Invalidate user's orders cache
    await invalidateUserOrdersCache(userId);

    // Create a notification for the cancelled order
    await createNotification(userId, `Order ${orderId} has been cancelled`, 'warning');

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};