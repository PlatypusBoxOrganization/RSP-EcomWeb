# ElectroHive Cart Implementation

This document provides an overview of the cart functionality implementation in the ElectroHive e-commerce platform.

## Table of Contents
1. [Overview](#overview)
2. [Frontend Implementation](#frontend-implementation)
   - [CartContext](#cartcontext)
   - [Cart Component](#cart-component)
3. [Backend Implementation](#backend-implementation)
   - [API Endpoints](#api-endpoints)
   - [Data Models](#data-models)
4. [Features](#features)
5. [Error Handling](#error-handling)
6. [Testing](#testing)
7. [Future Improvements](#future-improvements)

## Overview
The cart functionality allows users to:
- Add/remove products
- Update quantities
- Apply coupon codes
- Proceed to checkout
- View order summary

## Frontend Implementation

### CartContext
The `CartContext` provides global state management for the shopping cart with the following features:
- Persistent cart state across the application
- API integration with the backend
- Loading and error states
- Helper methods for cart operations

Key methods:
- `addToCart(product)`: Add a product to the cart
- `removeFromCart(productId)`: Remove a product from the cart
- `updateQuantity(productId, quantity)`: Update product quantity
- `clearCart()`: Remove all items from the cart
- `refreshCart()`: Refresh cart data from the server

### Cart Component
The main cart interface includes:
- Product list with images and details
- Quantity controls
- Coupon code input
- Order summary
- Checkout button

## Backend Implementation

### API Endpoints

#### Cart Operations
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Data Models

#### Cart Model
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Features

### Real-time Updates
- Optimistic UI updates for better user experience
- Debounced quantity updates to reduce API calls
- Loading states during async operations

### Coupon System
- Support for percentage-based discounts
- Maximum discount limits
- Client-side validation
- Server-side validation (to be implemented)

### Responsive Design
- Mobile-friendly interface
- Adaptive layout for different screen sizes
- Touch-friendly controls

## Error Handling
- Client-side form validation
- Server-side validation
- User-friendly error messages
- Automatic retry for failed requests

## Testing
### Manual Testing Checklist
- [ ] Add items to cart
- [ ] Update item quantities
- [ ] Remove items from cart
- [ ] Apply valid coupon code
- [ ] Apply invalid coupon code
- [ ] Remove coupon
- [ ] Clear cart
- [ ] Proceed to checkout
- [ ] Test error scenarios

## Future Improvements
1. **Server-side Coupon Validation**
   - Implement database storage for coupons
   - Add expiration dates and usage limits

2. **Cart Persistence**
   - Save cart for logged-out users using localStorage
   - Merge guest cart with user cart on login

3. **Performance Optimizations**
   - Implement cart caching
   - Optimize database queries

4. **Additional Features**
   - Save for later functionality
   - Related products suggestions
   - Bulk actions
   - Wishlist integration

## Dependencies
- React Context API
- Axios for HTTP requests
- React Router for navigation
- React Icons
- React Toastify for notifications

## Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
# Other environment variables...
```

## Related Components
- `ProductCard` - For displaying products in the cart
- `Checkout` - For processing orders
- `AuthContext` - For user authentication

## Troubleshooting
### Common Issues
1. **Cart not updating**
   - Check network requests in browser dev tools
   - Verify authentication status
   - Check server logs for errors

2. **Duplicate items in cart**
   - Verify product IDs are consistent
   - Check add to cart logic

3. **Coupon not applying**
   - Check coupon code case sensitivity
   - Verify coupon validation logic

## Support
For any issues or questions, please contact the development team or create an issue in the repository.
