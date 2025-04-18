import React from 'react';

const BloodGroupSelect = ({ value, onChange }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div>
      <label htmlFor="bloodGroup" className="block text-gray-600 mb-1">
        Blood Group:<span style={{ color: 'red' }}>*</span>
      </label>
      <select
        id="bloodGroup"
        name="bloodGroup"
        value={value}
        onChange={onChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="" disabled>
          Select Blood Group
        </option>
        {bloodGroups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BloodGroupSelect;
