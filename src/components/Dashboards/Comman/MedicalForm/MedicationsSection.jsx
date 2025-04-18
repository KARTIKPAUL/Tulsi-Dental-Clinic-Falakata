import React from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";

const MedicationsSection = ({ medications, onChange, onAdd, onRemove }) => (
  <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Medications</h3>
    {medications.map((med, idx) => (
      <div key={idx} className="p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={med.name}
            onChange={(e) =>
              onChange("medications", idx, "name", e.target.value)
            }
            className="p-2 border border-gray-300 rounded-md w-full"
            aria-label={`Medication ${idx + 1} Name`}
          />
          <input
            type="text"
            placeholder="Dosage"
            value={med.dosage}
            onChange={(e) =>
              onChange("medications", idx, "dosage", e.target.value)
            }
            className="p-2 border border-gray-300 rounded-md w-full"
            aria-label={`Medication ${idx + 1} Dosage`}
          />
          <input
            type="text"
            placeholder="Frequency"
            value={med.frequency}
            onChange={(e) =>
              onChange("medications", idx, "frequency", e.target.value)
            }
            className="p-2 border border-gray-300 rounded-md w-full mr-2"
            aria-label={`Medication ${idx + 1} Frequency`}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="mt-2 flex items-center transition-all duration-200 text-red-500 hover:text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95 group bg-red-50"
          aria-label={`Remove Medication ${idx + 1}`}
          title="Remove medication"
        >
          <RiDeleteBin5Fill
            size={22}
            className="mr-2 transition-colors duration-200 group-hover:text-red-600"
          />
          <span className="text-sm font-medium transition-colors duration-200">
            Delete Medication
          </span>
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={onAdd}
      className="px-4 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all w-full"
    >
      Add
    </button>
  </div>
);

export default MedicationsSection;