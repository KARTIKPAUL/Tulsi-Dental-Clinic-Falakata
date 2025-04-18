import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaSpinner } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

// Appointment Card Component
const AppointmentCard = ({
  item,
  handleInputChange,
  handleUpdate,
  handleDelete,
  loadingUpdates,
}) => {
  const [localNotes, setLocalNotes] = useState(item.notes || "");
  const [localStatus, setLocalStatus] = useState(item.status);
  const [localDate, setLocalDate] = useState(
    new Date(item.date).toISOString().split("T")[0]
  );
  const [localTimeBlock, setLocalTimeBlock] = useState(item.timeBlock);
  const [localReason, setLocalReason] = useState(item.reason);
  const [localName, setLocalName] = useState(item.name || "");
  const [isUpdated, setIsUpdated] = useState(false); // State to track form updates

  // Handle local input changes and propagate to parent
  const onChange = (field, value) => {
    handleInputChange(item._id, field, value);
    // Update local state for immediate UI feedback
    switch (field) {
      case "notes":
        setLocalNotes(value);
        break;
      case "status":
        setLocalStatus(value);
        break;
      case "date":
        setLocalDate(value);
        break;
      case "timeBlock":
        setLocalTimeBlock(value);
        break;
      case "reason":
        setLocalReason(value);
        break;
      case "name":
        setLocalName(value);
        break;
      default:
        break;
    }

    // Set isUpdated to true when any field is changed
    setIsUpdated(true);
  };

  return (
    <motion.div
      className=" border border-blue-700 text-black bg-opacity-50 backdrop-blur-lg  shadow-lg rounded-2xl p-6 flex flex-col space-y-4 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-black">
        <Link to={`/dashboard/patient/${item.userId}`}>{localName}</Link>
      </h2>

      {/* Form Fields Container */}
      <div className="space-y-4">
        {/* Date Field */}
        <div className="flex flex-col">
          <label
            htmlFor={`date-${item._id}`}
            className="font-semibold text-black"
          >
            Date Of Appointment :
          </label>
          <input
            type="date"
            id={`date-${item._id}`}
            value={localDate}
            onChange={(e) => onChange("date", e.target.value)}
            className="mt-1 block w-full rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 border border-gray-600 appearance-none"
          />
        </div>

        {/* Time Block Field */}
        <div className="flex flex-col">
          <label
            htmlFor={`timeBlock-${item._id}`}
            className="font-semibold text-black"
          >
            Time Block Of This Appoitement :
          </label>
          <select
            id={`timeBlock-${item._id}`}
            value={localTimeBlock}
            onChange={(e) => onChange("timeBlock", e.target.value)}
            className="mt-1 block w-full rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 border border-gray-600"
          >
            {[
              "10:00 AM - 12:00 PM",
              "12:00 PM - 2:00 PM",
              "2:00 PM - 4:00 PM",
              "4:00 PM - 6:00 PM",
              "6:00 PM - 8:00 PM",
            ].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Reason Field */}
        <div className="flex flex-col">
          <label
            htmlFor={`reason-${item._id}`}
            className="font-semibold text-black"
          >
            Reason For Appoitments :
          </label>
          <select
            id={`reason-${item._id}`}
            value={localReason}
            onChange={(e) => onChange("reason", e.target.value)}
            className="mt-1 block w-full rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 border border-gray-600"
          >
            {[
              "Routine Check-Up",
              "Cleaning",
              "Fillings",
              "Extraction",
              "Orthodontics",
              "Other",
            ].map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Status Field */}
        <div className="flex flex-col">
          <label
            htmlFor={`status-${item._id}`}
            className="font-semibold text-black"
          >
            Current Status :
          </label>
          <select
            id={`status-${item._id}`}
            value={localStatus}
            onChange={(e) => onChange("status", e.target.value)}
            className="mt-1 block w-full rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 border border-gray-600"
          >
            {["Pending", "Scheduled", "Completed", "Cancelled", "No Show"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
        </div>

        {/* Notes Field */}
        <div className="flex flex-col">
          <label
            htmlFor={`notes-${item._id}`}
            className="font-semibold text-black"
          >
            Notes Message :
          </label>
          <textarea
            id={`notes-${item._id}`}
            value={localNotes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="mt-1 block w-full rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 border border-gray-600"
            placeholder="Enter notes"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex space-x-3">
        <button
          onClick={() => handleUpdate(item._id)}
          className={`flex-1 flex items-center justify-center p-3 rounded-full border-none text-white transition-all duration-200 ${
            isUpdated
              ? loadingUpdates[item._id]
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={loadingUpdates[item._id] || !isUpdated}
        >
          {loadingUpdates[item._id] ? (
            <FaSpinner className="w-6 h-6 animate-spin" />
          ) : (
            <FaEdit className="w-6 h-6 hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={() => handleDelete(item._id)}
          className="flex-1 flex items-center justify-center p-3 rounded-full border-none bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <MdDelete className="w-6 h-6 hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => {
            if (item.mobile) {
              window.location.href = `tel:${item.mobile}`;
            } else {
              alert("Mobile number is not available.");
            }
          }}
          className={`flex-1 flex items-center justify-center p-3 rounded-full border-none bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 ${
            !item.mobile ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={!item.mobile}
        >
          <IoCall className="w-6 h-6 hover:scale-110 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
