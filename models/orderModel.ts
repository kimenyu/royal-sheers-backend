import mongoose, { Document, Schema } from 'mongoose';

// Define the enum for order status
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

interface IOrderItem extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema: Schema<IOrderItem> = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const orderSchema: Schema<IOrder> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre<IOrder>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;