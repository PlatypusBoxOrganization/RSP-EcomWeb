import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      validate: {
        validator: function(v) {
          return /^(https?:\/\/|\/)/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Please add the count in stock'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    color: {
      type: String,
      trim: true,
      default: 'Black',
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add text index for search
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  category: 'text'
});

// Query middleware to filter out soft-deleted products
productSchema.pre(/^find/, function(next) {
  // Only include active products by default
  if (this.getFilter().includeInactive !== true) {
    this.find({ isActive: { $ne: false } });
  }
  next();
});

// Static method to get all products including inactive ones
productSchema.statics.findAllIncludingInactive = function() {
  return this.find({}).setOptions({ includeInactive: true });
};

// Method to soft delete a product
productSchema.methods.softDelete = async function() {
  this.isActive = false;
  this.deletedAt = new Date();
  await this.save();
};

// Method to restore a soft-deleted product
productSchema.methods.restore = async function() {
  this.isActive = true;
  this.deletedAt = null;
  await this.save();
};

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.price * (1 - (this.discount / 100));
});

// Add a compound index for common queries
productSchema.index({ category: 1, brand: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
