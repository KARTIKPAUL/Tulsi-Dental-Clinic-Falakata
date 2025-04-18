import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaTooth } from "react-icons/fa";
import {
  User,
  Phone,
  Heart,
  ClipboardList,
  Calendar,
  MapPin,
  Droplet,
  FileText,
  
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import { AuthContext } from "../../../context/AuthContext";
import user from "../../../assets/image/user.jpg";
import logo from "../../../assets/image/kkgt-header-image.jpg";
import { dentalReasons, reasonOptions, timeBlocks } from "../../../data";

const UsersList = () => {
  const {
    getAllPateintData,
    allPatients,
    allPatientsLoading,
    allPatientsError,
    setAllPatients,
    setAllPatientsError,
    getUpcomingAppointments,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [checkupInfo, setCheckupInfo] = useState("");
  const [age, setAge] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Appointment States
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeBlock, setTimeBlock] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 14);

  // State to manage which tiles are expanded
  const [expandedTiles, setExpandedTiles] = useState({});

  // State for search term with debouncing
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageOptions = [5, 10, 15, 20];
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / itemsPerPage);
  }, [filteredUsers.length, itemsPerPage]);

  // Memoized paginated users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Helper function to render pastDentalHistory items safely
  const renderDentalHistory = (history) => {
    if (!history) return "N/A";

    if (typeof history === "string") return history;

    if (Array.isArray(history)) {
      if (history.length === 0) return "No history";

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

    if (typeof history === "object") {
      return `${history.reason || "No reason"} ${
        history.id ? `(ID: ${history.id})` : ""
      }`;
    }

    return String(history);
  };

  // Helper function to safely render OPD records
  const renderOpdRecord = (opd) => {
    // Handle if opd is just a string ID
    if (typeof opd === "string") {
      return `OPD Record ${opd}`;
    }

    // Handle if opd is a full object
    if (opd && typeof opd === "object") {
      // If it has opdNumber and checkupInfo, use those
      if (opd.opdNumber && opd.checkupInfo) {
        return `${opd.opdNumber} (${opd.checkupInfo}${
          opd.createdAt
            ? ` - ${new Date(opd.createdAt).toLocaleDateString()}`
            : ""
        })`;
      }

      // If it's from pastDentalHistory structure with id and reason
      if (opd.id !== undefined && opd.reason) {
        return `ID: ${opd.id} - ${opd.reason}`;
      }

      // Fallback if we only have an ID
      if (opd._id) {
        return `OPD Record ${opd._id}`;
      }
    }

    // Final fallback
    return "OPD Record";
  };

  // Helper function to calculate age from date of birth
  const calculateAge = useCallback((dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const todayDate = new Date();
    let ageCalc = todayDate.getFullYear() - dob.getFullYear();
    const monthDifference = todayDate.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && todayDate.getDate() < dob.getDate())
    ) {
      ageCalc--;
    }

    return ageCalc;
  }, []);

  // Handle search input change with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter users based on search term
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setFilteredUsers(allPatients);
    } else {
      const lowerCaseTerm = debouncedSearchTerm.toLowerCase();
      const filtered = allPatients.filter((user) => {
        const email = user.email.toLowerCase();
        const name = user.userDetails?.name?.toLowerCase() || "";
        const role = user.role.toLowerCase();
        return (
          email.includes(lowerCaseTerm) ||
          name.includes(lowerCaseTerm) ||
          role.includes(lowerCaseTerm)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [debouncedSearchTerm, allPatients]);

  // Fetch all users on component mount
  useEffect(() => {
    if (!allPatients.length) {
      getAllPateintData();
    } else {
      setFilteredUsers(allPatients);
    }
  }, [allPatients, getAllPateintData]);

  // Toggle the expansion of a user tile
  const toggleTile = (id) => {
    setExpandedTiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open Modal for Chief Complaint
  const openModal = (user) => {
    setSelectedUser(user);
    if (user.userDetails?.dateOfBirth) {
      const userAge = calculateAge(user.userDetails.dateOfBirth);
      setAge(userAge);
    } else {
      setAge("N/A"); // Handle cases where DOB is missing
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCheckupInfo("");
    setAge(0); // Reset age if necessary
  };

  // Open Modal for Appointment
  const openAppointmentModal = (user) => {
    setSelectedUser(user);
    if (user.userDetails?.dateOfBirth) {
      const userAge = calculateAge(user.userDetails.dateOfBirth);
      setAge(userAge);
    } else {
      setAge("N/A"); // Handle cases where DOB is missing
    }
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    // Reset appointment form fields
    setAppointmentDate("");
    setTimeBlock("");
    setReason("");
    setOtherReason("");
  };

  // Handle Appointment Submission
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!appointmentDate || !timeBlock || !reason) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (reason === "Other" && !otherReason.trim()) {
      toast.error("Please specify the reason for the visit.");
      return;
    }

    // try {
    //   await API.post(`${process.env.REACT_APP_API_URL}/api/users/appointment`, {
    //     userId: selectedUser._id,
    //     date: appointmentDate,
    //     timeBlock,
    //     reason: reason === "Other" ? otherReason : reason,
    //   });
    //   getUpcomingAppointments();

    //   toast.success("Appointment created successfully!", {
    //     position: "top-center",
    //     autoClose: 3000,
    //     hideProgressBar: true,
    //     theme: "colored",
    //   });

    //   closeAppointmentModal();
    // } catch (error) {
    //   console.error(error);
    //   toast.error(
    //     error.response?.data?.message || "Failed to create appointment.",
    //     {
    //       position: "top-center",
    //       autoClose: 3000,
    //       hideProgressBar: true,
    //       theme: "colored",
    //     }
    //   );
    // }

    const toastId = toast.loading("Appointment Creating...", {
      position: "top-center",
      theme: "colored",
    });

    try {
      await API.post(`${process.env.REACT_APP_API_URL}/api/users/appointment`, {
        userId: selectedUser._id,
        date: appointmentDate,
        timeBlock,
        reason: reason === "Other" ? otherReason : reason,
      });

      getUpcomingAppointments();

      toast.update(toastId, {
        render: "Appointment created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: true,
      });

      closeAppointmentModal();
    } catch (error) {
      console.error(error);

      toast.update(toastId, {
        render:
          error.response?.data?.message || "Failed to create appointment.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  // Handle Chief Complaint Submission
  // const handleSubmit = async () => {
  //   if (!checkupInfo) {
  //     toast.error("Chief complaint is required.");
  //     return;
  //   }

  //   try {
  //     const response = await API.post(
  //       `${process.env.REACT_APP_API_URL}/api/doctor/existing-user-opd`,
  //       {
  //         age: typeof age === "number" ? age : null, // Ensure age is a number
  //         checkupInfo,
  //         user: selectedUser._id,
  //         medicalDetails: selectedUser.medicalDetails._id,
  //         userDetails: selectedUser.userDetails._id,
  //       }
  //     );
  //     // Navigate to the OPD page with the response data
  //     navigate(`/dashboard/checkup/${response.data}`);

  //     toast.success("OPD created successfully!", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       theme: "colored",
  //     });

  //     closeModal();
  //   } catch (error) {
  //     console.error(error);
  //     setAllPatientsError(
  //       error.response?.data?.message || "Failed to create OPD."
  //     );
  //     toast.error(error.response?.data?.message || "Failed to create OPD.", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       theme: "colored",
  //     });
  //     closeModal();
  //   }
  // };

  const handleSubmit = async () => {
    if (!checkupInfo) {
      toast.error("Chief complaint is required.");
      return;
    }

    let toastId;
    try {
      toastId = toast.loading("OPD Creating...", {
        position: "top-center",
        theme: "colored",
      });

      const response = await API.post(
        `${process.env.REACT_APP_API_URL}/api/doctor/existing-user-opd`,
        {
          age: typeof age === "number" ? age : null,
          checkupInfo,
          user: selectedUser._id,
          medicalDetails: selectedUser.medicalDetails._id,
          userDetails: selectedUser.userDetails._id,
        }
      );

      toast.update(toastId, {
        render: "OPD Created Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: true,
      });

      navigate(`/dashboard/checkup/${response.data}`);
      closeModal();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Failed to create OPD.";

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: true,
      });

      setAllPatientsError(errorMessage);
      closeModal();
    }
  };

  // Handle editing a user
  const handleEdit = (id) => {
    navigate(`/dashboard/edit-user/${id}`);
  };

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`);

      // Remove the deleted user from both allPatients and filteredUsers states
      setAllPatients((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

      toast.success("User deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to delete user.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "colored",
        }
      );
    }
  };

  // Fetch all users on component mount
  useEffect(() => {
    if (!allPatients.length) {
      getAllPateintData();
    }
  }, [allPatients.length, getAllPateintData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle OPD Creation (if needed)
  const handleOPDCreate = async (user) => {
    console.log("user: ", user);
    try {
      const userAge = calculateAge(user.userDetails.dateOfBirth);
      const response = await API.post(
        `${process.env.REACT_APP_API_URL}/api/doctor/existing-user-opd`,
        {
          age: userAge,
          checkupInfo,
          user: user._id,
          medicalDetails: user.medicalDetails._id,
          userDetails: user.userDetails._id,
        }
      );

      navigate(`/dashboard/checkup/${response.data}`);

      toast.success("OPD created successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      setAllPatientsError(
        error.response?.data?.message || "Failed to create OPD."
      );
      toast.error(error.response?.data?.message || "Failed to create OPD.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

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

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  if (allPatientsLoading) {
    return <Loading />;
  }

  if (allPatientsError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 text-xl">{allPatientsError}</div>
      </div>
    );
  }
  const handleOpenPatient = (id) => {
    // Handle the checkup action, e.g., navigate to checkup page
    console.log(`Patient ID: ${id}`);
    navigate(`/dashboard/patient/${id}`); // Navigate to Checkup component with OPD ID
  };

  return (
    <div className="min-h-screen md:px-6">
      <div className="mx-auto p-4 bg-white shadow-md rounded-lg ">
        <header className="flex justify-center items-center mb-6 bg-gradient-to-r from-[#111827] to-[#111827e7] py-4 rounded-lg shadow-lg px-4">
          <div className="flex items-center space-x-3">
            {/* Left Icon */}
            <img src={user} alt="Dental Icon" className="h-12 w-12" />
            {/* Title */}
            <h1 className="text-3xl font-bold text-lime-600 text-center">
              All Patient
            </h1>
            {/* Right Icon */}
            {/* <img
              src={logo}
              alt="Tooth Icon"
              className="h-12 w-12 rounded-full"
            /> */}
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute top-3 left-3 text-blue-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Email or Name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search Users"
            />
          </div>
        </div>

        {/* Pagination and Items Per Page */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          {/* Items Per Page Selector */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <label htmlFor="itemsPerPage" className="font-medium">
              Items Per Page :
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex space-x-2">
            <AnimatePresence>
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index + 1}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Users List For Mobile*/}

        <div className="block md:hidden space-y-6">
          {paginatedUsers?.length > 0 ? (
            paginatedUsers
              .filter((user) => user.role === "patient")
              .map((user, index) => (
                <motion.div
                  key={user._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm"
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={containerVariants}
                >
                  {/* Header */}
                  <div
                    className="flex flex-col justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleTile(user._id)}
                    aria-expanded={expandedTiles[user._id] || false}
                  >
                    <div>
                      {/* ✅ Mobile Version - Previous Design */}
                      <div className="block md:hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <tbody>
                              <tr className="bg-gray-100">
                                <td className="border px-4 py-2 font-medium">
                                  Name
                                </td>
                                <td className="border px-4 py-2">
                                  <span className="text-blue-600">
                                    <Link to={`/dashboard/patient/${user._id}`}>
                                      {user.userDetails?.name || "N/A"}
                                    </Link>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border px-4 py-2 font-medium">
                                  Email
                                </td>
                                <td className="border px-4 py-2">
                                  {user.email || "N/A"}
                                </td>
                              </tr>
                              <tr className="bg-gray-100">
                                <td className="border px-4 py-2 font-medium">
                                  Account Status
                                </td>
                                <td className="border px-4 py-2">
                                  {user.status.charAt(0).toUpperCase() +
                                    user.status.slice(1)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border px-4 py-2 font-medium">
                                  Created At
                                </td>
                                <td className="border px-4 py-2">
                                  {new Date(user.createdAt).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown For Desktop */}
                    <div className="md:hidden block">
                      {expandedTiles[user._id] ? (
                        <button className="border bg-blue-600 text-white px-3 py-1 rounded-lg mt-2 hover:bg-blue-500">
                          View Less
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
                    {expandedTiles[user._id] && (
                      <motion.div
                        className="px-4 pb-4"
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={variants}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="mt-4 border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            {/* User Details */}
                            <div>
                              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                                User Details
                              </h2>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                  <tbody>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Name
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.name || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border px-4 py-2 font-medium">
                                        Gender
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.gender || "N/A"}
                                      </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Date of Birth
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.dateOfBirth
                                          ? new Date(
                                              user.userDetails.dateOfBirth
                                            ).toLocaleDateString()
                                          : "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border px-4 py-2 font-medium">
                                        Contact
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.contact?.mobile ||
                                          "N/A"}
                                      </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Email
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.contact?.email ||
                                          "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border px-4 py-2 font-medium">
                                        Address
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.contact?.address ||
                                          "N/A"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Emergency Contact */}
                            {/* <div>
                              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                                Emergency Contact
                              </h2>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                  <tbody>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Name
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.emergencyContact
                                          ?.name || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border px-4 py-2 font-medium">
                                        Relationship
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.emergencyContact
                                          ?.relationship || "N/A"}
                                      </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Phone
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.userDetails?.emergencyContact
                                          ?.phone || "N/A"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div> */}

                            {/* Medical Details */}
                            <div>
                              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                                Medical Details
                              </h2>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                  <tbody>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Blood Group
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.medicalDetails?.bloodGroup ||
                                          "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border px-4 py-2 font-medium">
                                        Medical History
                                      </td>
                                      <td className="border px-4 py-2">
                                        {Array.isArray(
                                          user.medicalDetails?.medicalHistory
                                        )
                                          ? user.medicalDetails.medicalHistory.join(
                                              ", "
                                            )
                                          : user.medicalDetails
                                              ?.medicalHistory || "N/A"}
                                      </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                      <td className="border px-4 py-2 font-medium">
                                        Past Dental History
                                      </td>
                                      <td className="border px-4 py-2">
                                        {renderDentalHistory(
                                          user.medicalDetails?.pastDentalHistory
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border px-4 py-2 font-medium">
                                        Notes
                                      </td>
                                      <td className="border px-4 py-2">
                                        {user.medicalDetails?.notes ||
                                          "No additional notes."}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Previous OPD */}
                            <div>
                              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                                Previous OPD
                              </h2>
                              {user?.opdForms && user.opdForms.length > 0 ? (
                                <ul className="list-disc list-inside ml-4 text-blue-600">
                                  {user.opdForms.map((opd) => (
                                    <li key={opd._id}>
                                      <Link
                                        to={`/dashboard/checkup/${opd}`}
                                        className="hover:underline"
                                      >
                                        {opd.opdNumber} ( {opd.checkupInfo} -{" "}
                                        {new Date(
                                          opd.createdAt
                                        ).toLocaleDateString()}{" "}
                                        )
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="ml-4 text-gray-600">
                                  No OPD records found.
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                              <button
                                className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none text-sm sm:text-base"
                                onClick={() => openModal(user)}
                              >
                                Create OPD
                              </button>
                              <button
                                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none text-sm sm:text-base"
                                onClick={() => openAppointmentModal(user)}
                              >
                                Create Appointment
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
          ) : (
            <div className="text-center text-gray-600">
              No users found matching your search.
            </div>
          )}
        </div>

        {/* Users List For Desktop*/}

        <div className="space-y-6 hidden md:block">
          {paginatedUsers?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                {/* Table Head */}
                <thead>
                  <tr className="bg-blue-600 text-white text-center border border-gray-300">
                    <th className="px-4 py-3 border border-gray-300">Name</th>
                    <th className="px-4 py-3 border border-gray-300">Email</th>
                    <th className="px-4 py-3 border border-gray-300">
                      Account Status
                    </th>
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
                  {paginatedUsers
                    .filter((user) => user.role === "patient")
                    .map((user) => (
                      <React.Fragment key={user._id}>
                        {/* Patient Row */}
                        <tr className="bg-white text-gray-800 border-b hover:bg-gray-100 transition-all text-center">
                          <td className="px-4 py-3 font-semibold text-blue-600 border border-gray-300">
                            <Link to={`/dashboard/patient/${user._id}`}>
                              {user.userDetails?.name || "N/A"}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-gray-700 border border-gray-300">
                            {user.email || "N/A"}
                          </td>
                          <td className="px-4 py-3 border border-gray-300">
                            <span
                              className={`px-3 py-1 rounded-md font-semibold inline-block ${
                                user.status === "active"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 border border-gray-300">
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          {/* More Details Button */}
                          <td className="px-4 py-3 text-gray-700 border border-gray-300">
                            <button
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                              onClick={() => toggleTile(user._id)}
                            >
                              {expandedTiles[user._id]
                                ? "View Less"
                                : "View More"}
                            </button>
                          </td>
                        </tr>

                       
                        {/* Expanded Details (Hidden by Default) */}
                        {expandedTiles[user._id] && (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 pb-4 bg-gray-100 border border-gray-300"
                            >
                              <motion.div
                                className="p-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                              >
                                <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
                                  <User size={28} className="text-blue-600" />{" "}
                                  Patient Details
                                </h2>

                                {/* 🌐 Responsive Grid Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {/* 🟦 Personal Info */}
                                  <div className="p-6 border rounded-xl bg-blue-50 shadow-lg hover:shadow-xl transition-all border-blue-300 h-64 flex flex-col">
                                    <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-3">
                                      <User
                                        size={20}
                                        className="text-blue-500"
                                      />{" "}
                                      Personal Information
                                    </h3>
                                    <div className="overflow-y-auto flex-grow">
                                      <p className="mb-2 flex items-center gap-2">
                                        <User
                                          size={16}
                                          className="text-blue-500 flex-shrink-0"
                                        />
                                        <strong>Gender:</strong>{" "}
                                        {user.userDetails?.gender || "N/A"}
                                      </p>
                                      <p className="mb-2 flex items-center gap-2">
                                        <Calendar
                                          size={16}
                                          className="text-blue-500 flex-shrink-0"
                                        />
                                        <strong>DOB:</strong>{" "}
                                        {user.userDetails?.dateOfBirth
                                          ? new Date(
                                              user.userDetails.dateOfBirth
                                            ).toLocaleDateString()
                                          : "N/A"}
                                      </p>
                                      <p className="mb-2 flex items-center gap-2">
                                        <Phone
                                          size={16}
                                          className="text-blue-500 flex-shrink-0"
                                        />
                                        <strong>Contact:</strong>{" "}
                                        {user.userDetails?.contact?.mobile ||
                                          "N/A"}
                                      </p>
                                      <p className="mb-2 flex items-center gap-2">
                                        <MapPin
                                          size={16}
                                          className="text-blue-500 flex-shrink-0"
                                        />
                                        <strong>Address:</strong>{" "}
                                        {user.userDetails?.contact?.address ||
                                          "N/A"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* 🟩 Medical Details */}
                                  <div className="p-6 border rounded-xl bg-green-50 shadow-lg hover:shadow-xl transition-all border-green-300 h-64 flex flex-col">
                                    <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-3">
                                      <Heart
                                        size={20}
                                        className="text-green-500"
                                      />{" "}
                                      Medical Details
                                    </h3>
                                    <div className="overflow-y-auto flex-grow">
                                      <p className="mb-2 flex items-center gap-2">
                                        <Droplet
                                          size={16}
                                          className="text-green-500 flex-shrink-0"
                                        />
                                        <strong>Blood Group:</strong>{" "}
                                        {user.medicalDetails?.bloodGroup ||
                                          "N/A"}
                                      </p>
                                      <p className="mb-2 flex items-center gap-2">
                                        <FileText
                                          size={16}
                                          className="text-green-500 flex-shrink-0"
                                        />
                                        <strong>Medical History:</strong>{" "}
                                        {Array.isArray(
                                          user.medicalDetails?.medicalHistory
                                        )
                                          ? user.medicalDetails.medicalHistory.join(
                                              ", "
                                            )
                                          : user.medicalDetails
                                              ?.medicalHistory || "N/A"}
                                      </p>
                                      <p className="mb-2 flex items-center gap-2">
                                        <FaTooth
                                          size={16}
                                          className="text-green-500 flex-shrink-0"
                                        />
                                        <strong>Past Dental History:</strong>{" "}
                                        {renderDentalHistory(
                                          user.medicalDetails?.pastDentalHistory
                                        ) || "NA"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* 🟣 Previous OPD */}
                                  <div className="p-6 border rounded-xl bg-purple-50 shadow-lg hover:shadow-xl transition-all border-purple-300 h-64 flex flex-col">
                                    <h3 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-3">
                                      <ClipboardList
                                        size={20}
                                        className="text-purple-500"
                                      />{" "}
                                      Previous OPD
                                    </h3>
                                    <div className="overflow-y-auto flex-grow">
                                      {user?.opdForms &&
                                      user.opdForms.length > 0 ? (
                                        <ul className="list-disc list-inside ml-4 text-purple-600">
                                          {user.opdForms.map((opd) => (
                                            <li key={opd._id} className="mb-2">
                                              <Link
                                                to={`/dashboard/checkup/${opd}`}
                                                className="hover:underline"
                                              >
                                                {opd.opdNumber} (
                                                {opd.checkupInfo} -{" "}
                                                {new Date(
                                                  opd.createdAt
                                                ).toLocaleDateString()}
                                                )
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="ml-4 text-gray-600">
                                          No OPD records found.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* 🔹 Action Buttons */}
                                <div className="flex justify-center space-x-4 mt-8">
                                  <button
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                    onClick={() => openModal(user)}
                                  >
                                    Create OPD
                                  </button>
                                  <button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                    onClick={() => openAppointmentModal(user)}
                                  >
                                    Create Appointment
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
              No users found matching your search.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
            {/* Items Per Page Selector */}
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <label htmlFor="itemsPerPage" className="font-medium">
                Items per Page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              <AnimatePresence>
                {Array.from({ length: totalPages }, (_, index) => (
                  <motion.button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    aria-label={`Go to page ${index + 1}`}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Chief Complaint Modal */}
        {/* With Secelet Functionlity */}

        {/* Chief Complaint Modal */}
        {isModalOpen && selectedUser && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="chief-complaint-modal"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h2
                id="chief-complaint-modal"
                className="text-xl font-semibold mb-4"
              >
                Select Chief Complaint
              </h2>
              <div className="mb-4">
                <span className="font-medium">Age:</span>{" "}
                {age !== "N/A" ? age : "Not Available"}
              </div>
              <div className="w-full">
                <label className="font-medium block mb-2">
                  Chief Complaint:
                </label>
                <select
                  value={checkupInfo}
                  onChange={(e) => setCheckupInfo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select chief complaint"
                >
                  <option value="" disabled>
                    Select a reason...
                  </option>
                  {dentalReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none text-sm sm:text-base"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none text-sm sm:text-base"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Without Secelet Functionlity */}
        {/* {isModalOpen && selectedUser && ( 
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="chief-complaint-modal"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h2
                id="chief-complaint-modal"
                className="text-xl font-semibold mb-4"
              >
                Enter Chief Complaint
              </h2>
              <span className="font-medium">Age:</span>{" "}
              {age !== "N/A" ? age : "Not Available"}
              <textarea
                value={checkupInfo}
                onChange={(e) => setCheckupInfo(e.target.value)}
                placeholder="Describe the chief complaint..."
                className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                aria-label="Chief Complaint"
              ></textarea>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none text-sm sm:text-base"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none text-sm sm:text-base"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Appointment Modal */}
        {isAppointmentModalOpen && selectedUser && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="appointment-modal"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h2 id="appointment-modal" className="text-xl font-semibold mb-4">
                Create an Appointment
              </h2>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="block text-gray-600 mb-1"
                  >
                    Preferred Appointment Date:
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={today.toISOString().split("T")[0]}
                    max={maxDate.toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="timeBlock"
                    className="block text-gray-600 mb-1"
                  >
                    Preferred Time Block:
                  </label>
                  <select
                    id="timeBlock"
                    value={timeBlock}
                    onChange={(e) => setTimeBlock(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="" disabled>
                      Select a time block
                    </option>
                    {timeBlocks.map((block) => (
                      <option key={block} value={block}>
                        {block}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reason" className="block text-gray-600 mb-1">
                    Reason for Visit:
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (e.target.value !== "Other") setOtherReason("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="" disabled>
                      Select a reason
                    </option>
                    {reasonOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {reason === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
                      required
                    />
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none text-sm sm:text-base"
                    onClick={closeAppointmentModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none text-sm sm:text-base"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default UsersList;
