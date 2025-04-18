import React, { useState } from "react";
import { motion } from "framer-motion";
import MedicalProfile from "./MedicalProfile";
import PersonalProfile from "./PersonalProfile";

const Profile = () => {
  // State to track which tab is selected (0: Personal, 1: Medical)
  const [activeTab, setActiveTab] = useState(0);

  // Function to switch tabs
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 my-6">
        <button
          className={`py-3 px-6 text-lg font-semibold ${activeTab === 0 ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition-colors duration-300`}
          onClick={() => handleTabClick(0)}
        >
          Personal Details
        </button>
        <button
          className={`py-3 px-6 text-lg font-semibold ${activeTab === 1 ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-600 hover:text-blue-600"} transition-colors duration-300`}
          onClick={() => handleTabClick(1)}
        >
          Medical Details
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 0 && <PersonalProfile />}
        {activeTab === 1 && <MedicalProfile />}
      </div>
    </motion.div>
  );
};

export default Profile;
