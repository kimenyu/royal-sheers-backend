import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
