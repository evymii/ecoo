import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  deliveryAddress: {
    address: string;
    additionalInfo?: string;
  };
  paymentMethod?: 'pay_later' | 'paid_personally' | 'bank_transfer';
  orderCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryAddress: {
      address: { type: String, required: true },
      additionalInfo: { type: String }
    },
    paymentMethod: {
      type: String,
      enum: ['pay_later', 'paid_personally', 'bank_transfer'],
      default: 'pay_later'
    },
    orderCode: {
      type: String,
      unique: true,
      sparse: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
