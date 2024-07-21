import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
  username: string;
  email: string;
  role: string;
  password: string;
  phone?: string;
}

const adminSchema: Schema<IAdmin> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'admin' },
  phone: { type: String, required: true, unique: true}
});

const Admin = mongoose.model<IAdmin>('User', adminSchema);
export default Admin;
