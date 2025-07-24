import React from 'react';

const teamMembers = [
  {
    name: "Supinder Singh",
    role: "Founder of Company",
    img: "/images/team/supinder.jpg",
  },
  {
    name: "Priyanka",
    role: "Manager & Co-founder",
    img: "/images/team/priyanka.jpg",
  },
  {
    name: "Shanbir Singh",
    role: "Administrator",
    img: "/images/team/shanbir.jpg",
  },
  {
    name: "Swarnim Sharma",
    role: "Product Manager",
    img: "/images/team/swarmin.jpg",
  },
  {
    name: "Yuvraj Sharma",
    role: "Web Designer & Developer",
    img: "/images/team/yuvraj.jpg",
  },
  {
    name: "Mukul Sharma",
    role: "Product Analyzer",
    img: "/images/team/mukul.jpg",
  },
  {
    name: "Adv. Yadwinder Singh",
    role: "Advocate & CA",
    img: "/images/team/yadwinder.jpg",
  },
];

const Team = () => {
  return (
    <main className="bg-white text-gray-800">
      {/* Header */}
      <section className="text-center py-10">
        <h1 className="text-3xl font-bold text-[#2e3a5e]">Our Team</h1>
      </section>

     {/* Team Grid with Row Separator */}
<section className="max-w-6xl mx-auto px-6 mb-12">
  <div className="border border-gray-300 rounded-xl p-6 shadow-md space-y-10">
  {[0, 3, 6].map((startIndex, rowIndex) => (
  <React.Fragment key={startIndex}>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 text-center">
      {teamMembers.slice(startIndex, startIndex + 3).map((member, index) => (
        <div key={index} className="flex flex-col items-center pt-6">
          <img
            src={member.img}
            alt={member.name}
            className="w-28 h-28 object-cover rounded-xl shadow-md border-4 border-[#2e3a5e] hover:scale-105 transition duration-300"
          />
          <h3 className="mt-4 font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      ))}
    </div>

    {/* Add separator after each row except last */}
    {rowIndex !== 2 && <div className="border-t border-gray-300 my-4"></div>}
  </React.Fragment>
))}

  </div>
</section>


      {/* CTA Section */}
      <section className="max-w-md mx-auto mb-12 bg-[#2e3a5e] text-white text-center py-8 px-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Join us</h2>
        <p className="text-sm mb-4">Looking for desirable and dedicated Technical Teammates</p>
        <button className="bg-white text-[#2e3a5e] font-semibold px-6 py-2 rounded hover:bg-gray-200 transition">
          Apply now
        </button>
      </section>
    </main>
  );
};

export default Team;
