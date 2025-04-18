import React, { useState } from "react";
import Header from "../FrontEndComponents/Header";
import Footer from "../FrontEndComponents/Footer";
import { Link } from "react-router-dom";

const MainHome = () => {
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [serviceType, setServiceType] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log({ name, email, date, serviceType });
  };
  return (
    <>
      <Header />
      <section
        className="hero relative w-full overflow-hidden"
        style={{
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/6627315/pexels-photo-6627315.jpeg?auto=compress&cs=tinysrgb&w=1920)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"></div>

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full px-4 mt-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated Entry */}
            <div className="animate-fade-in-down">
              {/* Elegant Divider */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-1 bg-lime-400 rounded-full"></div>
                <span className="mx-4 text-lg font-light tracking-widest text-lime-300 uppercase">
                  Wellness Redefined
                </span>
                <div className="w-12 h-1 bg-lime-400 rounded-full"></div>
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 font-serif">
                <span className="block text-3xl font-light text-white md:text-4xl lg:text-5xl">
                  Welcome to Our
                </span>
                <span className="block mt-2 text-4xl font-extrabold text-lime-400 md:text-6xl lg:text-7xl tracking-tight">
                  Aesthetic of Perfection
                </span>
              </h1>

              {/* Refined Description */}
              <p className="max-w-2xl mx-auto mb-10 text-lg font-light leading-relaxed text-gray-100 md:text-xl">
                Discover the ultimate sanctuary where science meets artistry.
                Our exclusive treatments and personalized care pathways are
                crafted to elevate your natural beauty and restore your inner
                balance.
              </p>

              {/* Enhanced Call to Action */}
              <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                <Link
                  to="/services"
                  className="group relative overflow-hidden px-8 py-3 w-64 bg-[#2e7869] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#1d5a4f] hover:shadow-lg hover:shadow-[#2e7869]/30"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Explore Our Services
                    <svg
                      className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                </Link>

                <a
                  href="/book-an-appoitement"
                  className="group relative overflow-hidden px-8 py-3 w-64 bg-white/90 text-gray-800 font-medium rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-white/30"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Book an Appointment
                    <svg
                      className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm flex items-center">
                  <span className="mr-2">★★★★★</span>
                  <span>Trusted by 10,000+ clients</span>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Premium certified experts</span>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm flex items-center">
                  <span className="mr-2">♥</span>
                  <span>100% satisfaction guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <section className="consultation py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Appointment Form */}
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="mb-6 text-center">
                <span className="text-lime-500 text-sm uppercase font-bold">
                  Request for Your
                </span>
                <h2 className="text-2xl font-extrabold text-gray-800 mt-2">
                  Appointment
                </h2>
              </div>
              <form action="#">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grean-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grean-600"
                />
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Date"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grean-600"
                  />
                  <i className="fa fa-calendar absolute right-3 top-3 text-gray-400"></i>
                </div>

                <select className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:lime-2 focus:ring-[#2e7869]">
                  <option value="">Select Type of Service</option>
                  <option value="Advanced equipment">Advanced Equipment</option>
                  <option value="Qualified doctors">Qualified Doctors</option>
                  <option value="Certified services">Certified Services</option>
                  <option value="Emergency care">Emergency Care</option>
                </select>

                <a
                  href="/book-an-appoitement"
                  className="w-full bg-[#2e7869] text-white py-3 rounded-lg hover:bg-grean-700 transition duration-300 px-5"
                >
                  Book Appointment
                </a>
              </form>
            </div>

            {/* Informative Content */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Welcome Message */}
              <div className="flex flex-col">
                <span className="text-lime-500 text-sm uppercase font-bold text-center">
                  Welcome to 
                </span>
                <h2 className="text-3xl font-extrabold text-gray-800 mt-2 text-center">
                  Discover Exceptional{" "}
                  <span className="text-lime-500 text-center">Care</span>
                </h2>
                <p className="mt-4 text-gray-600">
                  With over 13 years of experience in cosmetic dentistry,
                  Tulsi Dental Clinic is dedicated to providing
                  personalized and transformative dental care. Our team of
                  expert dentists combines advanced techniques with a deep
                  understanding of aesthetics to craft beautiful, confident
                  smiles.
                </p>
              </div>

              {/* Video Section */}
              <div className="relative group">
                <div
                  className="rounded-lg bg-cover bg-center h-72"
                  style={{ backgroundImage: `url(https://images.pexels.com/photos/287227/pexels-photo-287227.jpeg?auto=compress&cs=tinysrgb&w=600)` }}
                >
                  {/* <a
              href="/img/op/op1.jpg"
              className="absolute inset-0 flex items-center justify-center text-lime-500 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300"
            >
              <i className="fa fa-play text-4xl"></i>
            </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Consultation Section End --> */}

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-lime-500 text-lg uppercase font-semibold">
              Why choose us?
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              Offer for you
            </h2>
          </div>

          {/* Cards Section */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card Items */}
            {chooseUsData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex flex-col items-center">
                  {/* Icon/Image */}
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-16 h-16 mb-4"
                  />
                  {/* Title */}
                  <h5 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {item.title}
                  </h5>
                  {/* Description */}
                  <p className="text-gray-600 text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <!-- Chooseus Section End --> */}

      {/* <!-- Services Section Begin --> */}

      <section
        className="services py-16 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/img/services.jpeg')`,
        }}
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-sm uppercase font-bold text-lime-400 tracking-wide mb-2">
              Our Special Services
            </h2>
            <span className="text-3xl font-extrabold text-gray-300 mt-2 text-center mb-8 sm:mb-0">
              <span className="hidden sm:inline">
                Explore our world-class dental services tailored to your needs.
              </span>
              <span className="inline sm:hidden">
                Explore our world-class dental services
              </span>
            </span>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cosmetic Dentistry */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="p-8 text-center">
                <img
                  src="/img/services/services.png"
                  alt="Cosmetic Dentistry"
                  className="w-20 mx-auto mb-6"
                />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  Cosmetic Dentistry
                </h4>
                <p className="text-gray-600">
                  Enhance your smile with treatments like teeth whitening,
                  veneers, and complete smile makeovers designed to boost your
                  natural beauty.
                </p>
              </div>
            </div>

            {/* Orthodontics */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="p-8 text-center">
                <img
                  src="/img/services/treatment.png"
                  alt="Orthodontics"
                  className="w-20 mx-auto mb-6"
                />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  Orthodontics
                </h4>
                <p className="text-gray-600">
                  Achieve a confident smile with <strong>Invisalign</strong>,{" "}
                  <strong>Clear Braces</strong>, and personalized orthodontic
                  solutions.
                </p>
              </div>
            </div>

            {/* Implants and Restorations */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="p-8 text-center">
                <img
                  src="/img/services/dental-implant.png"
                  alt="Implants and Restorations"
                  className="w-20 mx-auto mb-6"
                />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  Implants and Restorations
                </h4>
                <p className="text-gray-600">
                  Restore missing teeth with high-quality implants and
                  restorations for a seamless smile.
                </p>
              </div>
            </div>

            {/* Emergency Dental Care */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="p-8 text-center">
                <img
                  src="/img/services/checkup.png"
                  alt="Emergency Dental Care"
                  className="w-20 mx-auto mb-6"
                />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  Emergency Dental Care
                </h4>
                <p className="text-gray-600">
                  Quick and effective care during dental emergencies to
                  alleviate pain and restore oral health.
                </p>
              </div>
            </div>

            {/* Dento-Facial Orthopedics */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="p-8 text-center">
                <img
                  src="/img/services/checkup.png"
                  alt="Dento-Facial Orthopedics"
                  className="w-20 mx-auto mb-6"
                />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  Dento-Facial Orthopedics
                </h4>
                <p className="text-gray-600">
                  Focused on <strong>facial growth</strong> and{" "}
                  <strong>jaw development</strong> to improve oral health and
                  aesthetics.
                </p>
              </div>
            </div>

            {/* Pediatric Dentistry */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="p-8 text-center">
                <img
                  src="/img/services/services.png"
                  alt="Pediatric Dentistry"
                  className="w-20 mx-auto mb-6"
                />
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  Pediatric Dentistry
                </h4>
                <p className="text-gray-600">
                  Gentle and specialized care for your little ones to ensure
                  healthy teeth and a lifetime of confident smiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Services Section End --> */}

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h3 className="text-sm uppercase text-lime-500 font-bold hover:cursor-pointer text-center mt-8">
              Our Team
            </h3>
            <h2 className="text-3xl font-extrabold mt-2 hover:cursor-pointer text-center mb-8 sm:mb-0 text-gray-800">
              Meet Our Expert Doctors
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our team of highly skilled professionals is dedicated to providing
              exceptional care and expertise in their fields.
            </p>
          </div>

          {/* Team Members */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> */}
          <div className="flex justify-center items-center">
            {/* Team Member */}
            <div className="team rounded-lg transition-transform transform hover:-translate-y-2">
              <div className="flex justify-center p-6">
                <img
                  className="w-64 h-64 object-cover rounded-full shadow-md"
                  src="https://images.pexels.com/photos/6129118/pexels-photo-6129118.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Caroline Grant"
                />
              </div>
              <div className="p-6 text-center">
                <h5 className="text-xl font-semibold text-gray-800">
                  Doctor
                </h5>
                <span className="text-sm text-lime-500 block mt-2">
                  Dentist
                </span>
                <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="text-gray-600 hover:text-lime-500">
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-lime-400">
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-lime-500">
                    <i className="fa fa-instagram"></i>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-lime-500">
                    <i className="fa fa-dribbble"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Team Section End --> */}

      {/* <!-- Gallery Begin --> */}

      <section className="gallery bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-col text-center">
            <h2 className="text-lime-500 text-sm uppercase font-bold hover:cursor-pointer text-center">
              Photo Gallery
            </h2>
            <span className="text-3xl font-extrabold text-gray-800 mt-1 hover:cursor-pointer text-center mb-12">
              <span className="hidden sm:inline">
                This is our special collected album in previous year
              </span>
              <span className="inline sm:hidden">
                This is our collected album
              </span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* <a
                  href={image.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-lg font-medium bg-gray-900 px-4 py-2 rounded shadow hover:bg-gray-700"
                >
                  View Full
                </a> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <!-- Gallery End --> */}

      {/* <!-- Latest News Begin --> */}

      <section className="latest py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Title and Button Row */}
          <div className="flex flex-wrap items-center justify-center mb-12">
            <div className="text-center w-full md:w-auto">
              {/* <h2 className="text-lg text-[#5876d6] mt-2 uppercase tracking-wide font-semibold hover:cursor-pointer text-center"></h2>
                                <h3 className="text-3xl text-[#d6589d]  hover:cursor-pointer font-semibold mt-2 text-center"></h3> */}

              <h2 className="text-lime-500 text-sm uppercase font-bold  hover:cursor-pointer text-center">
                Testimonials
              </h2>
              <span className=" text-3xl font-extrabold text-gray-800 mt-1 hover:cursor-pointer text-center">
                What Our Clients Say
              </span>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h5 className="text-xl font-semibold text-gray-800">
                <a href="#" className="hover:text-[#2e7869] transition">
                  “Amazing results and natural glow!”
                </a>
              </h5>
              <p className="text-gray-600 mt-4">
              I always used to be very anxious before visiting a dentist but Dr. Subhayan Das did a great job making me feel comfortable and anxiety-free. He took the time to thoroughly explain my treatment options, ensuring I understood all aspects of the procedure before proceeding. The staff was friendly and accommodating.
              </p>
              {/* Stars */}
              <div className="flex items-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa fa-star text-lime-500"></i>
                ))}
              </div>
              {/* Author Info */}
              <ul className="flex items-center space-x-4 mt-4 text-lime-500">
                <li className="flex items-center">
                  <img
                    src="/img/patient.png"
                    alt="Author"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  Subhadip Saha
                </li>
                <li>2025</li>
              </ul>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h5 className="text-xl font-semibold text-gray-800">
                <a href="#" className="hover:text-[#2e7869] transition">
                  “Top-notch service with visible improvements!”
                </a>
              </h5>
              <p className="text-gray-600 mt-4">
              I had an excellent experience with my braces treatment under the care of Dr. Subhayan Das and Dr. Swati Roy. They were incredibly professional, patient, and attentive throughout the process. The results exceeded my expectations, and I’m thrilled with my new smile.
              </p>
              {/* Stars */}
              <div className="flex items-center mt-4">
                {[...Array(4)].map((_, i) => (
                  <i key={i} className="fa fa-star text-lime-500"></i>
                ))}
                <i className="fa fa-star text-lime-300"></i>
              </div>
              {/* Author Info */}
              <ul className="flex items-center space-x-4 mt-4 text-lime-500">
                <li className="flex items-center">
                  <img
                    src="/img/patient.png"
                    alt="Author"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  Skysafee
                </li>
                <li>2025</li>
              </ul>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h5 className="text-xl font-semibold text-gray-800">
                <a href="#" className="hover:text-[#2e7869] transition">
                  “Fantastic experience from start to finish!”
                </a>
              </h5>
              <p className="text-gray-600 mt-4">
              Dr. Subhayan Das is one of the best in town when it comes to dental knowledge, my mother did a Root Canal Treatment under him and he walked us through the whole procedure very well and his behaviour is also very good including his stuff. The thing I liked the most is the hygiene standard of the clinic. Highly recommended!
              </p>
              {/* Stars */}
              <div className="flex items-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa fa-star text-lime-500"></i>
                ))}
              </div>
              {/* Author Info */}
              <ul className="flex items-center space-x-4 mt-4 text-lime-500">
                <li className="flex items-center">
                  <img
                    src="/img/patient.png"
                    alt="Author"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  Nitesh Talukdar
                </li>
                <li>2025</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-5">
          <a
            href="/testimonials"
            className="bg-[#2e7869] text-white py-2 px-6 rounded-md hover:bg-lime-700 transition"
          >
            View all testimonials
          </a>
        </div>
      </section>

      {/* <!-- Latest News End --> */}

      <Footer />
    </>
  );
};

const images = [
  { src: "https://images.pexels.com/photos/7584483/pexels-photo-7584483.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 1" },
  { src: "https://images.pexels.com/photos/7584489/pexels-photo-7584489.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 2" },
  { src: "https://images.pexels.com/photos/12148417/pexels-photo-12148417.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 3" },
  { src: "https://images.pexels.com/photos/6627531/pexels-photo-6627531.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 2" },
  { src: "https://images.pexels.com/photos/6627537/pexels-photo-6627537.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 5" },
  { src: "https://images.pexels.com/photos/6528866/pexels-photo-6528866.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 6" },
  { src: "https://images.pexels.com/photos/6529107/pexels-photo-6529107.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 7" },
  { src: "https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Gallery Image 3" },
];

const chooseUsData = [
  {
    title: "Advanced Equipment",
    description:
      "We use the latest state-of-the-art dental technology to ensure precise diagnostics and effective treatments, making your visit comfortable and efficient.",
    icon: "/img/icons/ci-1.png",
  },
  {
    title: "Qualified Doctors",
    description:
      "Our team of experienced and skilled dental professionals are dedicated to providing the highest level of care, tailoring treatments to your specific needs.",
    icon: "img/icons/ci-2.png",
  },
  {
    title: "Certified Services",
    description:
      "We adhere to the highest standards in dental care, offering services backed by certifications and a commitment to quality and safety for all our patients.",
    icon: "img/icons/ci-3.png",
  },
  {
    title: "Emergency Care",
    description:
      "Dental emergencies can happen at any time. We're here to provide fast, reliable emergency dental care whenever you need it most.",
    icon: "img/icons/injection.png",
  },
  {
    title: "Affordable Treatment Options",
    description:
      "We offer cost-effective dental solutions without compromising on quality.",
    icon: "img/icons/pay.png",
  },
  {
    title: "Patient-Centered Approach",
    description:
      "From the moment you step into our clinic, your comfort and satisfaction are our top priority.",
    icon: "img/icons/patient.png",
  },
];

const teamData = [
  {
    name: "Caroline Grant",
    role: "Plastic Surgeon",
    image: "img/team/team-1.jpg",
    socials: [
      { icon: "fa-facebook", link: "#" },
      { icon: "fa-twitter", link: "#" },
      { icon: "fa-instagram", link: "#" },
      { icon: "fa-dribbble", link: "#" },
    ],
  },
  {
    name: "Dr. Maria Angel",
    role: "Plastic Surgeon",
    image: "img/team/team-2.jpg",
    socials: [
      { icon: "fa-facebook", link: "#" },
      { icon: "fa-twitter", link: "#" },
      { icon: "fa-instagram", link: "#" },
      { icon: "fa-dribbble", link: "#" },
    ],
  },
  {
    name: "Nathan Mullins",
    role: "Plastic Surgeon",
    image: "img/team/team-3.jpg",
    socials: [
      { icon: "fa-facebook", link: "#" },
      { icon: "fa-twitter", link: "#" },
      { icon: "fa-instagram", link: "#" },
      { icon: "fa-dribbble", link: "#" },
    ],
  },
];

export default MainHome;
