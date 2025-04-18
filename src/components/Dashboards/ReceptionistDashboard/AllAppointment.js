// src/components/AllAppointment.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import { toast } from "react-toastify";
import user from "../../../assets/image/user.jpg"
import logo from "../../../assets/image/kkgt-header-image.jpg"
import { startTransition } from 'react';
import { Suspense } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import AppointmentCard from "../AppointmentCard";
import AppointmentTableRow from "../AppointmentTableRow";

// Main Component
const AllAppointment = () => {
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    getUpcomingAppointments,
    setAppointments,
    setAppointmentsError,
  } = useContext(AuthContext);

  const [pendingUpdates, setPendingUpdates] = useState({});
  const [loadingUpdates, setLoadingUpdates] = useState({}); // Loader state for each appointment

  // Filter States
  const [dateFilter, setDateFilter] = useState("today"); // 'today', 'upcoming', 'past', 'all'
  const [statusFilter, setStatusFilter] = useState("all"); // 'Scheduled', 'Pending', 'Completed', 'Cancelled', 'all'
  const [sortOption, setSortOption] = useState("none"); // 'name', 'date', 'none'

  const handleInputChange = (id, field, value) => {
    setPendingUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    const updates = pendingUpdates[id];
    if (!updates) {
      toast.error("No changes to update.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
      return;
    }

    setLoadingUpdates((prev) => ({ ...prev, [id]: true }));

    try {
      await API.put(
        `${process.env.REACT_APP_API_URL}/api/receptionist/appointment/${id}`,
        updates
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id ? { ...appointment, ...updates } : appointment
        )
      );

      setPendingUpdates((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      toast.success("Appointment updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } catch (error) {
      console.error(error);
      setAppointmentsError(
        error.response?.data?.message || "Failed to update appointment"
      );
      toast.error(
        error.response?.data?.message || "Failed to update appointment",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
        }
      );
    } finally {
      setLoadingUpdates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(
        `${process.env.REACT_APP_API_URL}/api/receptionist/appointment/${id}`
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== id)
      );
      toast.success("Appointment deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } catch (error) {
      console.error(error);
      setAppointmentsError(
        error.response?.data?.message || "Failed to delete appointment"
      );
      toast.error(
        error.response?.data?.message || "Failed to delete appointment",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
        }
      );
    }
  };

  // Filtering and Sorting Logic Without External Libraries
  const filteredAppointments = useMemo(() => {
    const today = new Date();
    // Reset time to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);

    let filtered = appointments.filter((appointment) => {
      let dateCondition = true;
      let statusCondition = true;

      // Date Filter
      if (dateFilter !== "all") {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);

        if (dateFilter === "today") {
          dateCondition = appointmentDate.getTime() === today.getTime();
        } else if (dateFilter === "upcoming") {
          dateCondition = appointmentDate.getTime() > today.getTime();
        } else if (dateFilter === "past") {
          dateCondition = appointmentDate.getTime() < today.getTime();
        }
      }

      // Status Filter
      if (statusFilter !== "all") {
        statusCondition =
          appointment.status.toLowerCase() === statusFilter.toLowerCase();
      }

      return dateCondition && statusCondition;
    });

    // Sorting Logic
    if (sortOption !== "none") {
      filtered.sort((a, b) => {
        if (sortOption === "name") {
          const nameA = a.name ? a.name.toLowerCase() : "";
          const nameB = b.name ? b.name.toLowerCase() : "";
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else if (sortOption === "date") {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB; // Ascending order
        }
        return 0;
      });
    }

    return filtered;
  }, [appointments, dateFilter, statusFilter, sortOption]);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const totalPages = useMemo(
    () => Math.ceil(filteredAppointments.length / itemsPerPage),
    [filteredAppointments.length, itemsPerPage]
  );

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // Reset to first page when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, statusFilter, sortOption]);

  useEffect(() => {
    if (!appointments.length) {
      getUpcomingAppointments(); // Fetch only if no appointments available
    }
  }, [appointments, getUpcomingAppointments]);

  // ** New State for View Type **
  const [viewType, setViewType] = useState("card"); // 'card' or 'table'

  // Function to render table view
  const renderTableView = () => (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Date</th>
          <th className="py-2 px-4 border-b">Time Block</th>
          <th className="py-2 px-4 border-b">Reason</th>
          <th className="py-2 px-4 border-b">Status</th>
          <th className="py-2 px-4 border-b">Notes</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>
          {paginatedAppointments.map((item) => (
            <AppointmentTableRow
              key={item._id}
              item={item}
              handleInputChange={handleInputChange}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              loadingUpdates={loadingUpdates}
            />
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen md:px-6 ">
    <div className="mx-auto md:p-4 bg-white shadow-md rounded-lg">

      
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

      {/* Error Message */}
      {appointmentsError && (
        <p className="text-red-500 mb-4">{appointmentsError}</p>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        {/* Date Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="dateFilter" className="font-medium">
          Date Of Appointment :
          </label>
          <select
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-2"
          >
            <option value="all" className="text-blue-600 mr-2">All</option>
            <option value="today" className="text-blue-500 mr-2">Today</option>
            <option value="upcoming" className="text-blue-500 mr-2">Upcoming</option>
            <option value="past" className="text-blue-500 mr-2">Past</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="statusFilter" className="font-medium">
          Know Status :
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all" className="text-blue-600 mr-2">All</option>
            <option value="Scheduled" className="text-blue-600 mr-2" >Scheduled</option>
            <option value="Pending" className="text-blue-600 mr-2" >Pending</option>
            <option value="Completed" className="text-blue-600 mr-2">Completed</option>
            <option value="Cancelled" className="text-blue-600 mr-2">Cancelled</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sortOption" className="font-medium">
            Sort By :
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none" className="text-blue-600 mr-2">None</option>
            <option value="name" className="text-blue-600 mr-2">Name</option>
            <option value="date" className="text-blue-600 mr-2">Date</option>
          </select>
        </div>

        {/* Display mode */}
        <div className="flex items-center space-x-2">
          <label htmlFor="viewType" className="font-medium">
            View :
          </label>
          <select
            id="viewType"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="card">Card</option>
            <option value="table">Table </option>
          </select>
        </div>

        {/* Clear Filters and Sort Button */}
        <button
          onClick={() => {
            setDateFilter("today");
            setStatusFilter("all");
            setSortOption("none");
          }}
          className="mt-2 sm:mt-0 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
        >
          Clear Filters
        </button>
      </div>

      {/* Loading State */}
      {appointmentsLoading ? (
        <Loading />
      ) : (
        <>
          {/* ** Conditionally Render Views ** */}
          {filteredAppointments.length > 0 ? (
            <>
              {viewType === "card" ? (
                // Responsive Grid of Appointment Cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {paginatedAppointments.map((item) => (
                      <AppointmentCard
                        key={item._id}
                        item={item}
                        handleInputChange={handleInputChange}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        loadingUpdates={loadingUpdates}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                // ** Table View **
                renderTableView()
              )}

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
                {/* Items Per Page Selector */}
                <div className="mb-4 sm:mb-0">
                  <label htmlFor="itemsPerPage" className="mr-2 font-medium">
                    Items per Page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1); // Reset to first page when items per page changes
                    }}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                  <AnimatePresence>
                    {pageNumbers.map((number) => (
                      <motion.button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-4 py-2 rounded-md text-sm font-medium
                          ${
                            currentPage === number
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {number}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            <p>No appointments match the selected filters.</p>
          )}
        </>
      )}

      </div>
    </div>
  );
};

export default AllAppointment;
