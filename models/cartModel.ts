import mongoose, { Document, Schema } from 'mongoose';

interface ICartItem extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const cartItemSchema: Schema<ICartItem> = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema: Schema<ICart> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, required: true, default: 0 }
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
