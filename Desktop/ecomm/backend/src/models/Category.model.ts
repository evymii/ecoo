import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameEn?: string; // Optional English name
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    nameEn: {
      type: String
    },
    description: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
