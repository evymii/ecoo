import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage {
  url: string;
  isMain: boolean;
  order: number;
}

export interface IProduct extends Document {
  code: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: IProductImage[];
  features: {
    isNew: boolean;
    isFeatured: boolean;
    isDiscounted: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

const ProductSchema = new Schema<IProduct>(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    images: {
      type: [ProductImageSchema],
      default: [],
      validate: {
        validator: function(images: IProductImage[]) {
          return images.length <= 10;
        },
        message: 'Maximum 10 images allowed'
      }
    },
    features: {
      isNew: { type: Boolean, default: false },
      isFeatured: { type: Boolean, default: false },
      isDiscounted: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
