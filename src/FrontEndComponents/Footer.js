import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* Footer Section Begin */}
      <footer className="bg-gray-900 text-gray-300">
        {/* Top Section */}
        <div className="bg-gray-800 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="#" className="block">
                  <img
                    src="img/Dr.Subhayan-Das-Dentique-Multispeciality-Dental_Care-in-coochbehar-best-dental-clinic-in-coochbehar.png"
                    alt="Logo"
                    className="h-20 w-auto md:h-16 sm:h-12 sm:w-auto object-contain"
                  />
                </a>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4 text-2xl sm:justify-center sm:items-center">
                <a
                  href="#"
                  className="hover:text-lime-500 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                {/* <a
                  href="#"
                  className="hover:text-lime-500 transition"
                  aria-label="Twitter"
                >
                  <i className="fa fa-twitter"></i>
                </a> */}
                <a
                  href="#"
                  className="hover:text-lime-500 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                {/* <a
                  href="#"
                  className="hover:text-lime-500 transition"
                  aria-label="Dribbble"
                >
                  <i className="fa fa-dribbble"></i>
                </a> */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Section */}
            <div>
              <h5 className="text-lg font-bold mb-4 text-lime-500">Company</h5>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="hover:text-lime-500 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="hover:text-lime-500 transition"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/testimonials"
                    className="hover:text-lime-500 transition"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-lime-500 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links Section */}
            {/* <div>
              <h5 className="text-lg font-bold mb-4 text-lime-500">
                Quick Links
              </h5>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-lime-500 transition">
                    General Dentistry
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-lime-500 transition">
                    Teeth Whitening
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-lime-500 transition">
                    Dental Implants
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-lime-500 transition">
                    Tooth Extraction
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-lime-500 transition">
                    Emergency Dental Care
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Contact Section */}
            <div>
              <h5 className="text-lg font-bold mb-4 text-lime-500">
                Contact Us
              </h5>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-lime-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-100">
                  Jaygoan, Bus Stand, Madari Rd, Falakata, West Bengal-735211
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaPhone className="text-lime-500 flex-shrink-0" />
                  <a
                    href="tel:+1 947-510-7147"
                    className="text-gray-q00 hover:text-lime-500 transition-colors"
                  >
                    +1 947-510-7147
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <FaEnvelope className="text-lime-500 flex-shrink-0" />
                  <a
                    href="mailto:support@tulsidentalclinic.com"
                    className="text-gray-100 hover:text-lime-500 transition-colors"
                  >
                    support@tulsidentalclinic.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Map Section */}

            

            <div>
              <h5 className="text-lg font-bold mb-4 text-lime-500">Find Us</h5>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.987860145749!2d89.2021188!3d26.520514900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e3a42e50a7335b%3A0x95cb861112f47320!2sTulsi%20Dental%20Clinic!5e0!3m2!1sen!2sin!4v1744995725869!5m2!1sen!2sin"
                className="w-full h-40 rounded-md shadow-lg"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-wrap items-center justify-between text-sm text-gray-400">
            <p className="text-white">
              © 2025 Tulsi Dental Clinic, Falakata
            </p>
            {/* <p>
              Design & Developmed by &nbsp;
              <span>
                <a
                  href="https://kodekalp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-500 hover:text-lime-600  transition"
                >
                  KodeKalp Global Technologies.
                </a>
              </span>
            </p> */}
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-lime-600 transition">
                  Terms & Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text-lime-600 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
