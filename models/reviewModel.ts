import mongoose, { Document, Schema } from 'mongoose';

interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
}

const reviewSchema: Schema<IReview> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
