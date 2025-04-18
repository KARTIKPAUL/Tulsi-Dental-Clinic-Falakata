import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import ToothGrid from "../Comman/ToothGrid";
import { primaryDiagnosis, treatmentPlan, visitReason } from "../../../data";
import { FiTrash2 } from "react-icons/fi";

const Checkup = () => {
  const { id } = useParams();

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Success and error messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [opdForm, setOPDForm] = useState({});
  const [selectedTeeth, setSelectedTeeth] = useState([]);

  // Patient Report State
  const [patientReport, setPatientReport] = useState({
    opdNumber: "",
    examinationFindings: {
      teethCondition: "",
      gumsCondition: "",
      imagingResults: "",
      oralHygieneLevel: "",
      notes: "",
      selectedTeeth: selectedTeeth,
    },
    diagnosis: {
      primaryDiagnosis: "",
      secondaryDiagnosis: "",
    },
    treatmentPlan: {
      treatmentSuggested: "",
      immediateProceduresPerformed: "",
      prescribedMedications: [
        { name: "", dosage: "", frequency: "", startDate: "", endDate: "" },
      ],
    },
    additionalNotes: "",
    financials: {
      billingItems: [
        {
          name: "",
          quantity: 1,
          pricePerItem: 0,
          totalCostPerItem: 0,
        },
      ],
      totalCost: 0,
      visits: [
        {
          treatmentDone: false,
          date: "",
          visitFor: "",
          amount: 0,
          notes: "",
        },
      ],
    },
    documents: [
      {
        name: "",
        url: "",
      },
    ],
    createdAt: "",
  });

  // Fetch existing Patient Report data
  useEffect(() => {
    const fetchPatientReport = async () => {
      try {
        const response = await API.get(`/api/doctor/details/${id}`);
        setOPDForm(response.data);
        setPatientReport(response.data.patientReport);
        setSelectedTeeth(
          response.data.patientReport.examinationFindings.selectedTeeth || []
        ); // Ensure selectedTeeth is loaded correctly

        setInitialLoading(false);
      } catch (err) {
        console.error("Error fetching Patient Report:", err.message);
        setError(
          err.response?.data?.message ||
            "Failed to load the patient report. Please try again."
        );
        setInitialLoading(false);
      }
    };

    fetchPatientReport();
  }, [id]);

  // Handle document upload
  const handleDocumentUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mypreset"); // Replace with your upload preset
    formData.append("cloud_name", "dsi1mb2aj"); // Replace with your cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsi1mb2aj/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const documentUrl = data.secure_url;

      // Update the document URL in the state
      setPatientReport((prevState) => {
        const updatedDocuments = [...prevState.documents];
        updatedDocuments[index].url = documentUrl;
        return { ...prevState, documents: updatedDocuments };
      });

      toast.success("Document uploaded successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    }
  };

  // Handle changes for nested objects
  const handleNestedChange = (
    e,
    section,
    field,
    index = null,
    subField = null
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setPatientReport((prevState) => {
      if (section === "documents") {
        const updatedDocuments = [...prevState.documents];
        if (index !== null && subField) {
          updatedDocuments[index][subField] = value;
        }
        return { ...prevState, documents: updatedDocuments };
      }

      const updatedSection = { ...prevState[section] };

      if (section === "examinationFindings" || section === "diagnosis") {
        updatedSection[field] = value;
      } else if (section === "treatmentPlan") {
        if (field === "prescribedMedications" && index !== null && subField) {
          const meds = [...updatedSection.prescribedMedications];
          meds[index][subField] = value;
          updatedSection.prescribedMedications = meds;
        } else {
          updatedSection[field] = value;
        }
      } else if (section === "financials") {
        if (field === "visits" && index !== null && subField) {
          const visits = [...updatedSection.visits];
          visits[index][subField] = value;
          updatedSection.visits = visits;
        } else {
          updatedSection[field] = value;
        }
      }

      return { ...prevState, [section]: updatedSection };
    });
  };

  // Handle changes for simple fields
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setPatientReport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle changes to selectedTeeth

  useEffect(() => {
    const handleSelectedTeethChange = (selectedTeeth) => {
      setSelectedTeeth(selectedTeeth);
      setPatientReport((prevState) => ({
        ...prevState,
        examinationFindings: {
          ...prevState.examinationFindings,
          selectedTeeth, // Update the selectedTeeth in the report
        },
      }));
    };

    handleSelectedTeethChange(selectedTeeth);
  }, [selectedTeeth]); // Trigger this effect whenever selectedTeeth changes

  // Prescribed Medications Handlers
  const handleMedicationChange = (e, index, field) => {
    const value = e.target.value;
    setPatientReport((prevState) => {
      const meds = [...prevState.treatmentPlan.prescribedMedications];
      meds[index][field] = value;
      return {
        ...prevState,
        treatmentPlan: {
          ...prevState.treatmentPlan,
          prescribedMedications: meds,
        },
      };
    });
  };

  const addMedication = () => {
    setPatientReport((prevState) => ({
      ...prevState,
      treatmentPlan: {
        ...prevState.treatmentPlan,
        prescribedMedications: [
          ...prevState.treatmentPlan.prescribedMedications,
          { name: "", dosage: "", frequency: "", startDate: "", endDate: "" },
        ],
      },
    }));
  };

  const removeMedication = (index) => {
    setPatientReport((prevState) => {
      const meds = [...prevState.treatmentPlan.prescribedMedications];
      meds.splice(index, 1);
      return {
        ...prevState,
        treatmentPlan: {
          ...prevState.treatmentPlan,
          prescribedMedications:
            meds.length >= 0
              ? meds
              : [
                  {
                    name: "",
                    dosage: "",
                    frequency: "",
                    startDate: "",
                    endDate: "",
                  },
                ],
        },
      };
    });
  };

  // Financial Visits Handlers
  const addVisit = () => {
    setPatientReport((prevState) => ({
      ...prevState,
      financials: {
        ...prevState.financials,
        visits: [
          ...prevState.financials.visits,
          {
            treatmentDone: false,
            date: "",
            visitFor: "",
            amount: 0,
            notes: "",
          },
        ],
      },
    }));
  };

  const removeVisit = (index) => {
    setPatientReport((prevState) => {
      const visits = [...prevState.financials.visits];
      visits.splice(index, 1);
      return {
        ...prevState,
        financials: {
          ...prevState.financials,
          visits:
            visits.length >= 0
              ? visits
              : [
                  {
                    treatmentDone: false,
                    date: "",
                    visitFor: "",
                    amount: 0,
                    notes: "",
                  },
                ],
        },
      };
    });
  };

  // Documents Handlers
  const addDocument = () => {
    setPatientReport((prevState) => ({
      ...prevState,
      documents: [...prevState.documents, { name: "", url: "" }],
    }));
  };

  const removeDocument = (index) => {
    setPatientReport((prevState) => {
      const docs = [...prevState.documents];
      docs.splice(index, 1);
      return {
        ...prevState,
        documents: docs.length >= 0 ? docs : [{ name: "", url: "" }],
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Show loading toast
    const loadingToastId = toast.loading("Updating Patient Report...", {
      position: "top-center",
      hideProgressBar: false,
      theme: "dark",
    });

    console.log(patientReport);

    try {
      await API.put(`/api/doctor/patient-reports/${id}`, patientReport);

      // Dismiss the loading toast completely
      toast.dismiss(loadingToastId);

      // Create a new success toast
      toast.success("Update Patient Report Successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });

      setSuccess("Patient Report updated successfully!");
      setError("");
    } catch (err) {
      console.error(err);

      // Dismiss the loading toast completely
      toast.dismiss(loadingToastId);

      // Create a new error toast
      toast.error("Failed To Update Patient Report", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });

      setError(
        err.response?.data?.message ||
          "Failed to update the patient report. Please try again."
      );
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  //billing part
  // Billing Form for the billingItems array
  const handleBillingItemChange = (e, index, field) => {
    const value = e.target.value;
    const updatedBillingItems = [...patientReport.financials.billingItems];
    updatedBillingItems[index][field] =
      field === "quantity" || field === "pricePerItem"
        ? parseFloat(value)
        : value;

    // Recalculate totalCostPerItem for that item
    updatedBillingItems[index].totalCostPerItem =
      updatedBillingItems[index].quantity *
      updatedBillingItems[index].pricePerItem;

    // Update the financial state
    setPatientReport((prevState) => {
      const totalCost = updatedBillingItems.reduce(
        (acc, item) => acc + item.totalCostPerItem,
        0
      );

      return {
        ...prevState,
        financials: {
          ...prevState.financials,
          billingItems: updatedBillingItems,
          totalCost: totalCost,
        },
      };
    });
  };

  const addBillingItem = () => {
    setPatientReport((prevState) => ({
      ...prevState,
      financials: {
        ...prevState.financials,
        billingItems: [
          ...prevState.financials.billingItems,
          { name: "", quantity: 1, pricePerItem: 0, totalCostPerItem: 0 },
        ],
      },
    }));
  };

  const removeBillingItem = (index) => {
    setPatientReport((prevState) => {
      const updatedBillingItems = [...prevState.financials.billingItems];
      updatedBillingItems.splice(index, 1);

      // Recalculate totalCost
      const totalCost = updatedBillingItems.reduce(
        (acc, item) => acc + item.totalCostPerItem,
        0
      );

      return {
        ...prevState,
        financials: {
          ...prevState.financials,
          billingItems: updatedBillingItems,
          totalCost: totalCost,
        },
      };
    });
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">
        {opdForm?.userDetails?.name} | Patient Checkup Form
      </h2>

      {initialLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* OPD Number and Chief Complaint */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="opdNumber" className="block font-semibold mb-2">
                OPD Number:
              </label>
              <input
                type="text"
                id="opdNumber"
                name="opdNumber"
                value={patientReport.opdNumber}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="chiefComplaint"
                className="block font-semibold mb-2"
              >
                Chief Complaint:
              </label>
              <input
                type="text"
                id="chiefComplaint"
                name="chiefComplaint"
                value={opdForm?.checkupInfo || "-----"}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* Examination Findings */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">
              Examination Findings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg">
              {/* Teeth Condition */}
              {/* <div>
                <label htmlFor="teethCondition" className="font-semibold mb-2">
                  Teeth Condition:<span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  id="teethCondition"
                  value={patientReport.examinationFindings.teethCondition}
                  onChange={(e) =>
                    handleNestedChange(e, "examinationFindings", "teethCondition")
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled selected>Select Teeth Condition</option>
                  <option value="Healthy Teeth">Healthy Teeth</option>
                  <option value="Discolored Teeth">Discolored Teeth</option>
                  <option value="Chipped Teeth">Chipped Teeth</option>
                  <option value="Cavities">Cavities</option>
                  <option value="Tooth Sensitivity">Tooth Sensitivity</option>
                  <option value="Misaligned Teeth">Misaligned Teeth</option>
                  <option value="Worn-Down Teeth">Worn-Down Teeth</option>
                  <option value="Gum Recession">Gum Recession</option>
                  <option value="Plaque Buildup">Plaque Buildup</option>
                  <option value="Tooth Decay">Tooth Decay</option>
                  <option value="Toothache">Toothache</option>
                  <option value="Broken Tooth">Broken Tooth</option>
                  <option value="Missing Teeth">Missing Teeth</option>
                  <option value="Loose Tooth">Loose Tooth</option>
                  <option value="Gingivitis">Gingivitis</option>
                  <option value="Periodontal Disease">Periodontal Disease</option>
                  <option value="Stained Teeth">Stained Teeth</option>
                  <option value="Overlapping Teeth">Overlapping Teeth</option>
                  <option value="Crowded Teeth">Crowded Teeth</option>
                  <option value="Impacted Teeth">Impacted Teeth</option>
                  <option value="Cracked Tooth">Cracked Tooth</option>
                  <option value="Tooth Erosion">Tooth Erosion</option>
                  <option value="Enamel Hypoplasia">Enamel Hypoplasia</option>
                  <option value="Dental Abscess">Dental Abscess</option>
                  <option value="Orthodontic Issues">Orthodontic Issues</option>
                </select>

              </div> */}

              {/* Gums Condition */}
              <div>
                <label htmlFor="gumsCondition" className="font-semibold mb-2">
                  Gums Condition:<span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="gumsCondition"
                  value={patientReport.examinationFindings.gumsCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      e,
                      "examinationFindings",
                      "gumsCondition"
                    )
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled selected>
                    Select Gums Condition
                  </option>
                  <option value="Bleeding gum">Bleeding gum</option>
                  <option value="Healthy gum">Healthy gum</option>
                  <option value="Swollen Gum">Swollen Gum</option>
                </select>
              </div>

              {/* Imaging Results */}
              {/* <div>
                <label
                  htmlFor="imagingResults"
                  className="block font-semibold mb-2"
                >
                  Imaging Results:
                </label>
                <input
                  type="text"
                  id="imagingResults"
                  value={patientReport.examinationFindings.imagingResults || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      e,
                      "examinationFindings",
                      "imagingResults"
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div> */}

              {/* Oral Hygiene Level */}
              <div>
                <label className="block font-semibold mb-2">
                  Oral Hygiene Level:<span style={{ color: "red" }}>*</span>
                </label>
                <div className="flex flex-wrap">
                  {["Very Poor", "Poor", "Fair", "Good", "Excellent"].map(
                    (level) => (
                      <label
                        key={level}
                        className="flex items-center mr-4 mb-2"
                      >
                        <input
                          type="radio"
                          name="oralHygieneLevel"
                          value={level}
                          checked={
                            patientReport.examinationFindings
                              .oralHygieneLevel === level
                          }
                          onChange={(e) =>
                            handleNestedChange(
                              e,
                              "examinationFindings",
                              "oralHygieneLevel"
                            )
                          }
                          required
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2">{level}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block font-semibold mb-2">
                  Dental Chart:
                </label>
                <ToothGrid
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                />
                {/* Selected Teeth Display */}
                {selectedTeeth.length > 0 && (
                  <div className="mt-6 text-center">
                    <h2 className="text-lg font-semibold mb-2">
                      Selected Teeth:
                    </h2>
                    <div className="flex justify-center flex-wrap">
                      {selectedTeeth.map((tooth) => (
                        <span
                          key={tooth.id}
                          className="m-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                        >
                          Tooth {tooth.id} -{" "}
                          {tooth.reason || "No reason provided"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <label
                  htmlFor="examinationNotes"
                  className="block font-semibold mb-2"
                >
                  Notes:
                </label>
                <textarea
                  id="examinationNotes"
                  value={patientReport.examinationFindings.notes || ""}
                  onChange={(e) =>
                    handleNestedChange(e, "examinationFindings", "notes")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Diagnosis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border p-4 rounded-lg">
              {/* Primary Diagnosis */}
              {/* <div>
                <label
                  htmlFor="primaryDiagnosis"
                  className="block font-semibold mb-2"
                >
                  Primary Diagnosis:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  id="primaryDiagnosis"
                  value={patientReport.diagnosis.primaryDiagnosis}
                  onChange={(e) =>
                    handleNestedChange(e, "diagnosis", "primaryDiagnosis")
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div> */}

              <div>
                <label
                  htmlFor="primaryDiagnosis"
                  className="block font-semibold mb-2"
                >
                  Primary Diagnosis:<span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="primaryDiagnosis"
                  value={patientReport.diagnosis.primaryDiagnosis || ""}
                  onChange={(e) =>
                    handleNestedChange(e, "diagnosis", "primaryDiagnosis")
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="" disabled hidden>
                    Select Primary Diagnosis...
                  </option>
                  {primaryDiagnosis.map((diagnosis, index) => (
                    <option key={index} value={diagnosis.Diagnosis}>
                      {diagnosis.Diagnosis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Diagnosis */}
              <div>
                <label
                  htmlFor="secondaryDiagnosis"
                  className="block font-semibold mb-2"
                >
                  Secondary Diagnosis:
                </label>
                <input
                  type="text"
                  id="secondaryDiagnosis"
                  value={patientReport.diagnosis.secondaryDiagnosis || ""}
                  onChange={(e) =>
                    handleNestedChange(e, "diagnosis", "secondaryDiagnosis")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Treatment Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border p-4 rounded-lg">
              {/* Treatment Suggested */}
              {/* <div>
                <label
                  htmlFor="treatmentSuggested"
                  className="block font-semibold mb-2"
                >
                  Treatment Suggested:<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  id="treatmentSuggested"
                  value={patientReport.treatmentPlan.treatmentSuggested}
                  onChange={(e) =>
                    handleNestedChange(e, "treatmentPlan", "treatmentSuggested")
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div> */}

              <div>
                <label
                  htmlFor="treatmentSuggested"
                  className="block font-semibold mb-2"
                >
                  Treatment Suggested:<span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="treatmentSuggested"
                  value={patientReport.treatmentPlan.treatmentSuggested || ""}
                  onChange={(e) =>
                    handleNestedChange(e, "treatmentPlan", "treatmentSuggested")
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="" disabled hidden>
                    Select Treatment Plan...
                  </option>
                  {treatmentPlan.map((treatment, index) => (
                    <option key={index} value={treatment}>
                      {treatment}
                    </option>
                  ))}
                </select>
              </div>

              {/* Immediate Procedures Performed */}
              <div>
                <label
                  htmlFor="immediateProceduresPerformed"
                  className="block font-semibold mb-2"
                >
                  Immediate Procedures Performed:
                </label>
                <input
                  type="text"
                  id="immediateProceduresPerformed"
                  value={
                    patientReport.treatmentPlan.immediateProceduresPerformed ||
                    ""
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      e,
                      "treatmentPlan",
                      "immediateProceduresPerformed"
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Prescribed Medications */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block font-semibold mb-2">
                  Prescribed Medications:
                </label>
                {patientReport.treatmentPlan.prescribedMedications.map(
                  (med, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:space-x-4 mb-2"
                    >
                      <input
                        type="text"
                        placeholder="Medication Name"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicationChange(e, index, "name")
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicationChange(e, index, "dosage")
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) =>
                          handleMedicationChange(e, index, "frequency")
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      />
                      <input
                        type="date"
                        placeholder="Start Date"
                        value={
                          med.startDate ? med.startDate.substring(0, 10) : ""
                        }
                        onChange={(e) =>
                          handleMedicationChange(e, index, "startDate")
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      />
                      <input
                        type="date"
                        placeholder="End Date"
                        value={med.endDate ? med.endDate.substring(0, 10) : ""}
                        onChange={(e) =>
                          handleMedicationChange(e, index, "endDate")
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      {patientReport.treatmentPlan.prescribedMedications
                        .length >= 0 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="ml-2 p-2 rounded-full border-2 bg-red-200 hover:border-red-300  hover:bg-red-50 group transition-all duration-200"
                          aria-label="Remove Medication"
                        >
                          <FiTrash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  )
                )}
                <button
                  type="button"
                  onClick={addMedication}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Medication
                </button>
              </div>
            </div>
          </div>

          {/* Billing Form */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Billing Items</h3>
            <div className="border p-4 rounded-lg">
              {patientReport.financials.billingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:space-x-4 mb-2"
                >
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleBillingItemChange(e, index, "name")}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      handleBillingItemChange(e, index, "quantity")
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                  />
                  <input
                    type="number"
                    placeholder="Price Per Item"
                    value={item.pricePerItem}
                    onChange={(e) =>
                      handleBillingItemChange(e, index, "pricePerItem")
                    }
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                  />
                  <input
                    type="number"
                    placeholder="Total Cost"
                    value={item.totalCostPerItem}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  {patientReport.financials.billingItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBillingItem(index)}
                      className="ml-2 p-2 rounded-full border-2 bg-red-200 hover:border-red-300  hover:bg-red-50 group transition-all duration-200"
                      aria-label="Remove Billing Item"
                    >
                      <FiTrash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBillingItem}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Billing Item
              </button>
            </div>

            {/* Total Cost */}
            <div className="mt-6">
              <label htmlFor="totalCost" className="block font-semibold mb-2">
                Total Cost:
              </label>
              <input
                type="number"
                id="totalCost"
                value={patientReport.financials.totalCost}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* Financials */}
          <div className="mb-6 mt-6">
            <h3 className="text-2xl font-semibold mb-4">Financials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border p-4 rounded-lg">
              {/* Total Cost */}
              <div>
                <label htmlFor="totalCost" className="block font-semibold mb-2">
                  Total Cost:<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="number"
                  id="totalCost"
                  name="totalCost"
                  value={patientReport.financials.totalCost}
                  onChange={(e) => {
                    const newValue = Math.max(0, Number(e.target.value)); // Ensure the value is never less than zero
                    handleNestedChange(
                      { target: { name: "totalCost", value: newValue } },
                      "financials",
                      "totalCost"
                    );
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Visits Details */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-4">Visits:</h4>
              <div className="border p-4 rounded-lg">
                {patientReport.financials.visits.map((visit, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-col md:flex-row md:space-x-4 mb-2">
                      <select
                        placeholder="Treatment Done"
                        value={visit.treatmentDone}
                        onChange={(e) =>
                          handleNestedChange(
                            e,
                            "financials",
                            "visits",
                            index,
                            "treatmentDone"
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      >
                        <option value="" disabled>
                          Select Treatment Status
                        </option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>

                      <input
                        type="date"
                        placeholder="Date"
                        value={visit.date ? visit.date.substring(0, 10) : ""}
                        onChange={(e) =>
                          handleNestedChange(
                            e,
                            "financials",
                            "visits",
                            index,
                            "date"
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      />

                      <select
                        placeholder="Visit For"
                        value={visit.visitFor || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            e,
                            "financials",
                            "visits",
                            index,
                            "visitFor"
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      >
                        <option value="" disabled>
                          Select Visit Reason
                        </option>
                        {visitReason.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Amount"
                        value={visit.amount}
                        onChange={(e) =>
                          handleNestedChange(
                            e,
                            "financials",
                            "visits",
                            index,
                            "amount"
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                      />

                      {patientReport.financials.visits.length > 0 && (
                        <button
                          type="button"
                          onClick={() => removeVisit(index)}
                          className="ml-2 p-2 rounded-full border-2 bg-red-200 hover:border-red-300 bg-white hover:bg-red-50 group transition-all duration-200"
                          aria-label="Remove Visit"
                        >
                          <FiTrash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                        </button>
                      )}
                    </div>

                    {/* Notes field on a new line */}
                    <div className="mt-2">
                      <textarea
                        type="text"
                        placeholder="Notes"
                        value={visit.notes || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            e,
                            "financials",
                            "visits",
                            index,
                            "notes"
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVisit}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Visit
                </button>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6 mt-6">
            <h3 className="text-2xl font-semibold mb-4">Documents</h3>
            <div className="border p-4 rounded-lg">
              {patientReport.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:space-x-4 mb-4 items-center"
                >
                  <div className="w-full md:flex-1">
                    <input
                      type="text"
                      placeholder="Document Name"
                      value={doc.name}
                      onChange={(e) =>
                        handleNestedChange(e, "documents", null, index, "name")
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                    />
                  </div>

                  <div className="w-full md:flex-1">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => handleDocumentUpload(e, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                    />
                  </div>

                  <div className="w-full md:w-auto mb-2 md:mb-0">
                    {doc.url && (
                      <Link
                        to={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block"
                      >
                        View Document
                      </Link>
                    )}
                  </div>

                  {patientReport.documents.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="ml-2 p-2 rounded-full border-2 bg-red-200 hover:border-red-300 bg-white hover:bg-red-50 group transition-all duration-200"
                      aria-label="Remove Document"
                    >
                      <FiTrash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addDocument}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Document
              </button>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="my-6">
            <h3 className="text-2xl font-semibold mb-4">Additional Notes</h3>
            <textarea
              name="additionalNotes"
              id="additionalNotes"
              value={patientReport.additionalNotes || ""}
              onChange={handleSimpleChange}
              className="w-full p-4 border border-gray-300 rounded-lg"
              rows="4"
            ></textarea>
          </div>

          {/* Created At */}
          <div>
            <label htmlFor="createdAt" className="block font-semibold mb-2">
              Created At:
            </label>
            <input
              type="date"
              id="createdAt"
              name="createdAt"
              value={
                patientReport.createdAt
                  ? new Date(patientReport.createdAt)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className={`bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Patient Report"}
            </button>
          </div>

          {/* Success and Error Messages */}
          {success && (
            <p className="text-green-500 mt-4 text-center">{success}</p>
          )}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default Checkup;
