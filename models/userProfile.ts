import mongoose, { Document, Schema } from 'mongoose';

interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId; // Reference to User model
  bio?: string; // Short biography or description
  profilePicture?: string; // URL to profile picture
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }; // Optional address details
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  }; // Optional social media links
}

const userProfileSchema: Schema<IUserProfile> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String },
  profilePicture: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  }
});

const UserProfile = mongoose.model<IUserProfile>('UserProfile', userProfileSchema);
export default UserProfile;
