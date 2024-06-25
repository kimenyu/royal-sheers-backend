import mongoose, { Document, Schema } from 'mongoose';

interface IMembership extends Document {
  type: string;
  benefits: string[];
  users: mongoose.Types.ObjectId[];
}

const membershipSchema: Schema<IMembership> = new Schema({
  type: { type: String, required: true },
  benefits: { type: [String], default: [] },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Membership = mongoose.model<IMembership>('Membership', membershipSchema);
export default Membership;
