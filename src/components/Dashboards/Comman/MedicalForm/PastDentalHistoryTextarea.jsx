import React, { useState, useEffect } from 'react';
import ToothGrid from '../ToothGrid';

const PastDentalHistoryTextarea = ({ value, onChange, patientAge }) => {
  const [selectedTeeth, setSelectedTeeth] = useState(value || []);

  // Add this useEffect to sync changes with parent
  useEffect(() => {
    onChange(selectedTeeth);
  }, [selectedTeeth, onChange]);

  return (
    <div>
      <label htmlFor="pastDentalHistory" className="block text-gray-600 mb-1">
        Past Dental History:
      </label>
      <ToothGrid
        selectedTeeth={selectedTeeth}
        setSelectedTeeth={setSelectedTeeth}
        patientAge

       />

      {/* Selected Teeth Display */}
      {selectedTeeth.length > 0 && (
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Selected Teeth:</h2>
          <div className="flex justify-center flex-wrap">
            {selectedTeeth.map((tooth) => (
              <span key={tooth.id} className="m-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Tooth {tooth.id} - {tooth.reason || 'No reason provided'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PastDentalHistoryTextarea;