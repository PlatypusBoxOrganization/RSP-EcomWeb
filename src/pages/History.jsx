import React from 'react';

const History = () => {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Header */}
      <section className="text-center py-8 md:py-12 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#292355] mb-2">Our Story</h1>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </section>

      {/* Intro Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-10 md:mb-16">
        <div className="bg-[#292355] text-white rounded-xl shadow-lg overflow-hidden relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#292355] to-black/70"></div>
          </div>
          
          <div className="relative z-10 p-6 md:p-10 ">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-400/30 pb-6 md:pb-0 md:pr-6">
                <h2 className="text-xl md:text-xl  font-bold text-white mb-2 z-10">A brief history</h2>
                <h3 className="text-2xl md:text-2xl  font-bold text-blue-300 z-10">RS PORTRONICS</h3>
        <img 
          src="/Images/history-chip.webp" 
          alt="" 
          className="w-250 h-38 rotate-135 relative lg:-left-15 opacity-70 lg:top-48 z-12 overflow-hidden hidden md:block"
          aria-hidden="true"
          />
              </div>
              
              <div className="md:w-2/3 lg:w-3/4 text-sm md:text-base leading-relaxed text-gray-100">
                <p className="mb-4">
                  Welcome to RS Portronics, we are leading distributor of electronics & robotics components, 
                  working towards excellence in electronics space and believe in pursuing business through 
                  innovation and technology. Our team comes with several years of industry experience and 
                  comprises a highly motivated set of specialists & industry experts.
                </p>
                
                <p className="mb-4">
                  Our goal is to be a leader in the industry by providing enhanced services, products, 
                  relationships, and profitability.
                </p>
                
                <p className="mb-4">
                  We firmly believe that our customers are the reason for our existence, and we greatly 
                  respect the trust that they place in us. We grow through creativity and innovation. 
                  We integrate honesty, integrity, and business ethics into all aspects of our business 
                  functioning. Our mission is to build long-term relationships with our customers.
                </p>
                
                <p>
                  We have worked with CDAC Kerala, CSIR Chandigarh, ISRO Space Application Centre, Gujarat 
                  in manufacturing of PCBs. We also deal with Government Tenders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Projects / Milestones */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-16">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:p-8 md:w-3/4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                We are moving towards medical projects. We have already accomplished our Dog Electric Control Beds for safety in clinics.
              </h3>
              
              <h4 className="text-md font-medium text-gray-700 mb-3">Our upcoming projects include:</h4>
              <ol className="space-y-3 pl-5 list-decimal text-gray-700">
                <li className="pl-2">
                  <span className="font-medium">Unweighing Harness Machine</span> - Designed for use in Physiotherapy Hospitals for patients with mobility challenges.
                </li>
                <li className="pl-2">
                  <span className="font-medium">Human Electronic Control Patient Beds</span> - Advanced hospital beds with electronic controls for enhanced patient care.
                </li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-6 md:p-8 md:w-1/4 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#292355] mb-2">Next</div>
                <div className="text-2xl md:text-3xl font-bold text-[#482e5e]">Step</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-16">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-50 text-[#292355] p-6 md:p-8 md:w-1/5 border-r border-gray-200 flex items-center">
              <h3 className="text-xl font-bold">Where We Are Today</h3>
            </div>
            <div className="p-6 md:p-8 md:w-3/4">
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  We recently accomplished our major project of Dragline Crane, marking a significant 
                  milestone in our journey. This achievement showcases our technical expertise and 
                  commitment to delivering complex engineering solutions.
                </p>
                <p>
                  In addition to our project work, we have established a successful partnership with Amazon, 
                  through which we distribute our high-quality electronic components and innovative products 
                  to a global customer base.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="bg-[#292355] py-12 px-4 sm:px-6 rounded-xl mx-4 md:mx-10 lg:mx-auto mb-12 md:mb-20 max-w-6xl lg:w-1/2">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Valued Partners</h2>
          <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-48 h-24 flex items-center justify-center">
            <img 
              src="/Images/platypusbox-history.webp" 
              alt="Platypus Box" 
              className="h-full w-auto object-contain rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-48 h-24 flex items-center justify-center">
            <img 
              src="/Images/amazon-history.webp" 
              alt="Amazon" 
              className="h-full w-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default History;
