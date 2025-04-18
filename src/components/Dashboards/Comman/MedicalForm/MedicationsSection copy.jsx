import React from 'react';

const MedicationsSection = ({ medications, onChange, onAdd, onRemove }) => (
  <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Medications</h3>
    {medications.map((med, idx) => (
      <div 
        key={idx} 
        className="relative  p-4 mb-4"
      >
        <button
          type="button"
          onClick={() => onRemove('medications', idx)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-500 focus:outline-none"
          aria-label={`Remove Medication ${idx + 1}`}
        >
          ✖
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={med.name}
            onChange={(e) => onChange('medications', idx, 'name', e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
            aria-label={`Medication ${idx + 1} Name`}
          />
          <input
            type="text"
            placeholder="Dosage"
            value={med.dosage}
            onChange={(e) => onChange('medications', idx, 'dosage', e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
            aria-label={`Medication ${idx + 1} Dosage`}
          />
          <input
            type="text"
            placeholder="Frequency"
            value={med.frequency}
            onChange={(e) => onChange('medications', idx, 'frequency', e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
            aria-label={`Medication ${idx + 1} Frequency`}
          />
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="px-4 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
    >
      Add 
    </button>
  </div>
);

export default MedicationsSection;
