import React, { useState } from 'react';
import { FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <main className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#292355] mb-3">Get in Touch</h1>
        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions or need assistance? Our team is here to help. Reach out to us through the form below or contact us directly.
        </p>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 h-fit lg:sticky lg:top-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Our Location</h3>
                <p className="text-gray-600 text-sm">123 Electronics Street, Tech City, TC 12345</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaPhoneAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Phone Number</h3>
                <p className="text-gray-600 text-sm">+91 1234567890</p>
                <p className="text-gray-600 text-sm">+91 9876543210</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email Address</h3>
                <p className="text-blue-600 text-sm">info@rsportronics.com</p>
                <p className="text-blue-600 text-sm">support@rsportronics.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaClock className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Working Hours</h3>
                <p className="text-gray-600 text-sm">Monday - Friday: 9:00 - 18:00</p>
                <p className="text-gray-600 text-sm">Saturday: 10:00 - 15:00</p>
                <p className="text-gray-600 text-sm">Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href={`#${social}`} 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  aria-label={social}
                >
                  <span className="sr-only">{social}</span>
                  <i className={`fab fa-${social} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-6">We'll get back to you as soon as possible</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-[#292355] hover:bg-[#3a2f6b] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292355]"
                  >
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            
            {/* Map Section */}
            <div className="h-64 md:h-80 bg-gray-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.715212203129!2d77.10207231508255!3d28.60874398242625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b30b0a8e0a1%3A0x9b0c4a1c2e8e0b1a!2sDelhi!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Our Location"
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
