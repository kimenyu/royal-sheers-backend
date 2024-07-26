import Product from "../models/productModel";
import { Request, Response } from 'express';
import { AdminRequest } from '../middlewares/adminMiddleware';
import upload from '../utils/imagesupload/multerConfig';


// Create Product
export const createProduct = [
    upload.single('image'),
    async (req: AdminRequest, res: Response) => {
      try {
        const { name, description, price, stock } = req.body;
        const image = req.file?.path;
  
        const product = new Product({ name, description, price, stock, image });
        await product.save();
  
        res.status(201).json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
];

  
  // Get All Products with Search and Pagination
export const getAllProducts = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
  
      const query = {
        name: { $regex: search, $options: 'i' }
      };
  
      const products = await Product.find(query)
        .skip((+page - 1) * +limit)
        .limit(+limit);
  
      const total = await Product.countDocuments(query);
  
      res.status(200).json({
        products,
        currentPage: +page,
        totalPages: Math.ceil(total / +limit),
        totalItems: total
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

  
  // Get Product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

  
  // Update Product
export const updateProduct = [
    upload.single('image'),
    async (req: AdminRequest, res: Response) => {
      try {
        const { name, description, price, stock } = req.body;
        const image = req.file?.path;
  
        const product = await Product.findById(req.params.id);
  
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
  
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.image = image || product.image;
  
        await product.save();
  
        res.status(200).json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
];

// Delete Product
export const deleteProduct = async (req: AdminRequest, res: Response) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
    