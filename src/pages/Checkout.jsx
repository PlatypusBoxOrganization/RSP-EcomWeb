// src/pages/Checkout.jsx

import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      {/* <header className="flex items-center justify-between px-6 py-4 bg-indigo-900 text-white shadow-md sticky top-0 z-10">
        <div className="font-semibold text-lg">LOGO</div>
        <h1 className="text-xl font-bold">Secure Checkout <span className="text-sm">▼</span></h1>
        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-xl" />
          <span>Cart</span>
        </div>
      </header> */}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-10">

        {/* Left - Main Checkout Area */}
        <div className="w-full lg:w-2/3 space-y-6">

          {/* Delivery Details */}
          <section className="bg-white p-5 rounded shadow">
            <h2 className="font-semibold mb-2">Delivering to Pooja</h2>
            <p className="text-sm text-gray-600">Location text</p>
            <button className="text-sm text-blue-600 mt-2">Add delivery instructions</button>
          </section>

          {/* Payment Section */}
          <section className="bg-white p-5 rounded shadow">
            <h3 className="font-semibold mb-4">Your available balance</h3>

            <div className="space-y-4">
              {/* Amazon Pay */}
              <div className="border p-4 rounded">
                <input type="radio" name="payment" id="amazon" className="mr-2" />
                <label htmlFor="amazon">Use your ₹65.00 Amazon Pay Balance</label>
                <p className="text-xs text-gray-500 pl-6">Insufficient balance. <a href="#" className="text-blue-600">Add money</a></p>
                <div className="mt-3 flex flex-col items-center md:items-start">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="border px-2 py-1 rounded  items-center "
                  />
                  <button className="text-sm w-[30%] md:w-[10%]  bg-gray-200 px-3 py-1 rounded  mt-2  ">Apply</button>
                </div>
              </div>

              {/* Cards */}
              <div className="border p-4 rounded">
                <input type="radio" name="payment" id="card" className="mr-2" />
                <label htmlFor="card">Credit or debit card</label>
                <div className="pl-6 text-sm text-gray-600 mt-1">[Card icons here]</div>
              </div>

              {/* Net Banking */}
              <div className="border p-4 rounded">
                <input type="radio" name="payment" id="netbanking" className="mr-2" />
                <label htmlFor="netbanking">Net Banking</label>
                <div className="pl-0 mt-2">
                  <select className="border px-3 py-1 rounded w-full sm:w-1/2">
                    <option>Choose an option</option>
                    <option>HDFC</option>
                    <option>SBI</option>
                  </select>
                </div>
              </div>

              {/* Other UPI */}
              <div className="border p-4 rounded">
                <input type="radio" name="payment" id="upi" className="mr-2" />
                <label htmlFor="upi">Other UPI Apps</label>
              </div>

              {/* EMI */}
              <div className="border p-4 rounded opacity-50">
                <input type="radio" name="payment" disabled className="mr-2" />
                <label>EMI Unavailable <span className="text-blue-600 cursor-pointer ml-1">Why?</span></label>
              </div>

              {/* COD */}
              <div className="border p-4 rounded">
                <input type="radio" name="payment" id="cod" className="mr-2" />
                <label htmlFor="cod">Cash on Delivery/Pay on Delivery</label>
                <p className="text-sm text-gray-500 pl-6">Cash, UPI and Cards accepted. <a href="#" className="text-blue-600">Know more</a></p>
              </div>
            </div>

            <button className="mt-5 bg-[#292355] px-4 py-2 rounded font-semibold hover:bg-[#482e5e] text-white">
              Use this payment method
            </button>
          </section>

          {/* Review Items Section */}
          <section className="bg-white p-5 rounded shadow">
            <h3 className="font-semibold">Review items and shipping</h3>
            <p className="text-sm text-gray-600 mt-2">Text</p>
          </section>
        </div>

        {/* Right - Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-5 rounded shadow space-y-4">
            <button className="w-full bg-[#292355] py-2 rounded font-semibold hover:bg-[#482e5e] text-white">
              Use this payment method
            </button>

            <div className="text-sm space-y-2">
              <p className="flex justify-between"><span>Items:</span> <span>₹--</span></p>
              <p className="flex justify-between"><span>Delivery:</span> <span>₹--</span></p>
              <p className="font-semibold flex justify-between"><span>Order Total:</span> <span>₹--</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="bg-indigo-950 text-white text-sm mt-10">
        <div className="text-center py-3 bg-indigo-900">Back to top</div>
        <div className="py-5 px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-300">
          <span>LOGO</span>
          <span>Help</span>
          <span>Text</span>
        </div>
      </footer> */}
    </div>
  );
};

export default Checkout;
