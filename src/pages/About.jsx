import React from 'react';
import Header from '../FrontEndComponents/Header';
import Footer from '../FrontEndComponents/Footer';

const AboutPage = () => {
  return (

    <>
    <Header />
    <div>
      {/* Header Section */}
      <section
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: "url(img/landingImg.jpg)" }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-lime-500  cursor-pointer duration-200">About</h2>
        </div>
      </section>

      {/* About Section */}
      {/* <div className='flex items-center justify-center flex-col'>
        <h3 className="text-4xl font-bold text-gray-800 hover:text-lime-500 hover:cursor-pointer text-center mt-10">
          Welcome to <span className="text-lime-500 hover:text-gray-800 hover:cursor-pointer">Our Aesthetic Clinic</span>
        </h3>

        <section className="h-screen flex items-center justify-center ">
  <div className="container mx-auto flex flex-col sm:flex-row items-center space-x-12 justify-center">
    
    <div className="relative w-full sm:w-1/3 mt-6 rounded-lg group">
      <img
        src="img/about-video.jpg"
        alt="About Us Video"
        className="w-full object-cover rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
      />
      <a
        href="https://www.youtube.com/watch?v=PXsuI67s2AA"
        target="_self"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="text-white text-2xl p-5 bg-[#5876d6] rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
          <i className="fa fa-play"></i>
        </div>
      </a>
    </div>

    
    <div className="max-w-2xl mx-auto text-left space-y-6 px-4 sm:px-6 lg:px-8 mt-5">
      <h2 className="text-3xl font-bold text-lime-500 text-center sm:text-left">
        Premium Aesthetic Treatments
      </h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        We specialize in providing premium aesthetic treatments, ensuring you
        look and feel your best. Our clinic uses the latest technology, and our
        certified professionals are dedicated to enhancing your wellness.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        Discover comprehensive beauty and wellness treatments tailored to your
        needs with an expert team of certified professionals and personalized
        care.
      </p>
      <div className="flex justify-center sm:justify-start items-center mt-5">
        <a
          href="/contact"
          className="bg-gradient-to-r from-[#d6589d] to-[#5876d6] text-white font-semibold px-10 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
        >
          Book an Appointment
        </a>
      </div>
    </div>
  </div>
</section>



           
      </div> */}



      <div className="flex items-center justify-center flex-col mt-10">
        <h2 className="text-lime-500 text-sm uppercase font-bold  hover:cursor-pointer">Let's Know about Ivory Smiles</h2>

        <h3 className="text-4xl font-bold text-gray-800 hover:cursor-pointer text-center mt-2">
          Committed To Dental Excellence
        </h3>

        <section className="mt-16 flex items-center justify-center">
          <div className="container mx-auto flex flex-col sm:flex-row items-center space-y-8 sm:space-y-0 sm:space-x-12 justify-center">

            {/* image Section */}
            <div className="relative w-full sm:w-1/2 lg:w-2/5 mt-6 rounded-lg group">
              <div className="overflow-hidden rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105">
                <img
                  src="https://images.pexels.com/photos/5355865/pexels-photo-5355865.jpeg?auto=compress&cs=tinysrgb&w=600"
                  //src='https://lh3.googleusercontent.com/p/AF1QipNvTfATJcRxDnrGHemuh18dPvEz9USn22BjL7jO=s680-w680-h510'
                  className="h-full w-auto object-cover"
                />
              </div>

            </div>

            {/* Content Section */}
            <div className="max-w-2xl mx-auto text-left space-y-6 px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-lime-500 sm:text-left">
                Premium Aesthetic Treatments
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We specialize in providing premium aesthetic treatments, ensuring you
                look and feel your best. Our clinic uses the latest technology, and our
                certified professionals are dedicated to enhancing your wellness.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Discover comprehensive beauty and wellness treatments tailored to your
                needs with an expert team of certified professionals and personalized
                care.
              </p>
              <div className="flex justify-center sm:justify-start items-center mt-5">
                <a
                  href="/book-an-appoitement"
                  className="bg-lime-500 text-white font-semibold px-10 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
                >
                  Book an Appointment
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>


      {/* Why Choose Us Section */}
      <section className="mt-40  bg-gradient-to-tr">
        <div className="container mx-auto text-center mb-12">


          <h2 className="text-lime-500 text-sm uppercase font-bold  hover:cursor-pointer text-center"> Why Choose Us?</h2>
          <span className=" text-3xl font-extrabold text-gray-800 mt-1 hover:cursor-pointer text-center">Our clinic stands out for its commitment</span>
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          {/* Card Items */}
          {[
            {
              image: "img/icons/ci-1.png",
              title: "State-of-the-art Technology",
              description:
                "We utilize the latest, most advanced equipment in the aesthetic industry to ensure optimal results for every client.",
            },
            {
              image: "img/icons/ci-2.png",
              title: "Experienced Doctors",
              description:
                "Our team consists of board-certified professionals with years of experience in the aesthetic field.",
            },
            {
              image: "img/icons/ci-3.png",
              title: "Certified and Accredited",
              description:
                "All our treatments are carried out under strict medical protocols, ensuring safety and effective results.",
            },
            {
              image: "img/icons/ci-4.png",
              title: "Emergency Support",
              description:
                "We provide emergency care and quick solutions to address any unexpected outcomes.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 text-center bg-white rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="mx-auto mb-4 w-16 h-16"
              />
              <h5 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h5>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Team Section */}
      <section className="mt-40  bg-gray-50">
        <div className="container mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">


            <h2 className="text-lime-500 text-sm uppercase font-bold  hover:cursor-pointer">Our Team</h2>
            <span className=" text-3xl font-extrabold text-gray-800 mt-1 hover:cursor-pointer">Meet Our Expert Doctors</span>


            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-xl">
              Our team of highly skilled professionals is dedicated to providing exceptional care and expertise in their fields.
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
                  alt="mahalaxmiDental"
                />
              </div>
              <div className="p-6 text-center">
                <h5 className="text-xl font-semibold text-gray-800 hover:text-lime-500 hover:cursor-pointer">Doctor</h5>
                <span className="text-sm text-lime-500 hover:text-gray-800 hover:cursor-pointer block mt-2">Dentist</span>
                <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="text-gray-800 hover:text-lime-500">
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a href="#" className="text-gray-800 hover:text-lime-500">
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-800 hover:text-lime-500">
                    <i className="fa fa-instagram"></i>
                  </a>
                  <a href="#" className="text-gray-800 hover:text-lime-500">
                    <i className="fa fa-dribbble"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member */}
            {/* <div className="team rounded-lg bg-white shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                <div className="flex justify-center p-6">
                    <img 
                        className="w-64 h-64 object-cover rounded-full shadow-md" 
                        src="img/team/team-2.jpg" 
                        alt="Dr. Maria Angel"
                    />
                </div>
                <div className="p-6 text-center">
                    <h5 className="text-xl font-semibold text-gray-800">Dr. Maria Angel</h5>
                    <span className="text-sm text-lime-500 block mt-2">Plastic Surgeon</span>
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
            </div> */}

            {/* Team Member */}
            {/* <div className="team rounded-lg bg-white shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                <div className="flex justify-center p-6">
                    <img 
                        className="w-64 h-64 object-cover rounded-full shadow-md" 
                        src="img/team/team-3.jpg" 
                        alt="Nathan Mullins"
                    />
                </div>
                <div className="p-6 text-center">
                    <h5 className="text-xl font-semibold text-gray-800">Nathan Mullins</h5>
                    <span className="text-sm text-lime-500 block mt-2">Plastic Surgeon</span>
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
            </div> */}
          </div>
        </div>
      </section>
    </div>

    <Footer />
    </>
  );
};

export default AboutPage;