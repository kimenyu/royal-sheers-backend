import mongoose, { Document, Schema } from 'mongoose';

interface IGiftCard extends Document {
  code: string;
  value: number;
  expiryDate: Date;
  isRedeemed: boolean;
}

const giftCardSchema: Schema<IGiftCard> = new Schema({
  code: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isRedeemed: { type: Boolean, default: false }
});

const GiftCard = mongoose.model<IGiftCard>('GiftCard', giftCardSchema);
export default GiftCard;
