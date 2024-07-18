import mongoose, { Document, Schema } from 'mongoose';

interface IStaffProfile extends Document {
  staff: mongoose.Schema.Types.ObjectId;
  profilePicture?: string;
  bio: string;
  socialMediaLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const staffProfileSchema: Schema<IStaffProfile> = new Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  profilePicture: { type: String, default: '', required: true },
  bio: { type: String, default: '' },
  socialMediaLinks: {
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' }
  }
});

const StaffProfile = mongoose.model<IStaffProfile>('StaffProfile', staffProfileSchema);
export default StaffProfile;
