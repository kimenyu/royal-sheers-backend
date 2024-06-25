import mongoose, { Document, Schema } from 'mongoose';

interface ILoyaltyProgram extends Document {
  user: mongoose.Types.ObjectId;
  points: number;
  rewards: string[];
}

const loyaltyProgramSchema: Schema<ILoyaltyProgram> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  rewards: { type: [String], default: [] }
});

const LoyaltyProgram = mongoose.model<ILoyaltyProgram>('LoyaltyProgram', loyaltyProgramSchema);
export default LoyaltyProgram;
