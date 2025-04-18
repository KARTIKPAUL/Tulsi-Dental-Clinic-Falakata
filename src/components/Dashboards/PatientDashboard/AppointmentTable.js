import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sample component
export default function AppointmentTable({ userDetails }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [sortType, setSortType] = useState("date"); // Default sort by date

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Memoize currentItems to prevent unnecessary calculations
  const currentItems = useMemo(
    () => userDetails.slice(indexOfFirstItem, indexOfLastItem),
    [userDetails, indexOfFirstItem, indexOfLastItem]
  );

  // Handle sorting
  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Memoize sortedAppointments for performance
  const sortedAppointments = useMemo(() => {
    return [...currentItems].sort((a, b) => {
      switch (sortType) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [currentItems, sortType]);

  // Pagination buttons
  const pageNumbers = useMemo(() => {
    const totalPages = Math.ceil(userDetails.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [userDetails.length, itemsPerPage]);

  return (
    <div className="p-4">
      {/* Sort and Items Per Page Dropdowns */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        {/* Sort Dropdown */}
        <div>
          <label
            htmlFor="sort"
            className="mr-2 font-medium text-sm md:text-base"
          >
            Sort By:
          </label>
          <select
            id="sort"
            value={sortType}
            onChange={handleSortChange}
            className="border rounded px-2 py-1 text-sm md:text-base"
          >
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Items Per Page Dropdown */}
        <div>
          <label
            htmlFor="itemsPerPage"
            className="mr-2 font-medium text-sm md:text-base"
          >
            Items per Page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1 text-sm md:text-base"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Appointment Table for Larger Screens */}
      <div className="hidden sm:block overflow-x-auto">
        <motion.table
          className="min-w-full bg-slate-100 border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="border-b bg-gray-200">
              <th className="py-2 px-2 md:px-4 text-xs md:text-sm">
                Appointment Date
              </th>
              <th className="py-2 px-2 md:px-4 text-xs md:text-sm">
                Time Block
              </th>
              <th className="py-2 px-2 md:px-4 text-xs md:text-sm">Reason</th>
              <th className="py-2 px-2 md:px-4 text-xs md:text-sm">Status</th>
              <th className="py-2 px-2 md:px-4 text-xs md:text-sm hidden sm:table-cell">
                Notes
              </th>
            </tr>
          </thead>
          <AnimatePresence>
            <tbody>
              {sortedAppointments.map((item) => (
                <motion.tr
                  key={item._id}
                  className="border-b hover:bg-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-2 px-2 md:px-4 text-xs md:text-sm">
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-xs md:text-sm">
                    {item.timeBlock}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-xs md:text-sm">
                    {item.reason}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-xs md:text-sm">
                    {item.status}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-xs md:text-sm hidden sm:table-cell">
                    {item.notes || "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </motion.table>
      </div>

      {/* Appointment Cards for Small Screens */}
      <div className="block sm:hidden">
        {sortedAppointments.map((item) => (
          <motion.div
            key={item._id}
            className="border rounded p-4 mb-4 bg-slate-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm">
              <strong>Date:</strong>{" "}
              {new Date(item.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-sm">
              <strong>Time Block:</strong> {item.timeBlock}
            </p>
            <p className="text-sm">
              <strong>Reason:</strong> {item.reason}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> {item.status}
            </p>
            <p className="text-sm">
              <strong>Notes:</strong> {item.notes || "-"}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2 ">
        <AnimatePresence>
          {pageNumbers.map((number) => (
            <motion.button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 border rounded text-xs md:text-sm
                ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }
              `}
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
  );
}
