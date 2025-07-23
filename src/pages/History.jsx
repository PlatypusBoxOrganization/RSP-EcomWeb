import React from 'react';

const History = () => {
  return (
    <main className="bg-white text-gray-800">
      {/* Header */}
      <section className="text-center py-10">
        <h1 className="text-3xl font-bold text-[#2e3a5e]">Our Story</h1>
      </section>

      {/* Intro Card */}
      <section className="max-w-6xl mx-auto px-6 relative">
        <div className="grid grid-cols-8 p-10 bg-[#1f2b45] text-white rounded-xl shadow-lg  relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute  z-0 inset-10 opacity-100">
            <img 
              src="/public/images/history-chip.jpg" 
              alt="" 
              className=" h-50 w-70 relative -bottom-70 -left-10 -rotate-45 opacity-70 "
              aria-hidden="true"
            />
          </div>
          
       

          {/* Text */}
          
            <div className="pl-15 z-1 col-span-2 pt-18 border-r  border-gray-300 font-bold text-white">A brief history <br /><h3 className='text-white font-bold text-2xl relative -left-2'>ElectroHive</h3></div>
            <div className=" z-1 col-span-6 px-10 text-sm leading-relaxed">
            Welcome to RS Portronics, we are leading distributor of electronics & robotics components, we are working towards excellence in electronics space and believe in pursuing business through innovation and technology. Our team comes with several years of industry experience and comprise of a highly motivated set of specialists & industry experts.

              <br /><br />
              Our goal is to be a leader in the industry by providing enhanced services, products, relationship and profitability.

              <br /><br />
              We firmly believe that our customers are the reason for our existence, and greatly respect the trust that they place in us. We grow through creativity and innovation. We integrate honesty, integrity and business ethics into all aspects of our business functioning. Our mission is to build long term relationships with our customers. We strive towards delighting our customers at every opportunity through exceptional customer service. Our future looks bright as we continue developing a strong base of key customers and increasing the assets and investments of the company
              <br /><br />
              We have worked with CDAC, Kerala, CSIR, Chandigarh, ISRO space Application Centre, Gujrat in manufacturing of PCBs. We deal with Govt. Tenders also.
            </div>
          </div>
        
      </section>

      {/* Next Projects / Milestones */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className=" grid grid-cols-7 bg-white border border-gray-300 rounded-xl p-6 shadow-md">
          <div className='col-span-6 px-10'>
            <p className='text-sm text-gray-700 mb-3'>We are moving towards medical projects also. As we have accomplished our Dog Electric Control Beds for safety in Clinics. Our next projects will be:</p>
          <ol className="list-decimal pl-26 space-y-2 text-sm text-gray-700">
            <li>Unweighing Harness Machine - It will be used in Physiotherapy Hospitals for Handicap Patients
            </li>
            <li>Human Electronic Control Patient Beds- That will be used in Hospitals for patients.</li>
          </ol>
          </div>
         <div className="border-l pt-6 pl-10 border-gray-300 font-bold text-gray-800">Our <br />Next Step</div>
        </div>
      </section>

      {/* Current Status */}
      <section className=" max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-7 bg-white border border-gray-300 rounded-xl p-6 shadow-md ">
          <div className=" border-r border-gray-300 font-bold text-gray-800">Where we are Today</div>
          <div className="col-span-6 px-10 text-sm text-gray-700">
            We recently accomplished our major project of Dragline Crane. Also, we deal with Amazon in 
            selling our electronic components and products.
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="bg-[#2e3a5e] text-white py-8 px-6 rounded-xl mx-100 mb-10">
        <div className="text-center mb-4 text-lg font-semibold">Our Partners</div>
        <div className="flex justify-center items-center gap-10">
          <img src="/public/images/platypusbox-history.png" alt="Platypus Box" className="h-26 rounded-2xl" />
          <img src="/public/images/amazon-history.png" alt="Amazon" className="h-26 rounded-2xl" />
        </div>
      </section>
    </main>
  );
};

export default History;
