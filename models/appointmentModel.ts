import mongoose, { Document, Schema } from 'mongoose';

interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  services: mongoose.Types.ObjectId[];
  date: Date;
  status: 'booked' | 'completed' | 'cancelled';
  totalPrice: number;
}

const appointmentSchema: Schema<IAppointment> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
  services: [{ type: Schema.Types.ObjectId, ref: 'Service', required: true }],
  date: { type: Date, required: true },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
  totalPrice: { type: Number }
});

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
export default Appointment;
