import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../Spinner';
import Loading from '../../Loading';
import { dentalReasons } from '../../../data';

const UsersList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkupInfo, setCheckupInfo] = useState('');
  const [expandedTiles, setExpandedTiles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [selectedMainReason, setSelectedMainReason] = useState("");
    const [selectedSubReason, setSelectedSubReason] = useState("");
    const [customReason, setCustomReason] = useState("");
  
    useEffect(() => {
      if (selectedMainReason === "Others") {
        setCheckupInfo(customReason);
      } else {
        const isNestedReason = dentalReasons.some(
          (item) =>
            typeof item === "object" &&
            Object.keys(item)[0] === selectedMainReason
        );
  
        if (isNestedReason) {
          setCheckupInfo(
            selectedSubReason ? `${selectedMainReason}: ${selectedSubReason}` : ""
          );
        } else {
          setCheckupInfo(selectedMainReason);
        }
      }
    }, [selectedMainReason, selectedSubReason, customReason]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get(`${process.env.REACT_APP_API_URL}/api/doctor/get-all-users`);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerCaseTerm = term.toLowerCase();
      const filtered = users.filter((user) => {
        const email = user.email.toLowerCase();
        const name = user.userDetails?.name?.toLowerCase() || '';
        const role = user.role.toLowerCase();
        return email.includes(lowerCaseTerm) || name.includes(lowerCaseTerm) || role.includes(lowerCaseTerm);
      });
      setFilteredUsers(filtered);
    }
  };

  const toggleTile = (id) => {
    setExpandedTiles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCheckupInfo('');
  };

  const handleSubmit = async () => {
    if (!checkupInfo) {
      toast.error('Chief complaint is required.');
      return;
    }

    try {
      const response = await API.post(`${process.env.REACT_APP_API_URL}/api/doctor/existing-user-opd`, {
        age: 12, // Example value, adjust as needed
        checkupInfo,
        user: selectedUser._id,
        medicalDetails: selectedUser.medicalDetails._id,
        userDetails: selectedUser.userDetails._id,
      });
      navigate(`/dashboard/checkup/${response.data}`);
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!');
      closeModal();
    }
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="mx-auto p-6 bg-white shadow-md rounded-lg max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">All Patients</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by email, name, or role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredUsers.length > 0 ? (
            filteredUsers
              .filter((user) => user.role === 'patient')
              .map((user, index) => (
                <motion.div
                  key={user._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm"
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: (i) => ({
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.05 },
                    }),
                  }}
                >
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleTile(user._id)}
                  >
                    <div>
                      <p className="text-xl font-semibold text-gray-800">
                        Name: <span className="text-blue-600">{user.userDetails?.name || 'N/A'}</span>
                      </p>
                      <p className="text-md text-gray-600">
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                    </div>
                    <div>
                      {expandedTiles[user._id] ? (
                        <FaChevronUp className="h-6 w-6 text-gray-600" />
                      ) : (
                        <FaChevronDown className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTiles[user._id] && (
                      <motion.div
                        className="px-4 pb-4"
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={{
                          collapsed: { height: 0, opacity: 0, overflow: 'hidden' },
                          expanded: { height: 'auto', opacity: 1 },
                        }}
                      >
                        <div className="flex justify-end mt-4">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                            onClick={() => openModal(user)}
                          >
                            Create OPD
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
          ) : (
            <div className="text-center text-gray-600">No users found matching your search.</div>
          )}
        </div>
      </div>

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
                      Choose Your Chief Complaint
                    </h2>
                    <span className="font-medium">Age:</span>{" "}
                    {age !== "N/A" ? age : "Not Available"}
                    <div className="mt-4 space-y-4">
                      {/* Main reasons dropdown */}
                      <select
                        value={selectedMainReason}
                        onChange={(e) => setSelectedMainReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Select chief complaint"
                      >
                        <option value="">Select a reason</option>
                        {dentalReasons.map((item, index) => {
                          if (typeof item === "string") {
                            return (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            );
                          } else {
                            const key = Object.keys(item)[0];
                            return (
                              <option key={index} value={key}>
                                {key}
                              </option>
                            );
                          }
                        })}
                        <option value="Others">Others</option>
                      </select>
      
                      {/* Sub-reasons dropdown for nested options */}
                      {selectedMainReason &&
                        selectedMainReason !== "Others" &&
                        dentalReasons.some(
                          (item) =>
                            typeof item === "object" &&
                            Object.keys(item)[0] === selectedMainReason
                        ) && (
                          <select
                            value={selectedSubReason}
                            onChange={(e) => setSelectedSubReason(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Select sub-reason"
                          >
                            <option value="">Select sub-reason</option>
                            {dentalReasons
                              .find(
                                (item) =>
                                  typeof item === "object" &&
                                  Object.keys(item)[0] === selectedMainReason
                              )
                              [selectedMainReason].map((subReason, subIndex) => (
                                <option key={subIndex} value={subReason}>
                                  {subReason}
                                </option>
                              ))}
                          </select>
                        )}
      
                      {/* Custom input for 'Others' */}
                      {selectedMainReason === "Others" && (
                        <textarea
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                          placeholder="Write your reason here..."
                          className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Custom reason"
                        />
                      )}
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

      <ToastContainer />
    </div>
  );
};

export default UsersList;
