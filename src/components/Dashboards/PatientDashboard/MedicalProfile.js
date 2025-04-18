import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import BloodGroupSelect from "../Comman/MedicalForm/BloodGroupSelect";
import MedicalHistory from "../Comman/MedicalForm/MedicalHistory";
import PastDentalHistoryTextarea from "../Comman/MedicalForm/PastDentalHistoryTextarea";
import MedicationsSection from "../Comman/MedicalForm/MedicationsSection";
import AllergiesSection from "../Comman/MedicalForm/AllergiesSection";
import LifestyleHabitsSection from "../Comman/MedicalForm/LifestyleHabitsSection";
import NotesTextarea from "../Comman/MedicalForm/NotesTextarea";
import SubmitButton from "../Comman/MedicalForm/SubmitButton";
import FeedbackMessage from "../Comman/MedicalForm/FeedbackMessage";
import { ClipLoader } from "react-spinners"; // Optional: Install react-spinners or use your preferred loader
import Loading from "../../Loading";
import API from "../../../services/interceptor";

const MedicalProfile = () => {
  const { loginUser, userDetails, userDetailsLoading } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    medicalHistory: "",
    medications: [
      { name: "", dosage: "", frequency: "", startDate: "", endDate: "" },
    ],
    allergies: [{ allergen: "", reaction: "", severity: "" }],
    lifestyleAndHabits: { smokingStatus: "", alcoholUse: "", tobacco: "" },
    pastDentalHistory: "",
    notes: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing medical details on component mount
  useEffect(() => {
    const fetchMedicalDetails = async () => {
      try {
        setFormData(userDetails?.medicalDetails);
      } catch (err) {
        setError("Failed to fetch medical details. Please try again later.");
      } finally {
      }
    };
    fetchMedicalDetails();
  }, [loginUser.id]);

  // General handler for top-level form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setIsModified(true);
  };

  // Handler for nested array changes (medications, allergies)
  const handleNestedChange = (section, index, field, value) => {
    setFormData((prevData) => {
      const updatedSection = prevData[section].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      return { ...prevData, [section]: updatedSection };
    });
    setIsModified(true);
  };

  // Handler for nested object changes (lifestyleAndHabits)
  const handleNestedPropertyChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value },
    }));
    setIsModified(true);
  };

  // Add new entry to a section
  const addEntry = (section, defaultEntry) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: [...prevData[section], defaultEntry],
    }));
    setIsModified(true);
  };

  // Remove entry from a section
  const removeEntry = (section, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: prevData[section].filter((_, idx) => idx !== index),
    }));
    setIsModified(true);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.put(`/api/users/medical-details/${loginUser.id}`, formData);
      setSuccess("Medical details updated successfully.");
      setError("");
      setIsModified(false);
    } catch (err) {
      setError("Failed to update medical details. Please try again.");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Warn user when they try to leave the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isModified) {
        const message =
          "You have unsaved changes, do you really want to leave?";
        event.returnValue = message; // Standard for most browsers
        return message; // For some browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when component is unmounted or isModified changes
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isModified]);

  if (userDetailsLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow-md mx-auto mt-8 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Medical Details
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Blood Group */}
        <BloodGroupSelect value={formData.bloodGroup} onChange={handleChange} />

        {/* Medical History */}
        <MedicalHistory
          value={formData.medicalHistory}
          onChange={handleChange}
        />

        {/* Past Dental History */}
        <PastDentalHistoryTextarea
          value={formData.pastDentalHistory}
          onChange={handleChange}
        />

        {/* Medications Section */}
        <MedicationsSection
          medications={formData.medications}
          onChange={handleNestedChange}
          onAdd={() =>
            addEntry("medications", {
              name: "",
              dosage: "",
              frequency: "",
              startDate: "",
              endDate: "",
            })
          }
          onRemove={removeEntry}
        />

        {/* Allergies Section */}
        <AllergiesSection
          allergies={formData.allergies}
          onChange={handleNestedChange}
          onAdd={() =>
            addEntry("allergies", {
              allergen: "",
              reaction: "",
              severity: "",
            })
          }
          onRemove={removeEntry}
        />

        {/* Lifestyle and Habits */}
        <LifestyleHabitsSection
          data={formData.lifestyleAndHabits}
          onChange={handleNestedPropertyChange}
        />

        {/* Notes */}
        <NotesTextarea value={formData.notes} onChange={handleChange} />

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton isDisabled={!isModified || isSubmitting} />
          {isSubmitting && (
            <span className="ml-4 text-blue-500">
              {/* You can replace this with a spinner */}
              <ClipLoader size={20} color="#4A90E2" />
              {/* Or a simple text indicator:
              Loading... */}
            </span>
          )}
        </div>

        {/* Feedback Messages */}
        <FeedbackMessage error={error} success={success} />
      </form>
    </motion.div>
  );
};

export default MedicalProfile;
