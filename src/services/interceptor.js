import axios from "axios";
import { getCookie } from "./getCookie";
import Cookies from "js-cookie"; // To manage cookies

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = getCookie("token"); // Get token from cookies
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    console.log("error.response: ", error.response);
    if (error.response && error.response.status === 401) {
      // Clear the token from cookies
      Cookies.remove("token");

      // Trigger logout via AuthContext
      const { logout } = useContext(AuthContext);
      if (logout) logout();
    }
    return Promise.reject(error);
  }
);

export default API;
