import React, { useState, useEffect, useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Phone, Heart, ClipboardList } from "lucide-react";
import user from "../../../assets/image/user.jpg";
import logo from "../../../assets/image/kkgt-header-image.jpg";
import { Suspense } from "react";
import { startTransition } from "react";
import Spinner from "../../Spinner";
import { ToastContainer, toast } from "react-toastify";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import { AuthContext } from "../../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaBirthdayCake,
  FaVenusMars,
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaTooth,
  FaSmoking,
  FaWineGlass,
  FaJoint,
  FaPills,
  FaIdCard,
  FaClipboardList,
  FaStethoscope,
  FaProcedures,
  FaRegCheckCircle,
} from "react-icons/fa";

const OPDList = () => {
  const { getOPDData, opdData, opdLoading, opdError, setOpdData } =
    useContext(AuthContext);

  const navigate = useNavigate(); // Initialize useNavigate

  // Filter and sorting states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState("desc");

  // State to manage which tiles are expanded
  const [expandedTiles, setExpandedTiles] = useState({});

  const toggleTile = (id) => {
    setExpandedTiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleCheckup = (id) => {
    // Handle the checkup action, e.g., navigate to checkup page
    console.log(`Checkup for OPD ID: ${id}`);
    navigate(`/dashboard/checkup/${id}`); // Navigate to Checkup component with OPD ID
  };

  const handleEdit = (id) => {
    // Handle the edit action, e.g., open edit form
    startTransition(() => {
      navigate(`/dashboard/edit-opd/${id}`);
    }); // Navigate to EditOpd component with OPD ID
  };

  // Helper function to render dental history items safely
  const renderDentalHistory = (history) => {
    if (!history) return "N/A";

    if (typeof history === "string") return history;

    if (Array.isArray(history)) {
      if (history.length === 0) return "No history";

      // Format each dental history item properly
      return history
        .map((item, index) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            return `${item.reason || "No reason"} ${
              item.id ? `(ID: ${item.id})` : ""
            }`;
          }
          return `Item ${index + 1}`;
        })
        .join(", ");
    }

    // If it's a single object
    if (typeof history === "object") {
      return `${history.reason || "No reason"} ${
        history.id ? `(ID: ${history.id})` : ""
      }`;
    }

    return String(history);
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this OPD? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await API.delete(
        `${process.env.REACT_APP_API_URL}/api/doctor/delete-opd-patientrecord/${id}`
      );
      toast.success("OPD deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
      // Update the state to remove the deleted OPD
      setOpdData((prevData) => prevData.filter((opd) => opd._id !== id));
    } catch (err) {
      console.error("Error deleting OPD:", err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to delete OPD.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "colored",
        }
      );
    }
  };
  useEffect(() => {
    if (!opdData.length) {
      getOPDData();
    }
  }, [opdData, handleDelete]);

  if (opdLoading) {
    return <Loading />;
  }

  if (opdError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 text-xl">Failed to load data.</div>
      </div>
    );
  }
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Ensure 2 digits (e.g. 01, 02)
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const filteredOPDData = opdData
    .filter(
      (opd) =>
        opd.userDetails?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opd.opdNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sorting by Date
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      // Handle sorting by Date
      if (sortDate === "asc") {
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
      }
      if (sortDate === "desc") {
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
      }

      return 0;
    });

  // Animation variants for the tile expansion
  const variants = {
    collapsed: { height: 0, opacity: 0, overflow: "hidden" },
    expanded: { height: "auto", opacity: 1 },
  };

  // Animation variants for the tile container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <div className="min-h-screen md:px-6">
      <div className="mx-auto md:p-4 bg-white shadow-md rounded-lg ">
        <header className="flex justify-center items-center mb-6 bg-gradient-to-r from-[#111827] to-[#111827e7] py-4 rounded-lg shadow-lg px-4">
          <div className="flex items-center space-x-3">
            {/* Left Icon */}
            <img src={user} alt="Dental Icon" className="h-12 w-12" />
            {/* Title */}
            <h1 className="text-3xl font-bold text-lime-600 text-center">
              Opd List
            </h1>
            {/* Right Icon */}
            <img
              src={logo}
              alt="Tooth Icon"
              className="h-12 w-12 rounded-full"
            />
          </div>
        </header>
        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 mb-6 px-4">
          {/* Search Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="search" className="text-gray-700 font-medium">
              Search:
            </label>
            <div className="flex items-center bg-gray-100 border rounded-lg overflow-hidden">
              <input
                id="search"
                type="text"
                className="p-2 w-56 sm:w-80 border-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or OPD number"
              />
              <span className="p-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a4 4 0 10-8 0 4 4 0 008 0zM12 7a5 5 0 110 10 5 5 0 010-10z"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Sort by Date */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="dateSort" className="text-gray-700 font-medium">
              Sort by Date:
            </label>
            <button
              id="dateSort"
              className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSortDate(sortDate === "asc" ? "desc" : "asc")}
            >
              {sortDate === "asc" ? (
                <>
                  <span>From Starting</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>Latest First </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile View - Unified Table */}

        <div className="block md:hidden space-y-6 ">
          {filteredOPDData.map((opd, index) => (
            <motion.div
              key={opd._id}
              className={`border border-gray-200 rounded-lg shadow-sm ${
                expandedTiles[opd._id] ? "bg-slate-50" : "bg-white"
              }`}
              initial="hidden"
              animate="visible"
              custom={index}
              variants={containerVariants}
            >
              {/* Header */}
              <div
                className="flex flex-col justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleTile(opd._id)}
              >
                <div className="w-full">
                  {/* Desktop View */}
                  {/* <div className="hidden md:block">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-blue-500 text-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            OPD Number
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Chief Complaint
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Age
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Created At
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-gray-700">
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.opdNumber}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.userDetails?.name || "N/A"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.checkupInfo || "N/A"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.age || "N/A"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(opd.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}

                  {/* Mobile View */}
                  <div className="block md:hidden">
                    <table className="w-full border-collapse border border-gray-300">
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">
                            OPD Number
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.opdNumber}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">
                            Name
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.userDetails?.name || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">
                            Chief Complaint
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.checkupInfo || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">
                            Age
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {opd.age || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">
                            Created At
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(opd.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  {expandedTiles[opd._id] ? (
                    <button className="border bg-blue-600 text-white px-3 py-1 rounded-lg mt-2 hover:bg-blue-500">
                      Close Details
                    </button>
                  ) : (
                    <button className="border bg-blue-600 text-white px-3 py-1 rounded-lg mt-2 hover:bg-blue-500">
                      View More
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Content with Animation */}

              <AnimatePresence>
                {expandedTiles[opd._id] && (
                  <motion.div
                    className="px-2 pb-4"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={variants}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="mt-4 border-t pt-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <tbody>
                            {/* Patient Details */}
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Email
                              </td>
                              <td className="border px-4 py-2">
                                {opd.user?.email || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Contact
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.contact?.mobile || "N/A"}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Address
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.contact?.address || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Date of Birth
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.dateOfBirth
                                  ? new Date(
                                      opd.userDetails.dateOfBirth
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Gender
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.gender || "N/A"}
                              </td>
                            </tr>

                            {/* Emergency Contact */}
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Emergency Contact Name
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.emergencyContact?.name ||
                                  "N/A"}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Relationship
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.emergencyContact
                                  ?.relationship || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Phone
                              </td>
                              <td className="border px-4 py-2">
                                {opd.userDetails?.emergencyContact?.phone ||
                                  "N/A"}
                              </td>
                            </tr>

                            {/* Medical Details */}
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Blood Group
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.bloodGroup || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Medical History
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.medicalHistory || "N/A"}
                              </td>
                            </tr>

                            {/* Lifestyle & Habits */}
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Smoking Status
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.lifestyleAndHabits
                                  ?.smokingStatus || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Alcohol Use
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.lifestyleAndHabits
                                  ?.alcoholUse || "N/A"}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Tobacco Use
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.lifestyleAndHabits
                                  ?.tobacco || "N/A"}
                              </td>
                            </tr>

                            {/* Medications */}
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Medications
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.medications?.length > 0 ? (
                                  <ul className="list-disc list-inside ml-4">
                                    {opd.medicalDetails.medications.map(
                                      (med, idx) => (
                                        <li key={idx}>
                                          {med.name} - {med.dosage} -{" "}
                                          {med.frequency}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  "No medications listed."
                                )}
                              </td>
                            </tr>

                            {/* Allergies */}
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Allergies
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.allergies?.length > 0 ? (
                                  <ul className="list-disc list-inside ml-4">
                                    {opd.medicalDetails.allergies.map(
                                      (allergy, idx) => (
                                        <li key={idx}>
                                          {allergy.allergen} -{" "}
                                          {allergy.reaction} ({allergy.severity}
                                          )
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  "No allergies listed."
                                )}
                              </td>
                            </tr>

                            {/* Past Dental History */}
                            <tr>
                              <td className="border px-4 py-2 font-medium">
                                Past Dental History
                              </td>
                              <td className="border px-4 py-2">
                                {renderDentalHistory(
                                  opd.medicalDetails?.pastDentalHistory
                                ) || "Not provided"}
                              </td>
                            </tr>

                            {/* Notes */}
                            <tr className="bg-gray-100">
                              <td className="border px-4 py-2 font-medium">
                                Notes
                              </td>
                              <td className="border px-4 py-2">
                                {opd.medicalDetails?.notes ||
                                  "No additional notes."}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                          onClick={() => handleCheckup(opd._id)}
                        >
                          Checkup
                        </button>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 focus:outline-none"
                          onClick={() => handleEdit(opd._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none"
                          onClick={() => handleDelete(opd._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Desktop View - Unified Table */}

        <div className="space-y-6 hidden md:block">
          {filteredOPDData?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                {/* Table Head */}
                <thead>
                  <tr className="bg-blue-600 text-white text-center border border-gray-300">
                    <th className="px-4 py-3 border border-gray-300">
                      OPD Number
                    </th>
                    <th className="px-4 py-3 border border-gray-300">Name</th>
                    <th className="px-4 py-3 border border-gray-300">
                      Chief Complaint
                    </th>
                    <th className="px-4 py-3 border border-gray-300">Age</th>
                    <th className="px-4 py-3 border border-gray-300">
                      Created At
                    </th>
                    <th className="px-4 py-3 border border-gray-300">
                      More Details
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredOPDData.map((opd) => (
                    <React.Fragment key={opd._id}>
                      {/* Main Data Row */}
                      <tr className="bg-white text-gray-800 border-b hover:bg-gray-100 transition-all text-center">
                        <td className="px-4 py-3 font-semibold text-blue-600 border border-gray-300">
                          {opd.opdNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-700 border border-gray-300">
                          {opd.userDetails?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-700 border border-gray-300">
                          {opd.checkupInfo || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 border border-gray-300">
                          {opd.age || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 border border-gray-300">
                          {new Date(opd.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border border-gray-300">
                          <button
                            onClick={() => toggleTile(opd._id)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                          >
                            {expandedTiles[opd._id]
                              ? "Close Details"
                              : "View More"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {expandedTiles[opd._id] && (
                        <tr>
                          <td
                            colSpan="6"
                            className="pb-4 bg-gray-50 border border-gray-300"
                          >
                            <motion.div
                              className="py-6 px-2"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                              <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
                                <ClipboardList
                                  size={28}
                                  className="text-blue-600"
                                />
                                OPD Case Details
                              </h2>

                              {/* Grid Layout */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
                                {/* Patient Information Card */}
                                <div className="py-3 px-2 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 shadow hover:shadow-md transition-all duration-300 border-blue-300 hover:translate-y-[-3px]">
                                  <h3 className="text-lg font-bold text-blue-700 flex items-center gap-1 mb-2 border-b border-blue-200 pb-1">
                                    <FaIdCard
                                      size={18}
                                      className="text-blue-600"
                                    />
                                    Patient Details
                                  </h3>
                                  <div className="space-y-1">
                                    <p className="flex items-center gap-2 hover:bg-blue-100 p-1 rounded transition-all text-sm">
                                      <FaEnvelope
                                        size={14}
                                        className="text-blue-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Email:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.user?.email || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-2 hover:bg-blue-100 p-1 rounded transition-all text-sm">
                                      <FaPhone
                                        size={14}
                                        className="text-blue-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Contact:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.userDetails?.contact?.mobile ||
                                          "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-start gap-2 hover:bg-blue-100 p-1 rounded transition-all text-sm">
                                      <FaHome
                                        size={14}
                                        className="text-blue-500 min-w-[14px] mt-1"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Address:
                                      </span>
                                      <span className="text-gray-800 text-right">
                                        {opd.userDetails?.contact?.address ||
                                          "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-2 hover:bg-blue-100 p-1 rounded transition-all text-sm">
                                      <FaBirthdayCake
                                        size={14}
                                        className="text-blue-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        DOB:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.userDetails?.dateOfBirth
                                          ? new Date(
                                              opd.userDetails.dateOfBirth
                                            ).toLocaleDateString()
                                          : "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-2 hover:bg-blue-100 p-1 rounded transition-all text-sm">
                                      <FaVenusMars
                                        size={14}
                                        className="text-blue-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Gender:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.userDetails?.gender || "N/A"}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* Medical Information Card */}
                                <div className="py-3 px-2 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 shadow hover:shadow-md transition-all duration-300 border-green-300 hover:translate-y-[-3px]">
                                  <h3 className="text-lg font-bold text-green-700 flex items-center gap-1 mb-2 border-b border-green-200 pb-1">
                                    <FaHeartbeat
                                      size={18}
                                      className="text-green-600"
                                    />
                                    Medical Details
                                  </h3>
                                  <div className="space-y-1">
                                    <p className="flex items-center gap-2 hover:bg-green-100 p-1 rounded transition-all text-sm">
                                      <FaTint
                                        size={14}
                                        className="text-green-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Blood Group:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.medicalDetails?.bloodGroup ||
                                          "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-start gap-2 hover:bg-green-100 p-1 rounded transition-all text-sm">
                                      <FaNotesMedical
                                        size={14}
                                        className="text-green-500 min-w-[14px] mt-1"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Medical History:
                                      </span>
                                      <span className="text-gray-800 text-right">
                                        {Array.isArray(
                                          opd.medicalDetails?.medicalHistory
                                        )
                                          ? opd.medicalDetails?.medicalHistory.join(
                                              ", "
                                            )
                                          : opd.medicalDetails
                                              ?.medicalHistory || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-start gap-2 hover:bg-green-100 p-1 rounded transition-all text-sm">
                                      <FaTooth
                                        size={14}
                                        className="text-green-500 min-w-[14px] mt-1"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Past Dental History:
                                      </span>
                                      <span className="text-gray-800 text-right">
                                        {renderDentalHistory(
                                          opd.medicalDetails?.pastDentalHistory
                                        ) || "Not provided"}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* Lifestyle & Medications Card */}
                                <div className="py-3 px-2 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 shadow hover:shadow-md transition-all duration-300 border-purple-300 hover:translate-y-[-3px]">
                                  <h3 className="text-lg font-bold text-purple-700 flex items-center gap-1 mb-2 border-b border-purple-200 pb-1">
                                    <FaPills
                                      size={18}
                                      className="text-purple-600"
                                    />
                                    Lifestyle & Medications
                                  </h3>
                                  <div className="space-y-1">
                                    <p className="flex items-center gap-2 hover:bg-purple-100 p-1 rounded transition-all text-sm">
                                      <FaSmoking
                                        size={14}
                                        className="text-purple-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Smoking:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.medicalDetails?.lifestyleAndHabits
                                          ?.smokingStatus || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-2 hover:bg-purple-100 p-1 rounded transition-all text-sm">
                                      <FaWineGlass
                                        size={14}
                                        className="text-purple-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Alcohol:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.medicalDetails?.lifestyleAndHabits
                                          ?.alcoholUse || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-center gap-2 hover:bg-purple-100 p-1 rounded transition-all text-sm">
                                      <FaJoint
                                        size={14}
                                        className="text-purple-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Tobacco:
                                      </span>
                                      <span className="text-gray-800">
                                        {opd.medicalDetails?.lifestyleAndHabits
                                          ?.tobacco || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex items-start gap-2 hover:bg-purple-100 p-1 rounded transition-all text-sm">
                                      <FaPills
                                        size={14}
                                        className="text-purple-500 min-w-[14px] mt-1"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Medications:
                                      </span>
                                      <span className="text-gray-800 text-right">
                                        {opd.medicalDetails?.medications
                                          ?.length > 0
                                          ? opd.medicalDetails.medications
                                              .map((m) => m.name)
                                              .join(", ")
                                          : "None"}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* OPD Details Card */}
                                <div className="py-3 px-2 border rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 shadow hover:shadow-md transition-all duration-300 border-amber-300 hover:translate-y-[-3px]">
                                  <h3 className="text-lg font-bold text-amber-700 flex items-center gap-1 mb-2 border-b border-amber-200 pb-1">
                                    <FaClipboardList
                                      size={18}
                                      className="text-amber-600"
                                    />
                                    OPD Details
                                  </h3>
                                  <div className="space-y-1">
                                    <p className="flex items-center gap-2 hover:bg-amber-100 p-1 rounded transition-all text-sm">
                                      <FaStethoscope
                                        size={14}
                                        className="text-amber-500 min-w-[14px]"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Primary Diagnosis:
                                      </span>
                                      <span className="text-gray-800 text-left">
                                        India
                                      </span>
                                    </p>
                                    <p className="flex items-start gap-2 hover:bg-amber-100 p-1 rounded transition-all text-sm">
                                      <FaProcedures
                                        size={14}
                                        className="text-amber-500 min-w-[14px] mt-1"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Treatment Plan:
                                      </span>
                                      <span className="text-gray-800 text-right">
                                        Kuch Nehi
                                      </span>
                                    </p>
                                    <p className="flex items-start gap-2 hover:bg-amber-100 p-1 rounded transition-all text-sm">
                                      <FaRegCheckCircle
                                        size={14}
                                        className="text-amber-500 min-w-[14px] mt-1"
                                      />
                                      <span className="font-medium text-gray-700">
                                        Past Dental History:
                                      </span>
                                      <span className="text-gray-800 text-right">
                                        Pata Nehi
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-center space-x-4 mt-8">
                                <button
                                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                  onClick={() => handleCheckup(opd._id)}
                                >
                                  Start Checkup
                                </button>
                                <button
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                  onClick={() => handleEdit(opd._id)}
                                >
                                  Edit Case
                                </button>
                                <button
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                  onClick={() => handleDelete(opd._id)}
                                >
                                  Delete Case
                                </button>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              No OPD records found matching your search.
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OPDList;
