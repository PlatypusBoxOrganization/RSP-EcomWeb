import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const {
    items,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return (
    <div className="min-h-screen bg-gray-50 p-10 px-2">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-md shadow-sm flex items-start justify-between"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.images?.[0] || '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-md">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹ {item.price}</p>
                    <p className="text-sm text-gray-400 line-through">
                      MRP: ₹ {item.mrp}
                    </p>
                    <p className="text-sm text-green-600">
                      {item.discount}% off
                    </p>
                    <div className="mt-2 flex gap-2">
                      <select className="border px-2 py-1 text-sm rounded">
                        <option>One Size</option>
                      </select>
                      <select
                        className="border px-2 py-1 text-sm rounded"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Delivery by <strong>{deliveryDate.toDateString()}</strong>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="text-sm text-pink-600 hover:underline">
                    Save to Wishlist
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-gray-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="w-full md:w-96 bg-white p-4 rounded-md shadow-sm h-fit space-y-4">
          <div className="text-sm border-b pb-2">
            <div className="flex justify-between">
              <span>Deliver To</span>
              <button className="text-blue-500 text-xs">Change</button>
            </div>
            <p className="text-gray-700 font-medium">Delhi, 110001</p>
            <button className="text-xs text-pink-600">Login to select/ add address</button>
          </div>

          <div className="text-sm">
            <button className="text-blue-500">Check for Coupons</button>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Cart Total</span>
              <span>₹ {cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fees</span>
              <span>₹ 10.00</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {cartTotal + 10}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Product Discount(s)</span>
              <span>- ₹ 2000.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹ {cartTotal + 10 - 2000}</span>
            </div>
          </div>
          <Link to="/checkout">
          <button className="bg-[#292355] text-white w-full py-2 rounded-md hover:bg-[#482e5e]">
            Checkout
          </button>
          </Link>

          <div className="text-xs text-gray-500 mt-5">
            <p>✅ Safe and secure payments</p>
            <p>🔁 Easy returns</p>
            <p>📦 100% Authentic products</p>
          </div>

          <div className="text-xs text-gray-600 text-center">
            Need Help? <button className="text-blue-500"><Link to="/contact" className="hover:text-blue-400">
              Contact Us
            </Link></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
