// ResetPassword.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import OTPInput from "react-otp-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import API from "../services/interceptor";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: Handle requesting OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`${process.env.REACT_APP_API_URL}/api/forgot-password`, {
        email,
      });
      setOtpSent(true);
      toast.success("OTP has been sent to your email", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle verifying OTP and resetting password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    setLoading(true);
    try {
      await API.post(`${process.env.REACT_APP_API_URL}/api/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setIsVerified(true);
      toast.success("Password has been reset successfully", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      // Optionally redirect to login page
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "OTP verification failed", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (otpValue) => {
    setOtp(otpValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {!otpSent ? (
          // Step 1: Request OTP
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Reset Password
            </h2>
            <form onSubmit={handleRequestOtp}>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </>
        ) : !isVerified ? (
          // Step 2: Verify OTP and reset password
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              An OTP has been sent to <strong>{email}</strong>
            </p>
            <form onSubmit={handleResetPassword}>
              <OTPInput
                value={otp}
                onChange={handleOTPChange}
                numInputs={6}
                renderInput={(props) => (
                  <input
                    {...props}
                    placeholder="-"
                    style={{
                      boxShadow: "inset 0px -1px 0px rgba(0, 0, 0, 0.18)",
                    }}
                    className="w-12 h-12 border border-gray-300 bg-gray-50 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
                containerStyle={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 mt-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          // Success message after password reset
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Success
            </h2>
            <p className="text-center text-gray-600">
              Your password has been reset successfully.
            </p>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default ForgotPassword;
