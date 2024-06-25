import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  preferences: string[];
  history: mongoose.Types.ObjectId[];
  loyaltyPoints: number;
  membership?: mongoose.Types.ObjectId;
  verificationCode: string;
  isVerified: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  preferences: { type: [String], default: [] },
  history: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  loyaltyPoints: { type: Number, default: 0 },
  membership: { type: Schema.Types.ObjectId, ref: 'Membership' }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
