import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwt-decode
import Cookies from "js-cookie"; // Import the js-cookie library
import Loading from "../components/Loading";
import { toast } from "react-toastify";

import {
  fetchAllPateintData,
  fetchMedicalProfileDetails,
  fetchOpdData,
  fetchUpcomingAppointments,
  fetchUserAllDetails,
} from "../services/api";

export const AuthContext = createContext();
// console.log(fetchAllPateintData);


export const AuthProvider = ({ children }) => {
  // *********** Login User ***********
  const [loginUser, setLoginUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(true); // To show loading until we verify the token

  // *********** Upcomming appointma data state **************
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  // *********** All pateint data state ***************
  const [allPatients, setAllPatients] = useState([]);
  const [allPatientsLoading, setAllPatientsLoading] = useState(false);
  const [allPatientsError, setAllPatientsError] = useState(null);

  // *********** OPD data state ***********
  const [opdData, setOpdData] = useState([]);
  const [opdLoading, setOpdLoading] = useState(false);
  const [opdError, setOpdError] = useState(null);

  // *********** User(Pateint) Details State
  const [userDetails, setUserDetails] = useState([]); // To store user details from the
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);

  // *********** Medical Profile details state
  const [medicalProfileDetails, setMedicalProfileDetails] = useState([]);
  const [medicalProfileDetailsLoading, setMedicalProfileDetailsLoading] =
    useState(false);
  const [medicalProfileDetailsError, setMedicalProfileDetailsError] =
    useState(null);

  // Check for token and user data in cookies when the component mounts
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
          logout(); // Token is expired, log out the user
        } else {
          setLoginUser(decodedToken); // Set user info from the decoded token
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout(); // Logout in case of invalid token
      }
    }
    setLoginLoading(false); // Set loading to false after the check is complete
  }, []);

  // ***************** Login *****************
  const login = (token) => {
    Cookies.set("token", token, { expires: 7 }); // Set the token in cookies with an expiration of 7 days

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      setLoginUser(decodedToken);
      console.log(decodedToken);
    } catch (error) {
      console.error("Invalid token provided during login", error);
    }
  };

  // ***************** Logout *****************
  const logout = () => {
    Cookies.remove("token"); // Remove the token from cookies
    setLoginUser(null);
  };
  // ***************** Function to fetch appointments data **********************
  const getUpcomingAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null); // Reset error state
    try {
      const data = await fetchUpcomingAppointments(); // Call the API function
      setAppointments(data);
    } catch (errorMessage) {
      setAppointmentsError(errorMessage); // Update error state
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } finally {
      setAppointmentsLoading(false); // Reset loading state
    }
  };

  // ***************** function to fetch all pateint data *****************
  const getAllPateintData = async () => {
    setAllPatientsLoading(true);
    setAllPatientsError(null);
    try {
      const data = await fetchAllPateintData(); // Call the API function
      setAllPatients(data);
    } catch (errorMessage) {
      setAllPatientsError(errorMessage); // Update error state
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } finally {
      setAllPatientsLoading(false); // Reset loading state
    }
  };

  // ***************** function to fetch OPD Data *****************
  const getOPDData = async () => {
    setOpdLoading(true);
    setOpdError(null);
    try {
      const data = await fetchOpdData(); // Call the API function
      setOpdData(data);
    } catch (errorMessage) {
      setOpdError(errorMessage); // Update error state
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } finally {
      setOpdLoading(false); // Reset loading state
    }
  };
  // ***************** function to fetch user(Pateint) details
  const getUserDetails = async (loginUserID) => {
    setUserDetailsLoading(true);
    setUserDetailsError(null);
    try {
      const data = await fetchUserAllDetails(loginUserID); // Call the API function
      setUserDetails(data);
    } catch (errorMessage) {
      setUserDetailsError(errorMessage); // Update error state
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } finally {
      setUserDetailsLoading(false); // Reset loading state
    }
  };
  // ***************** function to fetch medical profile details *****************
  const getMedicalProfileDetails = async (loginUserID) => {
    setMedicalProfileDetailsLoading(true);
    setMedicalProfileDetailsError(null);
    try {
      const data = await fetchMedicalProfileDetails(loginUserID); // Call the API function
      setMedicalProfileDetails(data);
    } catch (errorMessage) {
      setMedicalProfileDetailsError(errorMessage); // Update error state
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } finally {
      setMedicalProfileDetailsLoading(false); // Reset loading state
    }
  };

  if (loginLoading) {
    return <Loading />; // Render a loading state until token is checked
  }

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        login,
        logout,

        getUpcomingAppointments,
        appointments,
        appointmentsLoading,
        appointmentsError,
        setAppointments,
        setAppointmentsError,
        setAppointmentsLoading,

        getAllPateintData,
        allPatients,
        allPatientsLoading,
        allPatientsError,
        setAllPatients,
        setAllPatientsError,

        getOPDData,
        opdData,
        opdLoading,
        opdError,
        setOpdData,
        setOpdLoading,

        getUserDetails,
        userDetails,
        userDetailsLoading,
        userDetailsError,
        setUserDetailsLoading,
        setUserDetailsError,

        getMedicalProfileDetails,
        medicalProfileDetails,
        medicalProfileDetailsLoading,
        medicalProfileDetailsError,
        setMedicalProfileDetailsError,
        setMedicalProfileDetailsLoading,
        setMedicalProfileDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
