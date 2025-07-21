import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaMapSigns } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2e3a5e] text-white py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Branding */}
        <div>
          <h2 className="text-lg font-bold mb-2">ElectroHive</h2>
          <p className="text-sm">Making it better for you...</p>
        </div>

        {/* Column 2: Categories */}
        <div>
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Join Us</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h2 className="text-lg font-bold mb-2">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1" />
              Head Office: #2, Street No 1, BTW, Ferozepur, Punjab, India
            </li>
            <li className="flex items-start gap-2">
              <FaMapSigns className="mt-1" />
              Branch Address: Phase 7, Sector - 62 Mohali, Punjab
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope />
              info@electrohive.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt />
              +91-9464919397
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
