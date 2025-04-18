import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import AppointmentTable from "./AppointmentTable";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import { toast } from "react-toastify";
import { ToastBar, Toaster } from "react-hot-toast";

const MyAppointment = () => {
  const {
    loginUser,
    getUserDetails,
    userDetails,
    userDetailsLoading,
    userDetailsError,
    setUserDetailsLoading,
    setUserDetailsError,
  } = useContext(AuthContext);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeBlock, setTimeBlock] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const timeBlocks = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  const reasonOptions = [
    "Routine Check-Up",
    "Cleaning",
    "Fillings",
    "Extraction",
    "Orthodontics",
    "Other",
  ];

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 14);

  const resetForm = () => {
    setAppointmentDate("");
    setTimeBlock("");
    setReason("");
    setOtherReason("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserDetailsError("");
    setUserDetailsLoading(true);

    // Create loading toast
    const toastId = toast.loading("Submitting Your Appointment.....", {
      position: "top-center",
    });

    try {
      await API.post(`${process.env.REACT_APP_API_URL}/api/users/appointment`, {
        userId: loginUser.id,
        date: appointmentDate,
        timeBlock,
        reason: reason === "Other" ? otherReason : reason,
      });

      // Dismiss the loading toast completely
      toast.dismiss(toastId);

      // Create a new success toast
      toast.success("Your Appointment booked Successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      resetForm();
      getUserDetails(loginUser.id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed To submit Your Appointment";

      // Dismiss the loading toast completely
      toast.dismiss(toastId);

      // Create a new error toast
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });

      setUserDetailsError(errorMessage);
    } finally {
      setUserDetailsLoading(false);
    }
  };
  // Fetch existing medical details on component mount
  useEffect(() => {
    if (userDetails.length == 0) getUserDetails(loginUser.id);
  }, [userDetails]);

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Appointment Details
        </h2>

        {userDetailsLoading ? (
          <Loading />
        ) : userDetailsError ? (
          <div className="text-red-600 mb-4">{userDetailsError}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Preferred Appointment Date:
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={today.toISOString().split("T")[0]}
                  max={maxDate.toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Preferred Time Block:
                </label>
                <select
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
            </section>
            <div>
              <label className="block text-gray-600 mb-1">
                Reason for Visit:
              </label>
              <select
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
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md mx-auto mt-8">
        {userDetails.appointmentDetails &&
        userDetails.appointmentDetails.length > 0 ? (
          <AppointmentTable userDetails={userDetails.appointmentDetails} />
        ) : (
          <div>No appointment details available.</div>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default MyAppointment;
