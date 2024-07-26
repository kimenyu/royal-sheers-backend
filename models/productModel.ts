import mongoose, { Document, Schema } from 'mongoose';

// In productModel.ts
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  createdBy: mongoose.Types.ObjectId; 
}


const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true }

});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
