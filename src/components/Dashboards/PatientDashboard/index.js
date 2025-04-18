// src/PatientDashboard.jsx

import React, { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaCreditCard, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Carousel from "./components/Carousel";
import Loading from "../../Loading";
import { FiCalendar, FiInfo, FiCheckCircle, FiClock } from "react-icons/fi";

const PatientDashboard = () => {
  const {
    loginUser,
    getUserDetails,
    userDetails,
    userDetailsLoading,
    userDetailsError,
  } = useContext(AuthContext);

  // Fetch existing medical details on component mount
  useEffect(() => {
    if (userDetails.length === 0) getUserDetails(loginUser.id);
  }, [userDetails]);

  if (userDetailsLoading) {
    return <Loading />;
  }

  if (userDetailsError) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">{userDetailsError}</div>
    );
  }

  // Extract data from formData
  const appointmentsData = userDetails?.appointmentDetails || [];
  const opdFormsData = userDetails?.opdForms || [];
  const profileData = userDetails?.userDetails || {};

  // Build billing data
  const billingData = [];
  opdFormsData.forEach((opdForm) => {
    const patientReport = opdForm.patientReport;
    const visits = patientReport?.financials?.visits || [];
    visits.forEach((visit) => {
      billingData.push({
        id: visit._id,
        opd: patientReport.opdNumber,
        date: visit.date,
        amount: visit.amount,
        status: visit.treatmentDone ? "Paid" : "Pending",
      });
    });
  });

  const totalPendingPayments = billingData
    .filter((invoice) => invoice.status === "Pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const upcomingAppointments = appointmentsData.filter(
    (appointment) => new Date(appointment.date) >= today
  );

  // Filter for today's appointments
  const todayAppointments = appointmentsData.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getFullYear() === todayMidnight.getFullYear() &&
      appointmentDate.getMonth() === todayMidnight.getMonth() &&
      appointmentDate.getDate() === todayMidnight.getDate()
    );
  });

  // Extract visits data
  const visitsData = [];
  opdFormsData.forEach((opdForm) => {
    const patientReport = opdForm.patientReport;
    const visits = patientReport?.financials?.visits || [];
    visits.forEach((visit) => {
      visitsData.push({
        id: visit._id,
        checkupFor: opdForm.checkupInfo,
        opdNumber: opdForm.opdNumber,
        date: visit.date,
        visitFor: visit.visitFor,
        treatmentDone: visit.treatmentDone,
        notes: visit.notes,
      });
    });
  });

  const upcomingVisits = visitsData.filter((visit) => {
    const visitDate = new Date(visit.date);
    return (
      visitDate.getFullYear() >= todayMidnight.getFullYear() &&
      visitDate.getMonth() >= todayMidnight.getMonth() &&
      visitDate.getDate() > todayMidnight.getDate()
    );
  });

  // Filter for today's visits
  const todayVisits = visitsData.filter((visit) => {
    const visitDate = new Date(visit.date);
    return (
      visitDate.getFullYear() === todayMidnight.getFullYear() &&
      visitDate.getMonth() === todayMidnight.getMonth() &&
      visitDate.getDate() === todayMidnight.getDate()
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen md:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold">
          Welcome, {profileData.name || "User"}{" "}
          {/* <span className="font-medium md:text-xl ">
            to Ivory Smiles Dental Clinic, Nagpur
          </span> */}
        </h1>
        {/* <img
          src={profilePicture}
          alt="Profile"
          className="w-16 h-16 rounded-full"
        /> */}
      </header>

      {/* Main Content */}
      <div>
        {/* Carousel */}
        <Carousel />

        {/* Dashboard Overview */}
        <div className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Upcoming Visits */}
            <div className="bg-white shadow rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300">
              <FaCalendarAlt className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-lg font-semibold text-green-500">
                  {upcomingVisits.length} / {visitsData.length}
                </p>
                <p className="text-gray-600">Upcoming Visits</p>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white shadow rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300">
              <FaCalendarAlt className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-lg font-semibold">
                  {upcomingAppointments.length} / {appointmentsData.length}
                </p>
                <p className="text-gray-600">Upcoming Appointments</p>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="bg-white shadow rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300">
              <FaCreditCard className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-lg font-semibold">
                  ₹ {totalPendingPayments}
                </p>
                <p className="text-gray-600">Pending Payments</p>
              </div>
            </div>

            {/* Edit Profile Prompt */}
            <Link to="/dashboard/profile">
              <div className="bg-white shadow rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300">
                <FaEdit className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-lg font-semibold">Edit Profile</p>
                  <p className="text-gray-600">
                    Update your <br /> information
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Visits */}
          <div className="lg:my-12">
            <h2 className="text-2xl font-semibold mb-6">Today's Visits</h2>
            <div className="bg-white shadow rounded-lg p-3 h-60 overflow-y-auto divide-y">
              {todayVisits.length > 0 ? (
                todayVisits.map((visit) => (
                  <div key={visit.id} className="flex items-start ">
                    <div className="ml-4">
                      <p className="font-medium mb-2">
                        ⭐ The visit on{" "}
                        <span className="text-green-700 font-semibold">
                          {formatDate(visit.date)}
                        </span>{" "}
                        is scheduled for{" "}
                        <span className="text-green-700 font-semibold">
                          {visit.visitFor}
                        </span>{" "}
                        of the{" "}
                        <span className="text-green-700 font-semibold">
                          {visit.checkupFor}
                        </span>{" "}
                        treatment. OPD Number:{" "}
                        <span className="text-green-700 font-semibold">
                          {visit.opdNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No Today's visits.</p>
              )}
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="lg:my-12">
            <h2 className="text-2xl font-semibold mb-6">
              Today's Appointments
            </h2>
            <div className="bg-white shadow rounded-lg p-3 h-60 overflow-y-auto divide-y">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-start">
                    <div className="ml-4">
                      <div className="p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                          <FiCalendar className="text-blue-500 text-xl" />
                          <h3 className="text-gray-800 font-semibold">
                            Appointment Details
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {/* Date */}
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">Date:</span>{" "}
                              <span className="font-semibold text-gray-800">
                                {formatDate(appointment.date)}
                              </span>
                            </span>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">Time:</span>{" "}
                              <span className="font-semibold text-gray-800">
                                {appointment.timeBlock}
                              </span>
                            </span>
                          </div>

                          {/* Reason */}
                          <div className="flex items-center gap-2">
                            <FiInfo className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">Reason:</span>{" "}
                              <span className="font-semibold text-gray-800">
                                {appointment.reason}
                              </span>
                            </span>
                          </div>

                          {/* Status */}
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">Status:</span>{" "}
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  appointment.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No appointments for today.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-10 md:mt-0">
          {/* Upcoming Visits */}
          <div className="lg:my-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Visits</h2>
            <div className="bg-white shadow rounded-lg p-3 h-60 overflow-y-auto divide-y">
              {upcomingVisits.length > 0 ? (
                upcomingVisits.map((visit) => (
                  <div key={visit.id} className="flex items-start">
                    <div className="ml-4">
                      <p className="font-medium mb-2">
                        ⭐ The visit on{" "}
                        <span className="text-green-700 font-semibold">
                          {formatDate(visit.date)}
                        </span>{" "}
                        is scheduled for{" "}
                        <span className="text-green-700 font-semibold">
                          {visit.visitFor}
                        </span>{" "}
                        of the{" "}
                        <span className="text-green-700 font-semibold">
                          {visit.checkupFor}
                        </span>{" "}
                        treatment. OPD Number:{" "}
                        <span className="text-green-700 font-semibold">
                          {visit.opdNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No upcoming visits.</p>
              )}
            </div>
          </div>
          {/* Upcoming Appointments */}
          <div className="lg:my-12">
            <h2 className="text-2xl font-semibold mb-6">
              Upcoming Appointments
            </h2>
            <div className="bg-white shadow rounded-lg p-3 h-60 overflow-y-auto divide-y">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-start">
                    <div className="ml-4">
                      <div className="p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                          <FiCalendar className="text-blue-500 text-xl" />
                          <h3 className="text-gray-800 font-semibold">
                            Appointment Details
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {/* Date  */}
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">
                                Date:
                              </span>{" "}
                              <span className="font-semibold text-gray-800">
                                {formatDate(appointment.date)} 
                                
                              </span>
                            </span>
                          </div>

                          {/* Time  */}
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">
                                Time:
                              </span>{" "}
                              <span className="font-semibold text-gray-800">
                              {appointment.timeBlock}
                              </span>
                            </span>
                          </div>

                          {/* Reason */}
                          <div className="flex items-center gap-2">
                            <FiInfo className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">Reason:</span>{" "}
                              <span className="font-semibold text-gray-800">
                                {appointment.reason}
                              </span>
                            </span>
                          </div>

                          {/* Status */}
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-gray-500 shrink-0" />
                            <span className="text-sm">
                              <span className="text-gray-600">Status:</span>{" "}
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  appointment.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No upcoming appointments.</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Billing Information</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    OPD No.
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingData.length > 0 ? (
                  billingData
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((invoice) => (
                      <tr key={invoice.id} className="border-t">
                        <td className="py-4 px-6">{invoice.opd}</td>
                        <td className="py-4 px-6">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="py-4 px-6">₹ {invoice.amount}</td>
                        <td
                          className={`py-4 px-6 ${
                            invoice.status === "Paid"
                              ? "text-green-500"
                              : invoice.status === "Pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {invoice.status}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td className="py-4 px-6" colSpan="4">
                      No billing information available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
