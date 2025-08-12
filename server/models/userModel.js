import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Address sub-schema
const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an address name (e.g., Home, Work)'],
    trim: true,
    maxlength: [50, 'Address name cannot be more than 50 characters'],
  },
  street: {
    type: String,
    required: [true, 'Please add a street address'],
    trim: true,
    maxlength: [200, 'Street address cannot be more than 200 characters'],
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
    trim: true,
    maxlength: [100, 'City name cannot be more than 100 characters'],
  },
  state: {
    type: String,
    required: [true, 'Please add a state'],
    trim: true,
    maxlength: [100, 'State name cannot be more than 100 characters'],
  },
  postalCode: {
    type: String,
    required: [true, 'Please add a postal code'],
    trim: true,
    match: [/^[0-9]{6}$/, 'Please add a valid 6-digit postal code'],
  },
  country: {
    type: String,
    required: [true, 'Please add a country'],
    trim: true,
    default: 'India',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

// Order sub-schema
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: addressSchema,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'card', 'upi'],
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
      match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    addresses: [addressSchema],
    orders: [orderSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
