import React from 'react';

const SubmitButton = ({ isDisabled }) => (
  <button
    type="submit"
    disabled={isDisabled}
    className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 ${
      isDisabled
        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    Save Changes
  </button>
);

export default SubmitButton;
