import { Request, Response } from 'express';
import Cart, { ICartItem } from '../models/cartModel';
import Product from '../models/productModel';
import { AuthRequest } from '../middlewares/userAuthMiddleware';
import { client as redisClient } from '../utils/redisclient/myredis';

// Helper function to get cart from cache or database
async function getCartFromCacheOrDB(userId: string) {
  const cacheKey = `cart:${userId}`;
  const cachedCart = await redisClient.get(cacheKey);
  
  if (cachedCart) {
    return JSON.parse(cachedCart);
  }
  
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (cart) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(cart)); // Cache for 1 hour
  }
  
  return cart;
}

// Helper function to update cart in cache
async function updateCartCache(userId: string, cart: any) {
  const cacheKey = `cart:${userId}`;
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(cart));
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    let cart = await getCartFromCacheOrDB(userId);
    if (cart) {
      const cartItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
      if (cartItemIndex > -1) {
        // Item exists, update quantity
        cart.items[cartItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: ICartItem = { product: product, quantity };
        cart.items.push(newItem);
      }
      cart.totalPrice += product.price * quantity;
    } else {
      // Create a new cart
      cart = new Cart({
        user: userId,
        items: [{ product: product, quantity }],
        totalPrice: product.price * quantity
      });
    }

    await cart.save();
    await updateCartCache(userId, cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const cart = await getCartFromCacheOrDB(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove from Cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId;

    let cart = await getCartFromCacheOrDB(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    const product = cart.items[cartItemIndex].product;

    if (quantity && cart.items[cartItemIndex].quantity > quantity) {
      // Reduce quantity
      cart.items[cartItemIndex].quantity -= quantity;
      cart.totalPrice -= quantity * product.price;
    } else {
      // Remove entire item
      cart.totalPrice -= cart.items[cartItemIndex].quantity * product.price;
      cart.items.splice(cartItemIndex, 1);
    }

    await cart.save();
    await updateCartCache(userId, cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};