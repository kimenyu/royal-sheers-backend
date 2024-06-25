import mongoose, { Document, Schema } from 'mongoose';

interface IStaff extends Document {
  name: string;
  role: string;
  expertise: string[];
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
  role: { type: String, required: true },
  expertise: { type: [String], default: [] },
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
