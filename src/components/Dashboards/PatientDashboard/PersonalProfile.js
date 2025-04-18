import React, { useState, useContext, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import PersonalDetails from "../Comman/PersonalForm/PersonalDetails";
import ContactInformation from "../Comman/PersonalForm/ContactInformation";
import EmergencyContact from "../Comman/PersonalForm/EmergencyContact";
import Loading from "../../Loading";
import API from "../../../services/interceptor";

const PersonalProfile = () => {
  const {
    loginUser,
    getUserDetails,
    userDetails,
    userDetailsLoading,
    userDetailsError,
  } = useContext(AuthContext);

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(
    userDetails?.userDetails || {}
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Update formData when originalData changes (e.g., after fetching)
  useEffect(() => {
    if (userDetails?.userDetails) {
      setOriginalData(userDetails.userDetails);
      setFormData(userDetails.userDetails);
    }
    if (userDetails.length == 0) getUserDetails(loginUser.id);
  }, [userDetails]);

  // Detect changes between formData and originalData
  useEffect(() => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(isChanged);
  }, [formData, originalData]);

  // Handle form input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prevData) => {
      let updatedData = { ...prevData };
      let current = updatedData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      });
      return updatedData;
    });
  }, []);

  // API call to update user details
  const updateData = async (updatedData) => {
    try {
      const response = await API.put(
        `/api/users/details/${loginUser.id}`,
        updatedData
      );
      setOriginalData(updatedData); // Update original data to reflect changes
      getUserDetails(loginUser.id);
      return response.data;
    } catch (err) {
      throw new Error("Failed to update user details.");
    }
  };

  // Submit the form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!hasChanges) {
        alert("No changes detected.");
        return;
      }

      try {
        await updateData(formData);
        alert("User details updated successfully.");
      } catch (err) {
        console.error("Error updating user details:", err);
        alert("Failed to update user details.");
      }
    },
    [formData, hasChanges] // Dependencies
  );

  if (userDetailsLoading) return <Loading />;
  if (userDetailsError) return <p>Error loading user details.</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="p-6 bg-white rounded-lg shadow-md mx-auto mt-8 "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Personal Details
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <PersonalDetails formData={formData} onChange={handleChange} />
        <ContactInformation formData={formData} onChange={handleChange} />
        <EmergencyContact formData={formData} onChange={handleChange} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!hasChanges}
            className={`px-6 py-2 rounded-lg text-white ${
              hasChanges
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            } transition-colors duration-200`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalProfile;
