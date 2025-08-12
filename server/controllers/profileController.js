import User from '../models/userModel.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get user profile
// @route   GET /api/profile/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone } = req.body;
  
  // Create fields object
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (phone) fieldsToUpdate.phone = phone;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    { new: true, runValidators: true }
  ).select('-password');
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Add address to user profile
// @route   POST /api/profile/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res, next) => {
  const { name, street, city, state, postalCode, country, isDefault } = req.body;
  
  const user = await User.findById(req.user.id);
  
  // If setting as default, unset other default addresses
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  const newAddress = {
    name,
    street,
    city,
    state,
    postalCode,
    country: country || 'India',
    isDefault: isDefault || false
  };
  
  user.addresses.push(newAddress);
  await user.save();
  
  res.status(201).json({
    success: true,
    data: user.addresses[user.addresses.length - 1] // Return the newly added address
  });
});

// @desc    Update address
// @route   PUT /api/profile/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(async (req, res, next) => {
  const { name, street, city, state, postalCode, country, isDefault } = req.body;
  const { addressId } = req.params;
  
  const user = await User.findById(req.user.id);
  
  // Find the address index
  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    return next(new ErrorResponse('Address not found', 404));
  }
  
  // If setting as default, unset other default addresses
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // Update the address
  user.addresses[addressIndex] = {
    ...user.addresses[addressIndex].toObject(),
    name: name || user.addresses[addressIndex].name,
    street: street || user.addresses[addressIndex].street,
    city: city || user.addresses[addressIndex].city,
    state: state || user.addresses[addressIndex].state,
    postalCode: postalCode || user.addresses[addressIndex].postalCode,
    country: country || user.addresses[addressIndex].country,
    isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault
  };
  
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user.addresses[addressIndex]
  });
});

// @desc    Delete address
// @route   DELETE /api/profile/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  
  const user = await User.findById(req.user.id);
  
  // Find the address index
  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    return next(new ErrorResponse('Address not found', 404));
  }
  
  // Remove the address
  user.addresses.splice(addressIndex, 1);
  await user.save();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user orders
// @route   GET /api/profile/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('orders');
  
  res.status(200).json({
    success: true,
    count: user.orders.length,
    data: user.orders
  });
});

// @desc    Get single order
// @route   GET /api/profile/orders/:orderId
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  
  const user = await User.findOne(
    { 'orders._id': orderId },
    { 'orders.$': 1 }
  );
  
  if (!user || !user.orders || user.orders.length === 0) {
    return next(new ErrorResponse('Order not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: user.orders[0]
  });
});
