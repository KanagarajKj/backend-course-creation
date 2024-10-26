import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      required: false, // Optional: Make it required
      unique: true, // Optional: Ensure unique email addresses
    },
    userName: {
      type: String,
      required: true, // Optional: Make it required
    },
    imageUrl: String,
    password: String,
    googleId: String,
    githubId: String,
    isActive: { type: Boolean, required: true, default: true },
    isGoogleUser: { type: Boolean, default: false },
    isGitHubUser: { type: Boolean, default: false },
    deviceLoginCount: { type: Number, default: 0 },
    refreshToken: { type: String, default: null }, // Added refreshToken field
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
