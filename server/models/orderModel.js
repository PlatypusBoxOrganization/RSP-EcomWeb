import mongoose from 'mongoose';

const orderStatus = {
  PLACED: 'placed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const paymentResultSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String }
}, { _id: false });

// Function to generate order number
const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${timestamp}${random}`;
};

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: generateOrderNumber
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.PLACED,
    required: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(orderStatus),
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  }],
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    postalCode: { type: String, required: [true, 'Postal code is required'] },
    country: { type: String, required: [true, 'Country is required'], default: 'India' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Razorpay', 'Cash On Delivery', 'Other']
  },
  paymentResult: paymentResultSchema,
  razorpayOrderId: {
    type: String,
    required: function() { return this.paymentMethod === 'Razorpay'; },
    default: null
  },
  razorpayPaymentId: {
    type: String,
    required: function() { return this.paymentMethod === 'Razorpay'; },
    default: null
  },
  razorpaySignature: {
    type: String,
    required: function() { return this.paymentMethod === 'Razorpay'; },
    default: null
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
    default: 'pending'
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: generateOrderNumber
  }
}, {
  timestamps: true
});

// Calculate delivery date (3-7 business days from order date)
orderSchema.virtual('estimatedDeliveryDate').get(function() {
  const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3-7 days
  const date = new Date(this.createdAt);
  date.setDate(date.getDate() + deliveryDays);
  return date;
});

// Add status to the schema as a static property
orderSchema.statics.status = orderStatus;

// Add pre-save hook to track status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory = this.statusHistory || [];
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: this._update?.$set?.statusHistory?.[0]?.changedBy || null,
      reason: this._update?.$set?.statusHistory?.[0]?.reason || null
    });
  }
  next();
});

// Add method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return [orderStatus.PLACED, orderStatus.PROCESSING].includes(this.status);
};

const Order = mongoose.model('Order', orderSchema);

export { Order, orderStatus };
