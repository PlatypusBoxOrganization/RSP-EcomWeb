import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import { getImagePath } from '../utils/assetUtils';

const features = [
  {
    title: 'Electronic Projects',
    description: 'Best Quality PCB Fabrication Service for Aerospace, Medical Departments and defense. Our company has Experienced Engineers for PCB Designing and customization. We support All Layers PCB (1-20) with custom Copper layer (1oz - 4oz). Customized IOT Modules for Automotive and Home Automation.',
    image: getImagePath('pcb-circuit.webp'),
    bgColor: '#482e5e',
    link: '/shop',
    buttonText: 'View Items',
    imageOnRight: false
  },
  {
    title: 'Health Care',
    description: 'We offer medical hospital furniture for both human and animals\' hospitals. We use best Quality SS and MS sheets and pipes for long-lasting reliability.',
    image: getImagePath('PIO.webp'),
    bgColor: '#482e5e',
    link: '/shop',
    buttonText: 'View Items',
    imageOnRight: true
  }
];

const FeatureCards = () => {
  return (
    <section className="py-8 sm:py-12 bg-gray-100 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 md:mb-16 lg:mb-30">
        Our Products
      </h2>

      {features.map((feature, index) => (
        <div 
          key={index}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 lg:mb-30 sm:mb-16 items-center bg-[#292355] text-white rounded-xl sm:rounded-2xl overflow-hidden lg:overflow-visible ${feature.imageOnRight ? '' : ''}`}
        >
          <div className={`relative w-full h-40 sm:h-64 md:h-80 lg:h-82 lg:w-92 ${feature.imageOnRight ? 'order-2' : ''}`} 
               style={{ backgroundColor: feature.bgColor, order: feature.imageOnRight ? 2 : 1 }}>
            <div className="flex justify-center items-center h-full -mt-8 sm:-mt-12 md:-mt-16 rounded-xl sm:rounded-2xl shadow-lg transform md:-translate-y-8 overflow-hidden">
              {feature.image.endsWith('.jpg') || feature.image.endsWith('.jpeg') || feature.image.endsWith('.png') ? (
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="pt-10 md:pt-0 w-4/12 sm:w-3/4 md:w-72 rounded-lg max-h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <OptimizedImage
                  src={feature.image}
                  alt={feature.title}
                  width="100%"
                  height="100%"
                  className="pt-10 md:pt-0 w-full h-full object-cover rounded-lg sm:rounded-xl hover:scale-105 transition-transform duration-300"
                  effect="blur"
                />
              )}
            </div>
          </div>
          
          <div className={`p-4 sm:p-6 md:p-8 -mt-8 sm:-mt-0 ${feature.imageOnRight ? 'lg:relative lg:right-25' : 'lg:relative lg:left-25'}`} 
               style={{ order: feature.imageOnRight ? 1 : 2 }}>
            <h3 className="text-lg sm:text-xl bg-[#482e5e] w-[60%] sm:w-48 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-bold mb-3 sm:mb-4 text-center relative lg:-top-12 left-15 lg:left-15">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              {feature.description}
            </p>
            <Link to={feature.link}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 rounded transition-colors">
                {feature.buttonText}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureCards;
