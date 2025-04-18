import React from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";

const AllergiesSection = ({ allergies, onChange, onAdd, onRemove }) => {
  const severityOptions = ["Mild", "Moderate", "Severe"];

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Allergies</h3>
      {allergies.map((allergy, idx) => (
        <div key={idx} className="p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Allergen"
              value={allergy.allergen}
              onChange={(e) =>
                onChange("allergies", idx, "allergen", e.target.value)
              }
              className="p-2 border border-gray-300 rounded-md w-full"
              aria-label={`Allergy ${idx + 1} Allergen`}
            />
            <input
              type="text"
              placeholder="Reaction"
              value={allergy.reaction}
              onChange={(e) =>
                onChange("allergies", idx, "reaction", e.target.value)
              }
              className="p-2 border border-gray-300 rounded-md w-full"
              aria-label={`Allergy ${idx + 1} Reaction`}
            />
            <select
              value={allergy.severity}
              onChange={(e) =>
                onChange("allergies", idx, "severity", e.target.value)
              }
              className="p-2 border border-gray-300 rounded-md w-full"
              aria-label={`Allergy ${idx + 1} Severity`}
            >
              <option value="" disabled>
                Select Severity
              </option>
              {severityOptions.map((severity) => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="mt-2 flex items-center transition-all duration-200 text-red-500 hover:text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95 group bg-red-50"
            aria-label={`Remove Allergy ${idx + 1}`}
            title="Remove Allergy"
          >
            <RiDeleteBin5Fill
              size={22}
              className="mr-2 transition-colors duration-200 group-hover:text-red-600"
            />
            <span className="text-sm font-medium transition-colors duration-200">
              Delete Allergy
            </span>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="px-4 py-2 mt-4 w-full bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
      >
        Add
      </button>
    </div>
  );
};

export default AllergiesSection;