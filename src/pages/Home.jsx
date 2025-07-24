import React from "react";

const Home = () => {
  return (
    <main className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-black text-white  flex items-center h-[60vh] justify-start pl-5 bg-cover bg-center "
        style={{ backgroundImage: "url('/Images/Main-banner.jpg')" }}
      >
        <div className="bg-black/50 w-full h-full absolute top-0 left-0"></div>
        <div className="relative z-10 text-center px-6 bg-blue-400/10 flex flex-col items-start py-10 rounded-2xl">
          <h1 className="text-4xl md:text-5xl font-bold">
            Making Advance Technology
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold"> For Better Future</h1>
          <p className="mt-4 text-lg italic">
            "Everything that can be automated will be automated"
          </p>
          <button className="mt-6 bg-white text-black px-6 py-2 font-semibold rounded shadow hover:bg-gray-100">
            Get Quote
          </button>
        </div>
      </section>
      {/* About Us Section */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <div className="flex justify-center items-center ">
          <img
            src="/public/images/logo.png"
            alt="About Us"
            className="relative left-25 top-2  w-20 h-20 mx-auto mb-4 rounded-full hover:shadow-lg transition duration-300"
          />

          <p className=" max-w-4xl mr-66  text-gray-700 leading-relaxed">
            RS Portronics company is Micro-Electronics Company which deals with{" "}
            <strong>micro-electronics components and devices</strong>.<br />
            We deal with major electronics projects (Includes Robots, IOT
            Projects, Drones etc.) also. We provide the PCB Design, Fabrication
            and Assembly Service to both Private and Government organizations
            with <strong>Good Quality</strong> at low price.
          </p>
        </div>
      </section>
      {/* Product Sections */}
      <section className="py-12 bg-gray-100 px-6">
        <h2 className="text-2xl font-bold text-center mb-16">Our Products</h2>

        {/* Electronic Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-22 items-center bg-[#292355] text-white ">
          <div className="relative left-50 -top-10  bg-[#482e5e] rounded-2xl w-92 h-82 flex justify-center items-center ">
            <img
              src="/Images/pcb-circuit.png"
              alt="Electronic Project"
              className="w-72 hover:shadow-lg rounded shadow transition duration-300"
            />
          </div>
          <div className="relative -left-15">
            <h3 className="relative -top-18 text-xl bg-[#482e5e] w-60 flex justify-center items-center py-3 rounded-xl font-bold mb-2">
              Electronic Projects
            </h3>
            <p className=" leading-relaxed mb-4">
              Best Quality PCB Fabrication Service for Aerospace, Medical
              Departments and defense. <br />
              Our company has Experienced Engineers for PCB Designing and
              customization. <br />
              We support All Layers PCB (1-20) with custom Copper layer (1oz -
              4oz).
              <br />
              Customized IOT Modules for Automotive and Home Automation.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>

        {/* Health Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center  bg-[#292355] text-white">
          <div className="order-2 pl-50 md:order-1">
            <h3 className="relative -top-18 text-xl bg-[#482e5e] w-60 py-3 rounded-xl  flex justify-center items-center font-bold mb-2">
              Health Care
            </h3>
            <p className=" leading-relaxed mb-4">
              We offer medical hospital furniture for both human and animals'
              hospitals. <br />
              We use best Quality SS and MS sheets and pipes for long-lasting
              reliability.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Items
            </button>
          </div>
          <div className=" relative  -right-40 -top-10 order-1  bg-[#482e5e] flex justify-center items-center rounded-2xl md:order-2 w-92 h-82 ">
            <img
              src="/Images/PIO.jpg"
              alt="Health Care"
              className="w-72  hover:shadow-lg rounded shadow transition duration-300"
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
              src="/public/images/QR.jpeg"
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
              src="/public/images/partner1.jpeg"
              alt="Partner 1"
              className="h-20"
            />
          </div>
          <div className=" border border-gray-300 flex items-center justify-center bg-white w-50 h-35 hover:shadow-lg transition duration-300">
            <img
              src="/public/images/partner2.jpeg"
              alt="Partner 2"
              className="h-20"
            />
          </div>
          <div className=" border border-gray-300 flex items-center justify-center bg-white w-50 h-35 hover:shadow-lg transition duration-300">
            <img
              src="/public/images/partner3.jpeg"
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
