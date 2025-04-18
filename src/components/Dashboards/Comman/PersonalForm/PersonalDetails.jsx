// src/components/Profile/PersonalDetails.jsx

import React from 'react';

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const PersonalDetails = ({ formData, onChange }) => {

  // Function to format the date to dd-mm-yyyy for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as dd-mm-yyyy
  };

  // Function to format the date to yyyy-mm-dd for the input value
  const formatInputDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
  };
  return (<>
    <div>
      <label className="block text-gray-600 mb-1" htmlFor="name">
        Name:<span style={{ color: 'red' }}>*</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData?.name || ''}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      <div>
        <label className="block text-gray-600 mb-1" htmlFor="dateOfBirth">
          Date of Birth:<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formatInputDate(formData?.dateOfBirth) || ''}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-1" htmlFor="gender">
          Gender:<span style={{ color: 'red' }}>*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={formData?.gender || ''}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section></>
  );
};

export default PersonalDetails;
