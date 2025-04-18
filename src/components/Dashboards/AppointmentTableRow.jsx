import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";

const AppointmentTableRow = ({
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
  const [isUpdated, setIsUpdated] = useState(false); // Track if any field is updated

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
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-gray-100 "
    >
      {/* Name */}
      <td className="py-2 px-4 border-b">
        <p className="text-x font-semibold mb-4">{localName}</p>
      </td>

      {/* Date */}
      <td className="py-2 px-4 border-b">
        <input
          type="date"
          value={localDate}
          onChange={(e) => onChange("date", e.target.value)}
          className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>

      {/* Time Block */}
      <td className="py-2 px-4 border-b">
        <select
          value={localTimeBlock}
          onChange={(e) => onChange("timeBlock", e.target.value)}
          className="w-full border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </td>

      {/* Reason */}
      <td className="py-2 px-4 border-b">
        <select
          value={localReason}
          onChange={(e) => onChange("reason", e.target.value)}
          className="w-full border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </td>

      {/* Status */}
      <td className="py-2 px-4 border-b">
        <select
          value={localStatus}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Pending", "Scheduled", "Completed", "Cancelled", "No Show"].map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            )
          )}
        </select>
      </td>

      {/* Notes */}
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          value={localNotes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter notes"
        />
      </td>

      {/* Actions */}
      <td className="py-2 px-4 border-b">
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdate(item._id)}
            className={`px-3 py-1 rounded-md text-white ${
              isUpdated
                ? loadingUpdates[item._id]
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors duration-200`}
            disabled={loadingUpdates[item._id] || !isUpdated}
          >
            {loadingUpdates[item._id] ? "Updating..." : "Update"}
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
          <button
            onClick={() => {
              if (item.mobile) {
                window.location.href = `tel:${item.mobile}`;
              } else {
                toast.error("Mobile number is not available.", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                  theme: "dark",
                });
              }
            }}
            className={`px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ${
              !item.mobile ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!item.mobile}
          >
            <FaPhone className="inline-block mr-2" />
            Call
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default AppointmentTableRow;
