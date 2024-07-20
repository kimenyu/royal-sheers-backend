import mongoose, { Document, Schema } from 'mongoose';

interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
}

const reviewSchema: Schema<IReview> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  appointment : { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
