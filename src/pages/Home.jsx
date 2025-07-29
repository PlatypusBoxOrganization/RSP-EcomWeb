import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-black text-white flex items-center h-[50vh] sm:h-[60vh] justify-center sm:justify-start sm:pl-5 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/Main-banner.jpg')" }}
      >
        <div className="bg-black/50 w-full h-full absolute top-0 left-0"></div>
        <div className="relative z-10 text-center sm:text-left px-4 sm:px-6 bg-blue-400/10 flex flex-col items-center sm:items-start py-8 sm:py-10 rounded-xl sm:rounded-2xl max-w-[90%] sm:max-w-[80%] md:max-w-2xl md:pr-16">
          <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold leading-tight">
            Making Advance Technology
          </h1>
          <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold mb-2 sm:mb-3">
            For Better Future
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg italic">
            "Everything that can be automated will be automated"
          </p>
          <button className="mt-4 sm:mt-6 bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded shadow hover:bg-gray-100 transition-colors">
            Get Quote
          </button>
        </div>
      </section>
      {/* About Us Section */}
      <section className="py-8 sm:py-12 lg:pt-6 px-4 sm:px-6  text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 lg:mb-1">About Us</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center   max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-0 sm:mr-8 flex-shrink-0">
            <img
              src="/Images/logo.png"
              alt="About Us"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full hover:shadow-lg transition duration-300"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-left max-w-4xl">
            RS Portronics company is Micro-Electronics Company which deals with{' '}
            <strong>micro-electronics components and devices</strong>.
            <br className="hidden sm:block" />
            We deal with major electronics projects (Includes Robots, IOT
            Projects, Drones etc.) also. We provide the PCB Design, Fabrication
            and Assembly Service to both Private and Government organizations
            with <strong>Good Quality</strong> at low price.
          </p>
        </div>
      </section>
      {/* Product Sections */}
      <section className="py-8 sm:py-12 bg-gray-100 px-4 sm:px-6 ">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 md:mb-16 lg:mb-30">
          Our Products
        </h2>

        {/* Electronic Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 lg:mb-30 sm:mb-16 items-center bg-[#292355] text-white rounded-xl sm:rounded-2xl overflow-hidden lg:overflow-visible ">
          <div className="relative w-full h-40 sm:h-64 md:h-80 lg:h-82 lg:w-92 bg-[#482e5e] flex justify-center items-center -mt-8 sm:-mt-12 md:-mt-16 md:ml-30  rounded-xl sm:rounded-2xl shadow-lg transform md:-translate-y-8">
            <img
              src="/Images/pcb-circuit.png"
              alt="Electronic Project"
              className="pt-10 md:pt-0 w-4/12 sm:w-3/4 md:w-72 rounded-lg max-h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 sm:p-6 md:p-8 -mt-8 sm:-mt-0 lg:relative lg:right-25 ">
            <h3 className="text-lg sm:text-xl bg-[#482e5e] w-[60%]   sm:w-48 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-bold mb-3 sm:mb-4 text-center relative lg:-top-12 left-15 lg:left-15">
              Electronic Projects
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6  lg:relative lg:-top-4">
              Best Quality PCB Fabrication Service for Aerospace, Medical
              Departments and defense. Our company has Experienced Engineers for PCB Designing and
              customization. We support All Layers PCB (1-20) with custom Copper layer (1oz - 4oz).
              Customized IOT Modules for Automotive and Home Automation.
            </p>
            <Link to="/shop" >
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 rounded transition-colors">
              View Items
            </button>
            </Link>
          </div>
        </div>

        {/* Health Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8  items-center bg-[#292355] text-white rounded-xl sm:rounded-2xl overflow-hidden lg:overflow-visible">
          <div className="order-2 md:order-1 p-4 sm:p-6 md:p-8 -mt-8 sm:-mt-0 lg:relative lg:left-23">
            <h3 className="text-lg sm:text-xl bg-[#482e5e] w-[60%] sm:w-48 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold mb-3 sm:mb-4 text-center relative lg:-top-14 left-15 lg:left-15">
              Health Care
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              We offer medical hospital furniture for both human and animals'
              hospitals. We use best Quality SS and MS sheets and pipes for long-lasting
              reliability.
            </p>
            <Link to="/shop" >
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 rounded transition-colors">
              View Items
            </button>
            </Link>
          </div>
          <div className="relative lg:left-50 w-full h-48 sm:h-64 md:h-80  lg:h-82 lg:w-92 bg-[#482e5e] flex justify-center items-center -mt-8 sm:-mt-12 md:-mt-16 md:mr-8 order-1 md:order-2 rounded-xl sm:rounded-2xl shadow-lg transform md:-translate-y-8">
            <img
              src="/Images/PIO.jpg"
              alt="Health Care"
              className="pt-10 md:pt-0 w-4/12 sm:w-3/4 md:w-70 h-auto lg:h-60  max-h-full object-cover rounded-lg sm:rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
      {/* QR & Demo */}
      <section className="py-12 px-6 text-center bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
          <div className="p-4 bg-blue-100 rounded shadow">
            <h4 className="font-semibold mb-2">Scan to Shop</h4>
            <img
              src="/images/QR.jpeg"
              alt="QR Code"
              className="w-48 hover:shadow-lg rounded shadow transition duration-300 mx-auto"
            />
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Shop Now
            </button>
          </div>
          <div className="p-4 bg-blue-100 rounded shadow">
            <h4 className="font-semibold mb-2">Product Demo</h4>
            <iframe
              className="mx-auto w-full h-48 rounded"
              src="https://www.youtube.com/embed/nNI_x-WVTM0"
              title="Demo Video"
              allowFullScreen
            />
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Contact Us
            </button>
          </div>
        </div>
      </section>
      {/* Partners */}
      <section className="py-12 bg-gray-100 px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Our Partners</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className=" border border-gray-300 flex items-center justify-center bg-white w-50 h-35 hover:shadow-lg transition duration-300">
            <img
              src="/images/partner1.jpeg"
              alt="Partner 1"
              className="h-20"
            />
          </div>
          <div className=" border border-gray-300 flex items-center justify-center bg-white w-50 h-35 hover:shadow-lg transition duration-300">
            <img
              src="/images/partner2.jpeg"
              alt="Partner 2"
              className="h-20"
            />
          </div>
          <div className=" border border-gray-300 flex items-center justify-center bg-white w-50 h-35 hover:shadow-lg transition duration-300">
            <img
              src="/images/partner3.jpeg"
              alt="Partner 3"
              className="h-20"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
