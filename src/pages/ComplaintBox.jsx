import React from "react";

const ComplaintBox = () => {
  return (
    <main className="bg-white text-gray-800 md:m-10 m-4 border border-gray-300 rounded-t-2xl">
      {/* Header */}
      <section className="bg-[#292355] text-white text-center py-8  rounded-t-2xl ">
        <h1 className="text-2xl md:text-3xl font-bold">Complaint Box</h1>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-300 shadow-md rounded-xl p-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          
          {/* Left Text */}
          <div className="text-center md:text-left flex justify-center">
            <p className="text-lg  mb-4">
              For all types of complaints contact us
            </p>
          </div>

          {/* Right Image + Text */}
          <div className="flex flex-col items-center border-l border-gray-300">
            <p className="mb-2 text-xl font-semibold hidden md:block">For any complaint contact us</p>
            <img
              src="/Images/complaint.webp" // Replace with your image
              alt="Complaint Discussion"
              className="rounded-lg shadow-md w-full max-w-md"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ComplaintBox;
