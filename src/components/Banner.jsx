import React from 'react';
import { Link } from 'react-router-dom';
import { getImagePath } from '../utils/assetUtils';

const Banner = () => {
  return (
    <section className="relative bg-black text-white flex items-center h-[50vh] sm:h-[60vh] justify-center sm:justify-start sm:pl-5 bg-cover bg-center"
      style={{ backgroundImage: `url(${getImagePath('Main-banner.webp')})` }}>
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
        <Link to="/contact" className="mt-4 sm:mt-6 bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded shadow hover:bg-gray-100 transition-colors inline-block">
          Get Quote
        </Link>
      </div>
    </section>
  );
};

export default Banner;
