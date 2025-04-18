import React from 'react';

const NotesTextarea = ({ value, onChange }) => (
  <div>
    <label htmlFor="notes" className="block text-gray-600 mb-1">
      Notes:
    </label>
    <textarea
      id="notes"
      name="notes"
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      rows="4"
    />
  </div>
);

export default NotesTextarea;
