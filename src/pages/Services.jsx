import React from 'react';
import Header from '../FrontEndComponents/Header';
import Footer from '../FrontEndComponents/Footer';

const Services = () => {
  return (
    <>
    <Header />
    <div className="bg-gray-50 min-h-screen">
      <section
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: "url(img/gallery/gallary-5.jpg)" }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-lime-500   duration-200 cursor-pointer">Services</h2>
        </div>
      </section>
      {/* Header Section */}
      
      <div className='text-center mt-10'>
        <h2 className="text-lime-500 text-sm uppercase font-bold  hover:cursor-pointer">Our Special Services</h2>

        <h3 className="text-4xl font-bold text-gray-800 hover:cursor-pointer text-center mt-2">
        Your Perfect Smile Starts here.
        </h3>
      </div>

      {/* Services Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Map services dynamically */}
            {servicesData.map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    {/* Render the SVG icon directly */}
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 text-center mb-4">
                    {service.description}
                  </p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

// Service data array for easy maintenance
const servicesData = [
  {
    title: 'Preventive Care',
    description:
      'Routine checkups, cleanings, and exams to maintain your oral health and prevent dental issues.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <path d="M12 1v5M15 4H9m6-3a3 3 0 0 1 6 0v2a3 3 0 0 1-6 0zm-6 0a3 3 0 0 0-6 0v2a3 3 0 0 0 6 0zm1 14a6 6 0 1 1-12 0v-3a6 6 0 1 1 12 0v3z" />
      </svg>
    ),
  },
  {
    title: 'Restorative Dentistry',
    description:
      'Treatments such as fillings, crowns, bridges, and implants to restore the function and appearance of your teeth.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <path d="M12 2a5 5 0 0 1 5 5v2a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V7a5 5 0 0 1 5-5z" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: 'Cosmetic Dentistry',
    description:
      'Enhance your smile with teeth whitening, veneers, bonding, and other cosmetic procedures tailored to your needs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <path d="M12 3c3 0 6 2 6 5v6c0 2-1 4-4 4H10c-3 0-4-2-4-4V8c0-3 3-5 6-5z" />
        <path d="M10 10h4m-2-2v4" />
      </svg>
    ),
  },
  {
    title: 'Orthodontics',
    description:
      'Straighten your teeth and improve your bite with braces, Invisalign, and other orthodontic solutions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <rect x="4" y="8" width="16" height="8" rx="2" ry="2" />
        <path d="M8 12h8m-2 0a2 2 0 1 1-4 0" />
      </svg>
    ),
  },
  {
    title: 'Emergency Care',
    description:
      'Prompt and effective treatment for dental emergencies such as toothaches, broken teeth, and more.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <path d="M12 1v22M5 7h14m-7 8v2" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: 'Pediatric Dentistry',
    description:
      'Specialized dental care for children to ensure healthy smiles from an early age.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <circle cx="12" cy="5" r="3" />
        <path d="M5 22v-7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v7z" />
      </svg>
    ),
  },
  {
    title: 'Smile Makeovers',
    description:
      'Comprehensive smile design solutions to enhance your appearance and confidence.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 16c1.5 2 4.5 2 6 0m-7-6h.01m10-.01h.01" />
      </svg>
    ),
  },
  {
    title: 'Sedation Dentistry',
    description:
      'Comfortable dental care with sedation options for stress-free experiences.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <path d="M9 3L7.67 8H2l5 3.6L4.67 17 9 13.4 13.33 17 12 11.6 17 8h-5.67L15 3h-6z" />
      </svg>
    ),
  },
  {
    title: 'Oral Surgery',
    description:
      'Professional care for complex cases, including wisdom teeth extraction and more.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-800">
        <path d="M8 2h8l1.5 10h-11L8 2z" />
        <path d="M6.5 12h11L14 22h-4z" />
      </svg>
    ),
  },
];

export default Services;