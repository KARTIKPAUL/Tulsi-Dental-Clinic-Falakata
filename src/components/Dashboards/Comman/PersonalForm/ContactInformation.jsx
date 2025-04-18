// src/components/Profile/ContactInformation.jsx

import React from 'react';

const ContactInformation = ({ formData, onChange }) => {
  return (
    <>
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-600 mb-1" htmlFor="contact.mobile">
          Mobile:<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="tel"
          id="contact.mobile"
          name="contact.mobile"
          value={formData?.contact?.mobile || ''}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-1" htmlFor="contact.email">
          Email:
        </label>
        <input
          type="email"
          id="contact.email"
          name="contact.email"
          value={formData?.contact?.email || ''}
          onChange={onChange}
          readOnly
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
          required
        />
      </div>
      
    </section><div>
        <label className="block text-gray-600 mb-1" htmlFor="contact.address">
          Address:<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          id="contact.address"
          name="contact.address"
          value={formData?.contact?.address || ''}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      </>
  );
};

export default ContactInformation;
