import { Request, Response } from 'express';
import Cart, { ICartItem } from '../models/cartModel';
import Product from '../models/productModel';
import { AuthRequest } from '../middlewares/userAuthMiddleware';

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    let cart = await Cart.findOne({ user: req.user?.userId });
    if (cart) {
      const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (cartItemIndex > -1) {
        // Item exists, update quantity
        cart.items[cartItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: ICartItem = { product: productId, quantity };
        cart.items.push(newItem);
      }
      cart.totalPrice += product.price * quantity;
    } else {
      // Create a new cart
      cart = new Cart({
        user: req.user?.userId,
        items: [{ product: productId, quantity }],
        totalPrice: product.price * quantity
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId }).populate('items.product');

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

    const cart = await Cart.findOne({ user: req.user?.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

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
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};