import React from "react";
import { motion } from "framer-motion";
import Header from "../FrontEndComponents/Header";
import Footer from "../FrontEndComponents/Footer";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Amazing results and natural glow!",
      text: "The team at Tulsi Dental Clinic exceeded my expectations! Their attention to detail and personalized care gave me a smile that looks completely natural and radiant. I couldn’t be happier with the results.",
      author: "Nagraj Pandey",
      date: "Dec 06, 2019",
    },
    {
      quote: "Top-notch service with visible improvements!",
      text: "From the moment I walked in, I felt at ease. The staff is incredibly welcoming, and the level of expertise displayed throughout my treatment was truly impressive.",
      author: "Bhushan Kumar",
      date: "Jan 15, 2020",
    },
    {
      quote: "Fantastic experience from start to finish!",
      text: "The care and precision demonstrated by the team were exceptional. Every step of my treatment was explained thoroughly, and the results speak for themselves.",
      author: "Sanjib Das",
      date: "Feb 20, 2020",
    },
    {
      quote: "Professional and caring service!",
      text: "The dentists took the time to ensure my comfort and provided outstanding care. My teeth have never looked better!",
      author: "Ramesh Patil",
      date: "Mar 10, 2021",
    },
    {
      quote: "Best dental experience ever!",
      text: "The welcoming atmosphere and expert staff made my visit a pleasure. I’m so happy with my new smile!",
      author: "Kavita Sharma",
      date: "Apr 05, 2021",
    },
    {
      quote: "Highly recommended!",
      text: "Everything about my visit was perfect. The clinic is clean, modern, and the team is beyond professional.",
      author: "Amit Gupta",
      date: "May 20, 2021",
    },
  ];

  return (
    <>
    <Header/>
      <section
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: "url(img/gallery/gallary-5.jpg)" }}
      >
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold text-lime-500 cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Testimonials
          </motion.h2>
        </div>
      </section>
      <div className="text-center mt-10">
        <h2 className="text-lime-500 text-sm uppercase font-bold cursor-pointer">
          Testimonials
        </h2>
        <h3 className="text-4xl font-bold text-gray-800 cursor-pointer text-center mt-2">
          What Our Patients Say
        </h3>
      </div>
      <section className="latest py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <h5 className="text-xl font-semibold text-gray-800">
                  <a href="#" className="hover:text-lime-500 transition">
                    {testimonial.quote}
                  </a>
                </h5>
                <p className="text-gray-600 mt-4">{testimonial.text}</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa fa-star text-lime-500"></i>
                  ))}
                </div>
                <ul className="flex items-center space-x-4 mt-4 text-gray-500">
                  <li className="flex items-center">
                    <img
                      src="/img/patient.png"
                      alt="Author"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {testimonial.author}
                  </li>
                  <li>{testimonial.date}</li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Testimonials;
