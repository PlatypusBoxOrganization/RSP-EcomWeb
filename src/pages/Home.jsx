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
            src="/public/images/logo.jpg"
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
    </main>
  );
};

export default Home;
