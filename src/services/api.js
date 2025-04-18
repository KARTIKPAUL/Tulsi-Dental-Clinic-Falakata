import API from "./interceptor";

// ******************* Fetch upcoming appointments ******************
export const fetchUpcomingAppointments = async () => {
  try {
    const response = await API.get(`/api/receptionist/appointment/`);
    return response.data;
  } catch (error) {
    throw (
      error?.response?.data?.message || "Failed to fetch upcoming appointments"
    );
  }
};

// ******************* Fecth allPataint Data *******************
export const fetchAllPateintData = async () => {
  try {
    const response = await API.get(`/api/doctor/get-all-users`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to fetch allPatient data";
  }
};

// *******************  Fetch OPD data *******************
export const fetchOpdData = async () => {
  try {
    const response = await API.get("/api/doctor/opd");
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to fetch OPD data";
  }
};

// ******************* Fetch user(pateint) all details *******************
export const fetchUserAllDetails = async (loginUserID) => {
  try {
    const response = await API.get(
      `/api/users/user-all-details/${loginUserID}`
    );
    return response.data;
  } catch (error) {
    throw (
      error?.response?.data?.message || "Failed to fetch details. Try again"
    );
  }
};

// ******************* Fetch Medical Profile details *******************
export const fetchMedicalProfileDetails = async (loginUserID) => {
  try {
    const response = await API.get(`/api/users/medical-details/${loginUserID}`);
    return response.data;
  } catch (error) {
    throw (
      error?.response?.data?.message ||
      "Failed to fetch medical profile details. Try again"
    );
  }
};
