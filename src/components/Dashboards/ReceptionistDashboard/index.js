// src/components/Dashboard.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import CalendarWidget from "../../CalendarWidget";
import dayjs from "dayjs";
import LoadingErrorComponent from "../../LoadingError/LoadingError";
import { Link } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import user from "../../../assets/image/user.jpg";
import logo from "../../../assets/image/kkgt-header-image.jpg";

import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaChartPie,
} from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    getUpcomingAppointments,
  } = useContext(AuthContext);
  const today = new Date();
  const [childDate, setChildDate] = useState(today);

  useEffect(() => {
    if (appointments.length === 0) {
      getUpcomingAppointments(); // Fetch only if no appointments available
    }
  }, [appointments, getUpcomingAppointments]);

  // Function to receive data from child
  const handleDataFromChild = (data) => {
    setChildDate(data);
  };

  // Function to format timeBlock to a single time (optional)
  const formatTime = (timeBlock) => {
    // Assuming timeBlock is in the format "6:00 PM - 8:00 PM"
    // You can modify this function based on your requirements
    return timeBlock.split(" - ")[0]; // Returns "6:00 PM"
  };

  const formatDate = (isoDate) => {
    return dayjs(isoDate).format("MMMM D, YYYY"); // Example: September 5, 2024
  };

  // Helper function to parse time string to minutes since midnight
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  // Memoized filtered and sorted appointments for today
  const todayAppointments = useMemo(() => {
    const today = new Date();
    // Reset time to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime();
      })
      .sort((a, b) => {
        const timeA = parseTime(a.timeBlock.split(" - ")[0] || "");
        const timeB = parseTime(b.timeBlock.split(" - ")[0] || "");
        return timeA - timeB;
      });
  }, [appointments]);

  // Memoized filtered and sorted appointments for today
  const selectedDateAppointements = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const selectedDate = new Date(childDate);

        return (
          appointmentDate.getFullYear() === selectedDate.getFullYear() &&
          appointmentDate.getMonth() === selectedDate.getMonth() &&
          appointmentDate.getDate() === selectedDate.getDate()
        );
      })
      .sort((a, b) => {
        const timeA = parseTime(a.timeBlock.split(" - ")[0]);
        const timeB = parseTime(b.timeBlock.split(" - ")[0]);
        return timeA - timeB;
      });
  }, [appointments, childDate]);

  // Helper function to parse date string to Date object without time
  const parseDate = (isoDate) => {
    const date = new Date(isoDate);
    // Reset time to midnight for accurate comparison
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Memoized filtered and sorted appointments for upcoming
  const upcomingAppointments = useMemo(() => {
    const today = parseDate(new Date());

    return appointments
      .filter((appointment) => {
        const appointmentDate = parseDate(appointment.date);
        // Include appointments that are today or in the future
        return appointmentDate > today;
      })
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB; // Sort by date
        }

        // If dates are the same, sort by time
        const timeA = parseTime(a.timeBlock.split(" - ")[0]);
        const timeB = parseTime(b.timeBlock.split(" - ")[0]);
        return timeA - timeB;
      });
  }, [appointments]);

  const pendingAppointmentsCount = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status.toLowerCase() === "pending"
    ).length;
  }, [appointments]);

  const completedAppointmentsCount = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status.toLowerCase().trim() === "completed"
    ).length;
  }, [appointments]);

  // Ensure values are valid numbers
  const totalAppitements = appointments?.length || 0;
  const totalCompletedAppitements = completedAppointmentsCount || 0;
  const todaysTotalAppitements = todayAppointments?.length || 0;
  const upcomingTotalAppitements = upcomingAppointments?.length || 0;
  const totalPendingAppointmentsCount = pendingAppointmentsCount || 0;

  const pieData = {
    labels: [
      "TotalAppoitments",
      "CompletedAppoitements",
      "TodaysAppoitement",
      "UpcomingAppoitment",
      "PendingAppoitment",
    ],
    datasets: [
      {
        data: [
          totalAppitements,
          totalCompletedAppitements,
          todaysTotalAppitements,
          upcomingTotalAppitements,
          totalPendingAppointmentsCount,
        ],
        backgroundColor: [
          "#4CAF50",
          "#3B82F6",
          "#1E3A8A",
          "#F59E0B",
          "#eb3d34",
        ],
      },
    ],
  };

  return (
    <div>
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-center items-center mb-6 bg-gradient-to-r from-lime-50 to-white py-4 rounded-lg shadow-lg px-4">
          <div className="flex items-center space-x-3">
            {/* Left Icon */}
            <img src={user} alt="Dental Icon" className="h-12 w-12" />
            {/* Title */}
            <h1 className="text-3xl font-bold text-lime-600 text-center">
            Tulsi Dental Clinic
            </h1>
            {/* Right Icon */}
            <img
              src={logo}
              alt="Tooth Icon"
              className="h-12 w-12 rounded-full"
            />
          </div>
        </header>

        {/* Statistics */}

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Section Title */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Dashboard Statistics
          </h2>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Appointments */}
            <div className="bg-blue-100 p-5 rounded-lg shadow-md flex flex-col items-center sm:col-span-2 md:col-span-1">
              <FaClipboardList className="text-blue-600 text-4xl mb-2" />
              <h3 className="text-lg font-medium text-blue-700">
                Total Appointments
              </h3>
              <p className="text-3xl font-bold">{appointments.length}</p>
            </div>

            {/* Completed and Today's Appointments - Single Row on Mobile */}
            <div className="grid grid-cols-2 gap-4 w-full sm:col-span-2">
              {/* Completed Appointments */}
              <div className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col items-center">
                <FaCheckCircle className="text-green-600 text-3xl mb-1" />
                <h3 className="text-base font-medium text-green-700">
                  Completed
                </h3>
                <p className="text-2xl font-bold">
                  {completedAppointmentsCount}
                </p>
              </div>

              {/* Today's Appointments */}
              <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex flex-col items-center">
                <FaCalendarCheck className="text-yellow-600 text-3xl mb-1" />
                <h3 className="text-base font-medium text-yellow-700">
                  For Today
                </h3>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
              </div>
            </div>

            {/* Upcoming and Pending Appointments - Single Row on Mobile */}
            <div className="grid grid-cols-2 gap-4 w-full sm:col-span-2">
              {/* Upcoming Appointments */}
              <div className="bg-purple-100 p-4 rounded-lg shadow-md flex flex-col items-center">
                <FaClock className="text-purple-600 text-3xl mb-1" />
                <h3 className="text-base font-medium text-purple-700">
                  Upcoming
                </h3>
                <p className="text-2xl font-bold">
                  {upcomingAppointments?.length}
                </p>
              </div>

              {/* Pending Appointments */}
              <div className="bg-red-100 p-4 rounded-lg shadow-md flex flex-col items-center">
                <FaExclamationTriangle className="text-red-600 text-3xl mb-1" />
                <h3 className="text-base font-medium text-red-700">Pending</h3>
                <p className="text-2xl font-bold">{pendingAppointmentsCount}</p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-6 flex justify-between items-center">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
              Reports
            </button>
            <button className="bg-lime-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-lime-600 transition">
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-8 flex flex-col lg:flex-row gap-8">
          {/* Left Section - Progress Bars */}
          <div className="w-full lg:w-1/2">
            {/* Section Title */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-blue-600" /> Show Our Live Status
            </h2>

            {/* Progress Bars */}
            <div className="mb-6">
              <div className="mb-4">
                <p className="text-[#4CAF50] flex justify-between font-semibold mb-2">
                  Total Appointments
                  <span className="font-bold text-gray-900">
                    {totalAppitements}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#4CAF50] h-3 rounded-full"
                    style={{ width: `${totalAppitements}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#3B82F6] flex justify-between font-semibold mb-2">
                  Total Completed Appointments
                  <span className="font-bold text-gray-900">
                    {totalCompletedAppitements}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#3B82F6] h-3 rounded-full"
                    style={{ width: `${totalCompletedAppitements / 5}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#1E3A8A] flex justify-between font-semibold mb-2">
                  Today's Appointments
                  <span className="font-bold text-gray-900">
                    {todaysTotalAppitements}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#1E3A8A] h-3 rounded-full"
                    style={{ width: `${todaysTotalAppitements}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#F59E0B] flex justify-between font-semibold mb-2">
                  Upcoming Appointments
                  <span className="font-bold text-gray-900">
                    {upcomingTotalAppitements}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#F59E0B] h-3 rounded-full"
                    style={{ width: `${upcomingTotalAppitements}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#eb3d34] flex justify-between font-semibold mb-2">
                  Pending Appointments
                  <span className="font-bold text-gray-900">
                    {totalPendingAppointmentsCount}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#eb3d34] h-3 rounded-full"
                    style={{ width: `${totalPendingAppointmentsCount}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Pie Chart */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <div className="w-full max-w-xs">
              <Doughnut data={pieData} />
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 my-5">
          {/* Today's Appointments */}
          <div className="border border-gray-300 p-6 rounded-lg shadow-sm bg-white h-96 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Today's Appointments
            </h2>
            <div className="overflow-y-auto flex-grow">
              <LoadingErrorComponent
                loading={appointmentsLoading}
                error={appointmentsError}
              >
                {todayAppointments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No appointments scheduled for today
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {todayAppointments.map((appointment) => (
                      <li
                        key={appointment._id}
                        className="py-4 px-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          {/* Patient Name */}
                          <div className="mb-2 md:mb-0 md:flex-1">
                            <Link
                              to={`/dashboard/patient/${appointment.userId}`}
                              className="text-lg font-medium text-blue-600 hover:text-blue-800"
                            >
                              {appointment.name}
                            </Link>
                          </div>

                          {/* Appointment Details */}
                          <div className="flex flex-col md:items-end">
                            <span className="text-sm text-gray-600">
                              {formatDate(appointment.date)} •{" "}
                              {appointment.timeBlock}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                              {appointment.reason}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </LoadingErrorComponent>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="border border-gray-300 p-6 rounded-lg shadow-sm bg-white h-96 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Upcoming Appointments
            </h2>
            <div className="overflow-y-auto flex-grow">
              <LoadingErrorComponent
                loading={appointmentsLoading}
                error={appointmentsError}
              >
                {upcomingAppointments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No upcoming appointments scheduled
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {upcomingAppointments.map((appointment) => (
                      <li
                        key={appointment._id}
                        className="py-4 px-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          {/* Patient Name */}
                          <div className="mb-2 md:mb-0 md:flex-1">
                            <Link
                              to={`/dashboard/patient/${appointment.userId}`}
                              className="text-lg font-medium text-blue-600 hover:text-blue-800"
                            >
                              {appointment.name}
                            </Link>
                          </div>

                          {/* Appointment Date & Time */}
                          <div className="flex flex-col md:items-end">
                            <span className="text-sm text-gray-600">
                              {formatDate(appointment.date)}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                              {formatTime(appointment.timeBlock)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </LoadingErrorComponent>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="rounded-xl shadow-lg h-96 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-600 to-lime-700">
              <CalendarWidget sendDataToParent={handleDataFromChild} />
            </div>
          </div>

          {/* Doctor appointment list data for selected date */}
          <div className="border border-gray-300 p-6 rounded-lg shadow-sm bg-white h-96 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Appointments for{" "}
              {childDate ? formatDate(childDate) : "Selected Date"}
            </h2>
            <div className="overflow-y-auto flex-grow">
              <LoadingErrorComponent
                loading={appointmentsLoading}
                error={appointmentsError}
              >
                {selectedDateAppointements.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No appointments found for this date
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {selectedDateAppointements.map((appointment) => (
                      <li
                        key={appointment._id}
                        className="py-4 px-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          {/* Patient Name */}
                          <div className="mb-2 md:mb-0 md:flex-1">
                            <Link
                              to={`/dashboard/patient/${appointment.userId}`}
                              className="text-lg font-medium text-blue-600 hover:text-blue-800"
                            >
                              {appointment.name}
                            </Link>
                          </div>

                          {/* Appointment Details */}
                          <div className="flex flex-col md:items-end">
                            <span className="text-sm text-gray-600">
                              {formatDate(appointment.date)} •{" "}
                              {appointment.timeBlock}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                              {appointment.reason}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </LoadingErrorComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
