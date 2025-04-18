// MedicalOPDDetails.js
import React, { useState, useEffect, useContext } from "react";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import { AuthContext } from "../../../context/AuthContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const MedicalOPDDetails = () => {
  const {
    loginUser,
    getUserDetails,
    userDetails,
    userDetailsLoading,
    userDetailsError,
  } = useContext(AuthContext);

  const [expandedTiles, setExpandedTiles] = useState({});

  // Move useEffect to the top level, before any returns
  useEffect(() => {
    if (!userDetails) getUserDetails(loginUser.id);
  }, [userDetails]);

  const toggleTile = (id) => {
    setExpandedTiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Animation variants for the tile expansion
  const variants = {
    collapsed: { height: 0, opacity: 0, overflow: "hidden" },
    expanded: { height: "auto", opacity: 1 },
  };

  // Animation variants for the tile container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  // Fetch existing medical details on component mount
  useEffect(() => {
    if (userDetails.length==0)
       getUserDetails(loginUser.id);
  }, [userDetails]);

  // useEffect(() => {
  //   const fetchOpdData = async () => {
  //     try {
  //       const response = await API.get(`/api/users/user-all-details/${user.id}`);
  //       setOpdData(response.data);
  //       console.log(opdData?.opdForms)
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching OPD data:', err);
  //       setError(true);
  //       setLoading(false);
  //     }
  //   };

  //   fetchOpdData();
  // }, [user.id]);

  if (userDetailsLoading) {
    return <Loading />;
  }

  if (userDetailsError || !userDetails) {
    return (
      <div className="container mx-auto p-4">
        <h6 className="text-red-500 text-center mt-20">
          Error fetching OPD data.
        </h6>
      </div>
    );
  }
  if (!userDetails?.opdForms || userDetails?.opdForms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="p-6 bg-white rounded-lg shadow-md mx-auto mt-8 "
      >
        <div className="">
          <h2 className="text-2xl font-semibold mb-6">Medical Details</h2>
        </div>
        <div className="space-y-6">
          <p className="text-gray-600">No medical details available.</p>
        </div>
      </motion.div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="p-6 bg-white rounded-lg shadow-md mx-auto mt-8 "
    >
      <h2 className="text-2xl font-semibold mb-6">Medical Details</h2>
      <div className="space-y-6">
        {userDetails?.opdForms.map((opdForm, index) => {
          const { opdNumber, checkupInfo, patientReport } = opdForm;
          const {
            examinationFindings,
            diagnosis,
            treatmentPlan,
            financials,
            documents,
          } = patientReport || {};

          return (
            <motion.div
              key={opdForm._id}
              className={`border border-gray-200 rounded-lg shadow-sm ${expandedTiles[opdForm._id] ? "bg-slate-50" : "bg-white"
                }`}
              initial="hidden"
              animate="visible"
              custom={index}
              variants={containerVariants}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleTile(opdForm._id)}
              >
                <div>
                  <p className="text-xl font-semibold text-gray-800">
                    OPD Number:{" "}
                    <span className="text-blue-600">{opdNumber}</span>
                  </p>
                  <p className="text-md text-gray-600">
                    <span className="font-medium">Checkup For:</span>{" "}
                    {checkupInfo}
                  </p>
                  {/* Additional summary information can be added here */}
                </div>
                <div>
                  {expandedTiles[opdForm._id] ? (
                    <FaChevronUp className="h-6 w-6 text-gray-600" />
                  ) : (
                    <FaChevronDown className="h-6 w-6 text-gray-600" />
                  )}
                </div>
              </div>

              {/* Expanded Content with Animation */}
              <AnimatePresence>
                {expandedTiles[opdForm._id] && (
                  <motion.div
                    className="px-4 pb-4"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={variants}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="mt-4 border-t pt-4">
                      {/* Examination Findings */}
                      {examinationFindings && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2 text-gray-700">
                            Examination Findings
                          </h4>
                          <ul className="list-disc list-inside text-gray-600">
                            <li>
                              <strong>Imaging Results:</strong>{" "}
                              {examinationFindings.imagingResults}
                            </li>
                            <li>
                              <strong>Teeth Condition:</strong>{" "}
                              {examinationFindings.teethCondition}
                            </li>
                            <li>
                              <strong>Gums Condition:</strong>{" "}
                              {examinationFindings.gumsCondition}
                            </li>
                            <li>
                              <strong>Oral Hygiene Level:</strong>{" "}
                              {examinationFindings.oralHygieneLevel}
                            </li>
                            <li>
                              <strong>Notes:</strong>{" "}
                              {examinationFindings.notes}
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Diagnosis */}
                      {diagnosis && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2 text-gray-700">
                            Diagnosis
                          </h4>
                          <ul className="list-disc list-inside text-gray-600">
                            <li>
                              <strong>Primary Diagnosis:</strong>{" "}
                              {diagnosis.primaryDiagnosis}
                            </li>
                            <li>
                              <strong>Secondary Diagnosis:</strong>{" "}
                              {diagnosis.secondaryDiagnosis}
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Treatment Plan */}
                      {treatmentPlan && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2 text-gray-700">
                            Treatment Plan
                          </h4>
                          <ul className="list-disc list-inside text-gray-600">
                            <li>
                              <strong>Immediate Procedures Performed:</strong>{" "}
                              {treatmentPlan.immediateProceduresPerformed}
                            </li>
                            <li>
                              <strong>Treatment Suggested:</strong>{" "}
                              {treatmentPlan.treatmentSuggested}
                            </li>
                            {/* Prescribed Medications */}
                            {treatmentPlan.prescribedMedications &&
                              treatmentPlan.prescribedMedications.length >
                              0 && (
                                <li>
                                  <strong>Prescribed Medications:</strong>
                                  <ul className="list-disc list-inside ml-5">
                                    {treatmentPlan.prescribedMedications.map(
                                      (med) => (
                                        <li key={med._id}>
                                          {med.name} - {med.dosage} (
                                          {med.frequency})
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </li>
                              )}
                          </ul>
                        </div>
                      )}

                      {/* Financials */}
                      {financials && (
                        <div className="mb-4">
                          {/* <h4 className="text-lg font-semibold mb-2 text-gray-700">
                            Financials
                          </h4>
                          <p className="text-gray-600">
                            <strong>Total Cost:</strong> ₹{financials.totalCost}
                          </p> */}
                          {/* Visits */}
                          {financials.visits &&
                            financials.visits.length > 0 && (
                              <div className="mt-2">
                                <strong>Visits:</strong>
                                <ul className="list-disc list-inside ml-5 text-gray-600">
                                  {financials.visits.map((visit) => (
                                    <li key={visit._id}>
                                      Date: {formatDate(visit.date)}, 
                                      {/* Amount: ₹{visit.amount},  */}
                                      Treatment Done:{" "}
                                      {visit.treatmentDone ? "Yes" : "No"}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}

                      {/* Documents */}
                      {documents && documents.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2 text-gray-700">
                            Documents
                          </h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {documents.map((doc) => (
                              <li key={doc._id}>
                                <Link
                                  to={doc.url}
                                  className="text-blue-500 underline"
                                  target="_blank"   // Opens the link in a new tab
                                  rel="noopener noreferrer"  // Adds security for opening in new tab

                                >
                                  {doc.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MedicalOPDDetails;
