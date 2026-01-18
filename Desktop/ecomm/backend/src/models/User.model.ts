import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  phoneNumber: string;
  email: string;
  name: string;
  password: string; // 4-digit password hash
  role: 'admin' | 'user';
  address?: {
    city: string;
    district: string;
    khoroo: string;
    deliveryAddress: string;
    additionalInfo?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    address: {
      city: { type: String },
      district: { type: String },
      khoroo: { type: String },
      deliveryAddress: { type: String },
      additionalInfo: { type: String }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', UserSchema);
