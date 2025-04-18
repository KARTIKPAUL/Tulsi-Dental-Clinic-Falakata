import React, { useState, useContext, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import useUserDetails from "../../../hooks/useUserDetails";
import PersonalDetails from "../Comman/PersonalForm/PersonalDetails";
import ContactInformation from "../Comman/PersonalForm/ContactInformation";
import EmergencyContact from "../Comman/PersonalForm/EmergencyContact";
import Loading from "../../Loading";

const PersonalProfile = () => {
  const { 
    loginUser, 
    getUserDetails,
    userDetails,
    userDetailsLoading,
    userDetailsError,
    setUserDetailsError, 
  } = useContext(AuthContext);
  


  const {
    data: originalData,
    loading,
    error,
    updateData,
  } = useUserDetails(loginUser.id);


  const [formData, setFormData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update formData when originalData changes (e.g., after fetching)
  useEffect(() => {
    if (originalData) {
      setFormData(originalData); // Set formData only when originalData is available
    }
  }, [originalData]); // This effect will run when originalData changes

  // Detect changes between formData and originalData
  useEffect(() => {
    if (originalData) {
      setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
    }
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

  // Submit only if there are changes
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
    [formData, hasChanges, updateData]
  );

  if (loading) return <Loading />;
  if (error) return <p>Error loading user details.</p>;

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
