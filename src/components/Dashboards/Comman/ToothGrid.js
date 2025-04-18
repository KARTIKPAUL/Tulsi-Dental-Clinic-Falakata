import React, { useState, useEffect } from "react";
import { reasonOptions, teethData } from "../../../data";

// Tooth Component
const Tooth = ({ id, upperImg, frontImg, onSelect, isSelected }) => {
  return (
    <div
      className={`cursor-pointer p-2 border ${
        isSelected ? "border-red-700 border-4" : "border-gray-100 border-2"
      } rounded-lg hover:border-blue-700 transition duration-300`}
      onClick={() => onSelect(id)} // This will toggle the selection
      title={isSelected ? "Deselect Tooth" : "Select Tooth"} // Tooltip to indicate whether the tooth is selected or not
    >
      <div className="flex flex-col items-center">
        <img
          src={upperImg}
          alt={`Tooth ${id} upper`}
          className="w-16 h-16 object-contain mb-2"
        />
        <img
          src={frontImg}
          alt={`Tooth ${id} front`}
          className="w-16 h-16 object-contain mb-2"
        />
        <div className="bg-gray-100 p-1 rounded-full">
          <span className="text-sm font-semibold text-gray-700">{id}</span>
        </div>
      </div>
    </div>
  );
};

// ToothGrid Component
const ToothGrid = ({ selectedTeeth, setSelectedTeeth, patientAge }) => {
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedToothId, setSelectedToothId] = useState(null);
  const [reason, setReason] = useState("");
  const [showChildTeeth, setShowChildTeeth] = useState(false);

  // Set teeth type display based on patient age when component mounts or age changes
  useEffect(() => {
    // If age is undefined or null, default to adult teeth (showChildTeeth = false)
    if (patientAge === undefined || patientAge === null) {
      setShowChildTeeth(false);
      return;
    }

    // For children (age <= 12), show child teeth
    // For adults (age > 12), show adult teeth
    // const isChild = patientAge <= 12;
    // setShowChildTeeth(isChild);

    // No need to set selectedTeeth directly based on age
    // That logic is causing issues in your current implementation
  }, [patientAge]);

  // Handle the selection/deselection of a tooth and open the modal
  const handleSelectTooth = (id) => {
    const selectedTooth = selectedTeeth.find((tooth) => tooth.id === id);

    if (selectedTooth) {
      // If the tooth is already selected, pre-fill the reason field
      setSelectedToothId(id);
      setReason(selectedTooth.reason || ""); // Pre-fill the reason if it exists
    } else {
      // If the tooth is not selected, prepare for adding a reason
      setSelectedToothId(id);
      setReason(""); // Clear the reason field for new selection
    }

    setReasonModalOpen(true); // Open the modal for entering or updating the reason
  };

  // Handle the reason input change
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  // Save or update the reason for the selected tooth
  const handleSaveReason = () => {
    setSelectedTeeth((prevSelected) => {
      const updatedSelectedTeeth = [...prevSelected];
      const toothIndex = updatedSelectedTeeth.findIndex(
        (tooth) => tooth.id === selectedToothId
      );

      // If the tooth is already selected, update the reason
      if (toothIndex >= 0) {
        updatedSelectedTeeth[toothIndex] = { id: selectedToothId, reason };
      } else {
        // If not selected, add the tooth with the reason
        updatedSelectedTeeth.push({ id: selectedToothId, reason });
      }

      return updatedSelectedTeeth;
    });

    // Close the modal and reset the reason
    setReasonModalOpen(false);
    setReason("");
  };

  // Remove the selected tooth
  const handleRemoveTooth = () => {
    setSelectedTeeth((prevSelected) => {
      return prevSelected.filter((tooth) => tooth.id !== selectedToothId);
    });

    // Close the modal
    setReasonModalOpen(false);
    setReason("");
  };

  // Toggle between adult and child teeth
  const handleTeethTypeChange = (event) => {
    setShowChildTeeth(event.target.checked);
  };

  // Function to render the teeth components
  const renderTeeth = (teeth) => {
    return teeth.map((tooth) => (
      <td key={tooth.id} className="p-1">
        <Tooth
          id={tooth.id}
          upperImg={tooth.upperImg}
          frontImg={tooth.frontImg}
          onSelect={handleSelectTooth}
          isSelected={selectedTeeth.some(
            (selectedTooth) => selectedTooth.id === tooth.id
          )} // Check if the tooth is selected
        />
      </td>
    ));
  };

  return (
    <div className="w-full">
      {/* Teeth Type Selection with Age Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-4">
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-700">
              Adult Teeth
            </span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showChildTeeth}
                onChange={handleTeethTypeChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Child Teeth
            </span>
          </label>
        </div>

        {/* {patientAge !== undefined && patientAge !== null && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Patient Age: {patientAge} {patientAge === 1 ? 'year' : 'years'}
            {patientAge <= 12 ? ' (Child)' : ' (Adult)'}

          </div>
        )} */}
      </div>

      <div className="overflow-x-auto">
        {!showChildTeeth ? (
          // Adult Teeth Display
          <>
            {/* Upper Teeth */}
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-r-4 border-b-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.upperLeftTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border-l-2 border-b-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.upperRightTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Lower Teeth */}
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-r-4 border-t-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.lowerLeftTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border-t-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.lowerRightTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // Child Teeth Display
          <>
            {/* Upper Teeth */}
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-r-4 border-b-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.childUpperLeftTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border-l-2 border-b-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.childUpperRightTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Lower Teeth */}
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-r-4 border-t-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.childLowerLeftTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border-t-2 border-green-300">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>{renderTeeth(teethData.childLowerRightTeeth)}</tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Reason Modal */}
      {/* {reasonModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">
              {selectedTeeth.some((tooth) => tooth.id === selectedToothId)
                ? `Edit Reason for Tooth ${selectedToothId}`
                : `Provide a Reason for Tooth ${selectedToothId}`}
            </h3>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Enter reason here"
            />
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                onClick={() => setReasonModalOpen(false)}
              >
                Cancel
              </button>
              {selectedTeeth.some((tooth) => tooth.id === selectedToothId) ? (
                <><button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={handleRemoveTooth} 
                >
                  Remove
                </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={handleSaveReason} 
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleSaveReason} 
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )} */}

      {reasonModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">
              {selectedTeeth.some((tooth) => tooth.id === selectedToothId)
                ? `Edit Reason for Tooth ${selectedToothId}`
                : `Provide a Reason for Tooth ${selectedToothId}`}
            </h3>
            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Reason:
              </label>
              <select
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={reason}
                onChange={handleReasonChange}
              >
                <option value="" disabled>
                  Select a reason...
                </option>
                {reasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setReasonModalOpen(false)}
              >
                Cancel
              </button>
              {selectedTeeth.some((tooth) => tooth.id === selectedToothId) ? (
                <div className="space-x-2">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={handleRemoveTooth}
                  >
                    Remove
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleSaveReason}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleSaveReason}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ToothGrid;
