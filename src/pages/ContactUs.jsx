import React from 'react';

const ContactUs = () => {
  return (
    <main className="bg-white text-gray-800 m-10 border border-gray-300 rounded-xl shadow-lg ">
      {/* Header Section */}
      <section className="bg-[#2e3a5e] text-white text-center py-8 rounded-t-xl">
        <h1 className="text-3xl font-bold">Get in Touch</h1>
        <p className="mt-2 text-sm">Any Query? Just write us a message</p>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src="/public/images/contactus.jpg" // Put this image in public/images/
            alt="Support representative"
            className="rounded-xl shadow-lg w-122 "
          />
        </div>

        {/* Form */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Full Name</label>
              <input type="text" placeholder="Enter your name"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500" />
            </div>

            <div>
              <label className="block font-semibold">Email</label>
              <input type="email" placeholder="Enter your email"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500" />
            </div>

            <div>
              <label className="block font-semibold">Phone number</label>
              <input type="tel" placeholder="Enter your number"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500" />
            </div>

            <div>
              <label className="block font-semibold">Message</label>
              <textarea placeholder="Type your message..."
                className="w-full border border-gray-300 px-4 py-2 rounded h-28 resize-none focus:outline-blue-500" />
            </div>

            <button type="submit"
              className="relative left-50 bg-[#2e3a5e] text-white font-semibold  py-2 px-16 rounded hover:bg-[#1f2b45] transition">
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
