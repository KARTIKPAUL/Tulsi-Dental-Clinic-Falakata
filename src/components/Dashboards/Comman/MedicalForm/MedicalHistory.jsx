import React from "react";
import { medicalConditions } from "../../../../data";

const MedicalHistory = ({ value, onChange }) => {
  const handleCheckboxChange = (condition) => {
    let updatedConditions;
    if (value.includes(condition)) {
      updatedConditions = value.filter((item) => item !== condition);
    } else {
      updatedConditions = [...value, condition];
    }
    onChange(updatedConditions);
  };

  return (
    <div>
      <label className="block text-gray-600 mb-1 mt-2">
        Medical History:
      </label>
      <div className="grid grid-cols-3 gap-2">
        {medicalConditions.map((condition) => (
          <label key={condition} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="medicalHistory"
              checked={value.includes(condition)}
              onChange={() => handleCheckboxChange(condition)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span>{condition}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistory;
