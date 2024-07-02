import mongoose, { Document, Schema } from 'mongoose';

const serviceTypes = [
  'Haircut',
  'Shave',
  'Facial',
  'Massage',
  'Manicure',
  'Pedicure',
  'Hair Coloring',
  'Hair Treatment',
  'Waxing',
  'Makeup',
  'Skin Care'
] as const;

type ServiceType = typeof serviceTypes[number];

interface IService extends Document {
  type: ServiceType;
  description?: string;
  price: number;
  duration: number; // duration in minutes
  addOns: string[];
  image?: string; // Add this line
}

const serviceSchema: Schema<IService> = new Schema({
  type: { type: String, enum: serviceTypes, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  addOns: { type: [String], default: [] },
  image: { type: String }, // Add this line
});

const Service = mongoose.model<IService>('Service', serviceSchema);
export default Service;
