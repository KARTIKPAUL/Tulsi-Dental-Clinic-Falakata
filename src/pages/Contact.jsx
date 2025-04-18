import React from "react";
import Header from "../FrontEndComponents/Header";
import Footer from "../FrontEndComponents/Footer";

const Contact = () => {
  return (

    <>

    <Header />
    <div>
      {/* Breadcrumb Section */}
      <section
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: "url(img/landingImg.jpg)" }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-lime-500  duration-200 cursor-pointer">
            Contact
          </h2>
          {/* <div className="mt-4">
            <a href="./index.html" className="text-gray-600 ">
              Home
            </a>{" "}
            <span className="text-gray-400 mx-2">/</span>{" "}
            <span className="text-gray-800">Contact</span>
          </div> */}
        </div>
      </section>

      <div className="text-center mt-10">
        <h2 className="text-lime-500 text-sm uppercase font-bold  hover:cursor-pointer">
          Contact us
        </h2>

        <h3 className="text-4xl font-bold text-gray-800 hover:cursor-pointer text-center mt-2">
          Join the Journey To Your Perfect Smile!
        </h3>
      </div>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Contact Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow">
              <div className="text-gray-800 text-5xl mb-4">
                <i className="fa fa-map-marker"></i>
              </div>
              <h5 className="text-lg font-bold text-lime-500  hover:cursor-pointer">
                Address
              </h5>
              <p className="text-gray-600 mt-2">
              Jaygoan, Bus Stand, Madari Rd, Falakata, West Bengal-735211
              </p>
            </div>
            <div className="text-center bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow">
              <div className="text-gray-800 text-5xl mb-4">
                <i className="fa fa-phone"></i>
              </div>
              <h5 className="text-lg font-bold text-lime-500  hover:cursor-pointer">
                Call Us
              </h5>
              <p className="text-gray-600 mt-2">
              +1 947-510-7147</p>
            </div>
            <div className="text-center bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow">
              <div className="text-gray-800 text-5xl mb-4">
                <i className="fa fa-envelope"></i>
              </div>
              <h5 className="text-lg font-bold text-lime-500  hover:cursor-pointer">
                Email
              </h5>
              <p className="text-gray-600 mt-2">support@tulsidentalclinic.com</p>
            </div>
          </div>

          {/* Contact Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="flex justify-center items-center h-full">
              <div className="relative group w-full h-full">
                <img
                  src="https://images.pexels.com/photos/6129115/pexels-photo-6129115.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Contact"
                  className="w-full min-h-full object-cover rounded-xl shadow-lg  transition-transform"
                />
                <div className="absolute inset-0 bg-text-gray-800 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white shadow-lg p-10 rounded-xl flex flex-col justify-center h-full">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Get in Touch
              </h3>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <input
                    id="website"
                    type="text"
                    placeholder="Your Website"
                    className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Write your message..."
                    className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    rows="5"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full hover:bg-lime-400 bg-lime-500 py-3 rounded-lg font-medium bg-text-lime-500 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer />


</>
  );
};

export default Contact;
