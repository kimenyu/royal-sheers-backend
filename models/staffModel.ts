import mongoose, { Document, Schema } from 'mongoose';

interface IStaff extends Document {
  name: string;
  role: string;
  expertise: string[];
  verificationCode: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  password: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  performanceMetrics: {
    ratings: number;
    reviewsCount: number;
  };
}

const staffSchema: Schema<IStaff> = new Schema({
  name: { type: String, required: true },
  expertise: { type: [String], default: [] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, required: true, default: 'staff' },
  verificationCode: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  availability: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  }],
  performanceMetrics: {
    ratings: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
  }
});

const Staff = mongoose.model<IStaff>('Staff', staffSchema);
export default Staff;
