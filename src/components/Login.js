import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for Signup navigation
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/interceptor";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for handling loader
  const { loginUser, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (loginUser) {
      navigate("/dashboard");
    }
  }, [loginUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await API.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        { email, password }
      );
      login(response?.data?.token);
      navigate("/dashboard/"); // Redirect to dashboard after successful login
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error("Login failed", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        exit: {
          duration: 1,
          ease: "easeInOut",
        },
      }}
      className="h-screen flex items-center justify-center"
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            required
          />
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 mb-2 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading} // Disable button while loading
          >
            {/* {loading ? 'Logging in...' : 'Login'} */}
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
              "Login"
            )}
          </button>
          <div className="text-center mt-4">
            <span>Don't have an account? </span>
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default Login;
