// export default Header;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaDribbble,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Overlay for the Offcanvas Menu */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Offcanvas Menu */}
      <div
        className={`fixed top-0 right-0 w-64 bg-white shadow-xl h-full z-50 transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } w-full`}
      >
        <div className="p-6 flex-col justify-center items-center">
          <div className="flex justify-between items-center">
            <NavLink to="/">
              <img
                src="/img/Dr.Subhayan-Das-Dentique-Multispeciality-Dental_Care-in-coochbehar-best-dental-clinic-in-coochbehar.png"
                alt="Logo"
                className="h-20"
              />
            </NavLink>
            <button onClick={toggleMenu} className="text-2xl text-gray-800">
            <FaTimes />
            </button>
          </div>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="/"
                  exact
                  activeClassName="text-white bg-pink-600"
                  className="block py-2 px-4 text-gray-800 hover:bg-[#2e7869] rounded-md transition"
                  onClick={toggleMenu}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  activeClassName="text-white bg-pink-600"
                  className="block py-2 px-4 text-gray-800 hover:bg-[#2e7869] rounded-md transition"
                  onClick={toggleMenu}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  activeClassName="text-white bg-pink-600"
                  className="block py-2 px-4 text-gray-800 hover:bg-[#2e7869] rounded-md transition"
                  onClick={toggleMenu}
                >
                  Services
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/testimonials"
                  activeClassName="text-white bg-pink-600"
                  className="block py-2 px-4 text-gray-800 hover:bg-[#2e7869] rounded-md transition"
                  onClick={toggleMenu}
                >
                  Testimonials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  activeClassName="text-white bg-pink-600"
                  className="block py-2 px-4 text-gray-800 hover:bg-[#2e7869] rounded-md transition"
                  onClick={toggleMenu}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="mt-8">
            <a
              href="#"
              className="block py-2 px-4 bg-lime-400 text-gray-800 text-center rounded-md hover:bg-lime-700 transition"
            >
              Make an Appointment
            </a>
            <NavLink
              to="/dashboard"
              className="block py-2 px-4 mt-4 bg-[#2e7869] text-white text-center rounded-md hover:bg-lime-700 transition"
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <header className="bg-white text-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-2 hidden justify-between items-center lg:flex border-b-2">
          <div className="flex items-center space-x-8">
            <div className="text-sm flex items-center space-x-2 text-gray-600">
              <FaPhone />
              <span>+1 947-510-7147</span>
            </div>
            <div className="text-sm flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt />
              <span>Falakata, West Bengal-735211</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <a
              href="https://www.facebook.com/tulsidentalclinic/"
              className="text-gray-600 hover:text-[#2e7869] duration-200 transition"
            >
              <FaFacebook />
            </a>
            {/* <a
              href="https://instagram.com"
              className="text-gray-600 hover:text-[#2e7869] duration-200 transition"
            >
              <i className="fa fa-twitter"></i>
            </a> */}
            <a
              href="https://instagram.com"
              className="text-gray-600 hover:text-[#2e7869] duration-200 transition"
            >
             <FaInstagram />
            </a>
            {/* <a
              href="#"
              className="text-gray-600 hover:text-[#2e7869] duration-200 transition"
            >
              <i className="fa fa-dribbble"></i>
            </a> */}
          </div>
        </div>

        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <NavLink to="/">
              <img src="/img/Dr.Subhayan-Das-Dentique-Multispeciality-Dental_Care-in-coochbehar-best-dental-clinic-in-coochbehar.png" alt="Logo" className="h-20" />
            </NavLink>
          </div>
          <nav className="hidden lg:flex space-x-12">
            <NavLink
              to="/"
              exact
              activeClassName="text-[#2e7869]"
              className="text-lg font-semibold text-gray-800 hover:text-[#2e7869] duration-200 transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              activeClassName="text-[#2e7869]"
              className="text-lg font-semibold text-gray-800 hover:text-[#2e7869] duration-200 transition"
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              activeClassName="text-[#2e7869]"
              className="text-lg font-semibold text-gray-800 hover:text-[#2e7869] duration-200 transition"
            >
              Services
            </NavLink>

            <NavLink
              to="/testimonials"
              activeClassName="text-[#2e7869]"
              className="text-lg font-semibold text-gray-800 hover:text-[#2e7869] duration-200 transition"
            >
              Testimonials
            </NavLink>
            <NavLink
              to="/contact"
              activeClassName="text-[#2e7869]"
              className="text-lg font-semibold text-gray-800 hover:text-[#2e7869] duration-200 transition"
            >
              Contact
            </NavLink>
          </nav>

          {/* Desktop Login Button */}
          <NavLink
            to="/dashboard"
            activeClassName="text-pink-600"
            className="hidden lg:inline-block px-5 py-2 mb-2 bg-[#2e7869] font-bold text-white text-xl rounded-full hover:bg-[#2e7869] duration-200 focus:ring-lime-300"
          >
            Login
          </NavLink>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-gray-800 text-xl">
            <FaBars />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
