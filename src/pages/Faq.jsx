import React from "react";

const Faq = () => {
  return (
    <main className="bg-white text-gray-800 m-4 md:m-10  border border-gray-300 rounded-t-xl h-230">
      {/* Header Section */}
      <section className="bg-[#292355] text-white py-10 px-6 rounded-t-xl text-center relative  flex items-center justify-center">
        <div className=" justify-center md:pr-5 hidden md:block ">
          <img
            src="/public/images/faq-question marks.png" // Replace with your actual icon image
            alt="FAQ Icon"
            className="md:w-12 md:h-12 w-8 h-8"
          />
        </div>
       <div> <h1 className="text-lg md:text-3xl font-bold">Frequently Asked Questions</h1></div>
      </section>

        <img src="/public/images/FAQ-question1.png" className="relative left-130 top-40 opacity-10 hidden md:block  w-50 z-1 " />
      {/* FAQ Content */}
      <section className="max-w-6xl mx-auto px-6 lg:px-0 py-12  items-start">
        {/* Questions */}
        <div className="relative lg:-top-40 lg:space-y-6 z-2">
          <div>
            <h3 className="font-bold">What is the purpose of our company?</h3>
            <p className="text-sm/7 mt-1">
            The Main purpose of our company to provide best service in all over India. As we provide all products at whole sale price

            </p>
          </div>

          <div>
            <h3 className="font-bold">Which projects we deal?</h3>
            <p className="text-sm/7 mt-1 ">
            We deals with trading of Electronic Components at whole-sale price. Also we make Electronic projects for school and college students. Now we have started manufacturing of Electronic PCbs as well. in Medical line we deals with Medical beds both manual and automatic motor control. If we talk about Physiotherapy produ so we provide Advanced technology unweigh harness machines to lift the handicap patients.

            </p>
          </div>

          <div>
            <h3 className="font-bold">What are the services that we provide?</h3>
            <p className="text-sm/7 mt-1">PCB Manufacturing and Assembly.</p>
          </div>

          <div>
            <h3 className="font-bold">Where can we shop the products?</h3>
            <p className="text-sm/7 mt-1">
            For Electronic Components Please Go on Amazon site or Contact Us by clicking <strong>Contact Us</strong> button in our website. <br />
            <br />
            For any medical products and Peb manufacturing Query
            <br />
            Please click on <strong>Contact Us</strong> Button.
            </p>
          </div>
        </div>

            <img src="/public/images/line.jpg" className="relative  top-0 h-1 w-1000  z-3 rounded-2xl hidden md:block" />
            <img src="/public/images/line.jpg" className="relative  left-250 -top-100 h-1 w-100  z-3 rotate-90 rounded-2xl hidden md:block" />
        {/* Image */}
        <div className=" relative -top-80 flex justify-center md:justify-end z-2">
          <img
            src="/public/images/faq-illustration.png" // Put your FAQ illustration image here
            alt="FAQ Illustration"
            className="w-72 rounded-xl hidden md:block"
          />
        </div>
      </section>
    </main>
  );
};

export default Faq;
