import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../services/interceptor";
import Loading from "../../Loading";
import ToothGrid from "../Comman/ToothGrid";
import user from "../../../assets/image/user.jpg";
import logo from "../../../assets/image/kkgt-header-image.jpg";
import { primaryDiagnosis, treatmentPlan } from "../../../data";

const Checkup = () => {
  const { id } = useParams();

  //Billing
  const [selectedName, setSelectedName] = useState("");
  const [customName, setCustomName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // State for billing items
  const [billingItems, setBillingItems] = useState([
    {
      name: "",
      quantity: "",
      amount: "",
      customName: "",
    },
  ]);

  // Add new billing row
  const addBillingRow = () => {
    setBillingItems([
      ...billingItems,
      {
        name: "",
        quantity: 0,
        amount: 0,
        customName: "",
      },
    ]);
  };

  // Remove billing row
  const removeBillingRow = (index) => {
    if (billingItems.length === 1) return;
    const newItems = billingItems.filter((_, i) => i !== index);
    setBillingItems(newItems);
  };

  // Handle billing item changes
  const handleBillingItemChange = (index, field, value) => {
    const newItems = [...billingItems];
    // Convert quantity and amount to numbers, handle empty strings
    if (field === "quantity" || field === "amount") {
      newItems[index][field] = value === "" ? "" : Number(value);
    } else {
      newItems[index][field] = value;
    }
    setBillingItems(newItems);
  };

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
      otherTreatment: "",
      immediateProceduresPerformed: "",
      prescribedMedications: [
        { name: "", dosage: "", frequency: "", startDate: "", endDate: "" },
      ],
    },
    additionalNotes: "",
    financials: {
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
    parentKey,
    childKey,

    section,
    field,
    index = null,
    subField = null
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setPatientReport((prevState) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [childKey]: value,
      },
    }));

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
            meds.length > 0
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
            visits.length > 0
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
        documents: docs.length > 0 ? docs : [{ name: "", url: "" }],
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(patientReport);

    try {
      await API.put(`/api/doctor/patient-reports/${id}`, patientReport);

      toast.success("Patient Report updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });

      setSuccess("Patient Report updated successfully!");
      setError("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to update the patient report. Please try again."
      );
      setSuccess("");
      setLoading(false);

      toast.error("Failed to update Patient Report.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
      <header className="flex justify-center items-center mb-6 bg-gradient-to-r from-[#111827] to-[#111827e7] py-4 rounded-lg shadow-lg px-4 mt-6">
        <div className="flex items-center space-x-3">
          <img src={user} alt="Dental Icon" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-lime-600 text-center">
            Patient Checkup Form
          </h1>
          <img src={logo} alt="Tooth Icon" className="h-12 w-12 rounded-full" />
        </div>
      </header>

      <h3 className="text-gray-800 mt-2 mb-6 text-center text-2xl font-bold">
        <span className="">Patient Name :</span> {opdForm?.userDetails?.name}
      </h3>

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

                {/* {console.log("opdForm, ", opdForm, "opdFormopdForm")} */}

                <ToothGrid
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                  patientAge={opdForm?.age}
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
              <div>
                <label
                  htmlFor="primaryDiagnosis"
                  className="block font-semibold mb-2"
                >
                  Primary Diagnosis:<span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="primaryDiagnosis"
                  value={
                    patientReport.diagnosis.primaryDiagnosis || "" // Default to empty if no value is set
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Others") {
                      handleNestedChange(
                        { target: { value: "" } },
                        "diagnosis",
                        "primaryDiagnosis"
                      );
                    } else {
                      handleNestedChange(
                        { target: { value } },
                        "diagnosis",
                        "primaryDiagnosis"
                      );
                    }
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled>
                    Select Primary Diagnosis
                  </option>
                  {primaryDiagnosis.map((diagnosis, index) => (
                    <option key={index} value={diagnosis.Diagnosis}>
                      {diagnosis.Diagnosis}
                    </option>
                  ))}
                  <option value="Others">Others</option>
                </select>

                {patientReport.diagnosis.primaryDiagnosis === "" && (
                  <input
                    type="text"
                    value={patientReport.diagnosis.primaryDiagnosis}
                    onChange={(e) =>
                      handleNestedChange(e, "diagnosis", "primaryDiagnosis")
                    }
                    placeholder="Specify custom diagnosis"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                    required
                  />
                )}
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
              <div>
                <label
                  htmlFor="treatmentSuggested"
                  className="block font-semibold mb-2"
                >
                  Treatment Suggested:<span style={{ color: "red" }}>*</span>
                </label>

                {/* Dropdown for treatment options */}
                <select
                  id="treatmentSuggested"
                  value={patientReport.treatmentPlan.treatmentSuggested || ""} // Default to empty if no value is set
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Others") {
                      // If "Others" is selected, clear the value to allow manual input
                      handleNestedChange(
                        { target: { value: "" } },
                        "treatmentPlan",
                        "treatmentSuggested"
                      );
                    } else {
                      // Otherwise, update the value with the selected option
                      handleNestedChange(
                        { target: { value } },
                        "treatmentPlan",
                        "treatmentSuggested"
                      );
                    }
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                >
                  <option value="" disabled>
                    Select a treatment
                  </option>
                  {treatmentPlan.map((treatment, index) => (
                    <option key={index} value={treatment}>
                      {treatment}
                    </option>
                  ))}
                  <option value="Others">Others</option>
                </select>

                {/* Show input field if "Others" is selected */}
                {patientReport.treatmentPlan.treatmentSuggested ===
                  "Others" && (
                    <input
                      type="text"
                      placeholder="Please specify the treatment"
                      value={patientReport.treatmentPlan.otherTreatment || ""}
                      onChange={(e) =>
                        handleNestedChange(e, "treatmentPlan", "otherTreatment")
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                    />
                  )}
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
                        .length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="ml-2 text-red-500 hover:text-red-700 font-bold"
                            aria-label="Remove Medication"
                          >
                            &#10005;
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

          {/* Financials */}
          <div className="mb-6 mt-6">
            <h3 className="text-2xl font-semibold mb-4">Financials</h3>
            <div className="border p-4 rounded-lg">
              {/* Billing Part */}
              <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Billing</h2>

                {/* Billing Items */}
                {billingItems.map((item, index) => (
                  <div key={index} className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-4">
                      {/* Name Dropdown */}
                      <div>
                        <label
                          htmlFor={`name-${index}`}
                          className="block font-semibold mb-2"
                        >
                          Name:<span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          id={`name-${index}`}
                          value={item.name}
                          onChange={(e) =>
                            handleBillingItemChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="" disabled>
                            Select Name
                          </option>
                          {treatmentPlan.map((name, idx) => (
                            <option key={idx} value={name}>
                              {name}
                            </option>
                          ))}
                          <option value="Others">Others</option>
                        </select>
                        {item.name === "Others" && (
                          <input
                            type="text"
                            value={item.customName}
                            onChange={(e) =>
                              handleBillingItemChange(
                                index,
                                "customName",
                                e.target.value
                              )
                            }
                            placeholder="Enter Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                            required
                          />
                        )}
                      </div>

                      {/* Quantity Field */}
                      <div>
                        <label
                          htmlFor={`quantity-${index}`}
                          className="block font-semibold mb-2"
                        >
                          Quantity:<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          id={`quantity-${index}`}
                          value={billingItems[index].quantity}
                          onChange={(e) =>
                            handleBillingItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* Amount Field */}
                      <div>
                        <label
                          htmlFor={`amount-${index}`}
                          className="block font-semibold mb-2"
                        >
                          Amount:<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          id={`amount-${index}`}
                          value={billingItems[index].amount}
                          onChange={(e) =>
                            handleBillingItemChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* Total Field */}
                      <div>
                        <label
                          htmlFor={`total-${index}`}
                          className="block font-semibold mb-2"
                        >
                          Total:<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          id={`total-${index}`}
                          value={item.quantity * item.amount || 0}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>

                    {billingItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBillingRow(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove Row
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Row Button */}
                <button
                  type="button"
                  onClick={addBillingRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
                >
                  Add Row
                </button>

                {/* Total Bill */}
                <div className="mt-6 border-t pt-4">
                  <label className="text-xl font-semibold">Total Bill:</label>
                  <input
                    type="number"
                    value={billingItems.reduce(
                      (sum, item) => sum + item.quantity * item.amount,
                      0
                    )}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 mt-2 text-lg font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Visits Details */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-4">Visits:</h4>
              {patientReport.financials.visits.map((visit, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Treatment Done */}
                    <div>
                      <label
                        htmlFor={`treatmentDone-${index}`}
                        className="block font-semibold mb-2"
                      >
                        Treatment Done:
                      </label>
                      <select
                        id={`treatmentDone-${index}`}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="" disabled>
                          Select Option
                        </option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label
                        htmlFor={`date-${index}`}
                        className="block font-semibold mb-2"
                      >
                        Date:<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        id={`date-${index}`}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Visit For */}
                    <div>
                      <label
                        htmlFor={`visitFor-${index}`}
                        className="block font-semibold mb-2"
                      >
                        Visit For:<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id={`visitFor-${index}`}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label
                        htmlFor={`amount-${index}`}
                        className="block font-semibold mb-2"
                      >
                        Amount:<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        id={`amount-${index}`}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor={`notes-${index}`}
                        className="block font-semibold mb-2"
                      >
                        Notes:
                      </label>
                      <input
                        type="text"
                        id={`notes-${index}`}
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
                  {patientReport.financials.visits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVisit(index)}
                      className="mt-2 text-red-500 hover:text-red-700 font-bold"
                      aria-label="Remove Visit"
                    >
                      Remove Visit
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVisit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Visit
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6 mt-6">
            <h3 className="text-2xl font-semibold mb-4">Documents</h3>
            {patientReport.documents.map((doc, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Document Name */}
                  <div>
                    <label
                      htmlFor={`docName-${index}`}
                      className="block font-semibold mb-2"
                    >
                      Document Name:
                    </label>
                    <select
                      id={`docName-${index}`}
                      name={`docName-${index}`}
                      value={doc.name}
                      onChange={(e) =>
                        handleNestedChange(e, "documents", null, index, "name")
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select document type</option>
                      <option value="consent form">Consent form</option>
                      <option value="x-ray">X-ray</option>
                      <option value="prescription">Prescription</option>
                      <option value="other">Other</option>
                    </select>

                    {/* Conditionally render input field if 'Other' is selected */}
                    {doc.name === "other" && (
                      <input
                        type="text"
                        id={`docName-${index}-other`}
                        value={doc.customName || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            e,
                            "documents",
                            null,
                            index,
                            "customName"
                          )
                        }
                        required
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Please specify"
                      />
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label
                      htmlFor={`docUpload-${index}`}
                      className="block font-semibold mb-2"
                    >
                      Upload Document:
                    </label>
                    <input
                      type="file"
                      id={`docUpload-${index}`}
                      accept="application/pdf,image/*"
                      onChange={(e) => handleDocumentUpload(e, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Document URL */}
                  <div>
                    {doc.url && (
                      <Link
                        to={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Document
                      </Link>
                    )}
                  </div>
                </div>
                {patientReport.documents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="mt-2 text-red-500 hover:text-red-700 font-bold"
                    aria-label="Remove Document"
                  >
                    Remove Document
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDocument}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Document
            </button>
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
              className={`bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
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
