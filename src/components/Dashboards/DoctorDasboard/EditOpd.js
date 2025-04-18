import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, startTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../services/interceptor";
import { chiefComplaint } from "../../../data";
import user from "../../../assets/image/user.jpg";
import logo from "../../../assets/image/kkgt-header-image.jpg";

// Lazy load components
const Loading = lazy(() => import("../../Loading"));
const BloodGroupSelect = lazy(() => import("../Comman/MedicalForm/BloodGroupSelect"));
const LifestyleHabitsSection = lazy(() => import("../Comman/MedicalForm/LifestyleHabitsSection"));
const AllergiesSection = lazy(() => import("../Comman/MedicalForm/AllergiesSection"));
const MedicationsSection = lazy(() => import("../Comman/MedicalForm/MedicationsSection"));
const PastDentalHistoryTextarea = lazy(() => import("../Comman/MedicalForm/PastDentalHistoryTextarea"));
const MedicalHistory = lazy(() => import("../Comman/MedicalForm/MedicalHistory"));

// Simplified animations without motion library
const AnimatedContainer = ({ children, className }) => (
  <div className={`transition-all duration-300 ease-in-out ${className}`}>
    {children}
  </div>
);

// Initial form state as a constant outside component
const INITIAL_FORM_STATE = {
  bloodGroup: "",
  medicalHistory: [],
  medications: [{ name: "", dosage: "", frequency: "" }],
  allergies: [{ allergen: "", reaction: "", severity: "" }],
  lifestyleAndHabits: { smokingStatus: "", alcoholUse: "", tobacco: "" },
  pastDentalHistory: [],
  notes: "",
};

const EditOpd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModified, setIsModified] = useState(false);

  // Group related states together in objects
  const [patientInfo, setPatientInfo] = useState({
    opdNumber: "",
    fullName: "",
    gender: "",
    dob: "",
    age: "",
    address: "",
    contactNumber: "",
    email: "",
    checkupInfo: "",
    otherCheckupInfo: "",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    number: "",
    relationship: "",
  });

  const [insurance, setInsurance] = useState({
    provided: false,
    provider: "",
    policyNumber: "",
    coverageDetails: "",
    expirationDate: "",
    primaryPolicyHolderName: "",
  });

  // Medical Details State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Memoized OPD number generator
  const generateOpdNumber = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const opd = `OPD-${year[3]}${month}${day}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setPatientInfo(prev => ({ ...prev, opdNumber: opd }));
  }, []);

  // Fetch existing OPD form data
  useEffect(() => {
    const fetchOpdForm = async () => {
      try {
        const response = await API.get(
          `${process.env.REACT_APP_API_URL}/api/doctor/details/${id}`
        );
        const opdForm = response.data;
        console.log("Fetched OPD Form:", opdForm);

        // Populate basic patient information
        setPatientInfo({
          opdNumber: opdForm.opdNumber || "",
          fullName: opdForm.userDetails?.name || "",
          gender: opdForm.userDetails?.gender || "",
          dob: opdForm.userDetails?.dateOfBirth
            ? opdForm.userDetails.dateOfBirth.substring(0, 10)
            : "",
          age: opdForm.age || "",
          address: opdForm.userDetails?.contact?.address || "",
          contactNumber: opdForm.userDetails?.contact?.mobile || "",
          email: opdForm.userDetails?.contact?.email || "",
          checkupInfo: opdForm.checkupInfo || "",
          otherCheckupInfo:
            opdForm.checkupInfo === "Other" ? opdForm.checkupInfo : "",
        });

        // Populate emergency contact
        setEmergencyContact({
          name: opdForm.userDetails?.emergencyContact?.name || "",
          number: opdForm.userDetails?.emergencyContact?.phone || "",
          relationship: opdForm.userDetails?.emergencyContact?.relationship || "",
        });

        // Populate insurance information
        setInsurance({
          provided: opdForm.insuranceDetails?.insuranceProvided || false,
          provider: opdForm.insuranceDetails?.insuranceProvider || "",
          policyNumber: opdForm.insuranceDetails?.policyNumber || "",
          coverageDetails: opdForm.insuranceDetails?.coverageDetails || "",
          expirationDate: opdForm.insuranceDetails?.expirationDate
            ? opdForm.insuranceDetails.expirationDate.substring(0, 10)
            : "",
          primaryPolicyHolderName: opdForm.insuranceDetails?.primaryPolicyHolderName || "",
        });

        // Populate medical details
        setFormData({
          bloodGroup: opdForm.medicalDetails?.bloodGroup || "",
          medicalHistory: opdForm.medicalDetails?.medicalHistory || [],
          medications:
            opdForm.medicalDetails?.medications?.length > 0
              ? opdForm.medicalDetails.medications
              : [{ name: "", dosage: "", frequency: "" }],
          allergies:
            opdForm.medicalDetails?.allergies?.length > 0
              ? opdForm.medicalDetails.allergies
              : [{ allergen: "", reaction: "", severity: "" }],
          lifestyleAndHabits: opdForm.medicalDetails?.lifestyleAndHabits || {
            smokingStatus: "",
            alcoholUse: "",
            tobacco: "",
          },
          pastDentalHistory: opdForm.medicalDetails?.pastDentalHistory || [],
          notes: opdForm.medicalDetails?.notes || "",
        });

        setInitialLoading(false);
      } catch (err) {
        console.error("Error fetching OPD form:", err.message);
        setError("Failed to load the form. Please try again.");
        setInitialLoading(false);
      }
    };

    fetchOpdForm();
  }, [id]);

  // Optimized handlers using functional updates
  const handlePatientInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    startTransition(() => {
      setPatientInfo(prev => ({ ...prev, [name]: value }));
      setIsModified(true);
    });
  }, []);


  const SuspenseWrapper = ({ children, fallback }) => (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      {children}
    </Suspense>
  );

  // Specific handler for DOB to calculate age
  const handleDobChange = useCallback((e) => {
    const value = e.target.value;
    const today = new Date();
    const birthDate = new Date(value);
    let ageNow = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageNow--;
    }

    setPatientInfo(prev => ({
      ...prev,
      dob: value,
      age: ageNow
    }));
    setIsModified(true);
  }, []);

  const handleEmergencyContactChange = useCallback((e) => {
    const { name, value } = e.target;
    setEmergencyContact(prev => ({ ...prev, [name]: value }));
    setIsModified(true);
  }, []);

  const handleInsuranceChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setInsurance(prev => ({ ...prev, [name]: fieldValue }));
    setIsModified(true);
  }, []);

  // Generate email from contact number
  const generateEmail = useCallback(() => {
    const generatedEmail = `${patientInfo.contactNumber}@denteex.com`;
    setPatientInfo(prev => ({ ...prev, email: generatedEmail }));
    setIsModified(true);
  }, [patientInfo.contactNumber]);

  // Handle form change marker
  const handleFormChange = useCallback(() => {
    setIsModified(true);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    startTransition(() => {
      setFormData(prev => ({ ...prev, [name]: value }));
      handleFormChange();
    });
  }, [handleFormChange]);

  const handleNestedChange = useCallback((section, index, field, value) => {
    startTransition(() => {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, idx) =>
          idx === index ? { ...item, [field]: value } : item
        )
      }));
      handleFormChange();
    });
  }, [handleFormChange]);

  // Handle changes for nested objects (e.g., lifestyleAndHabits)
  const handleNestedPropertyChange = useCallback((section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    handleFormChange();
  }, [handleFormChange]);

  // Functions to add/remove entries
  const addEntry = useCallback((section, defaultEntry) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultEntry],
    }));
    setIsModified(true);
  }, []);

  const removeEntry = useCallback((section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, idx) => idx !== index),
    }));
    setIsModified(true);
  }, []);

  // Specialized handlers for specific sections
  const handleMedicalHistoryChange = useCallback((updatedHistory) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: updatedHistory,
    }));
    handleFormChange();
  }, [handleFormChange]);

  const handlePastDentalHistoryChange = useCallback((newSelectedTeeth) => {
    setFormData(prev => ({
      ...prev,
      pastDentalHistory: newSelectedTeeth,
    }));
    handleFormChange();
  }, [handleFormChange]);

  // Reset form function
  const resetForm = useCallback(() => {
    // Fetch the form data again
    const fetchOpdForm = async () => {
      try {
        const response = await API.get(
          `${process.env.REACT_APP_API_URL}/api/doctor/details/${id}`
        );
        const opdForm = response.data;

        // Reset to original data
        setPatientInfo({
          opdNumber: opdForm.opdNumber || "",
          fullName: opdForm.userDetails?.name || "",
          gender: opdForm.userDetails?.gender || "",
          dob: opdForm.userDetails?.dateOfBirth
            ? opdForm.userDetails.dateOfBirth.substring(0, 10)
            : "",
          age: opdForm.age || "",
          address: opdForm.userDetails?.contact?.address || "",
          contactNumber: opdForm.userDetails?.contact?.mobile || "",
          email: opdForm.userDetails?.contact?.email || "",
          checkupInfo: opdForm.checkupInfo || "",
          otherCheckupInfo:
            opdForm.checkupInfo === "Other" ? opdForm.checkupInfo : "",
        });

        setEmergencyContact({
          name: opdForm.userDetails?.emergencyContact?.name || "",
          number: opdForm.userDetails?.emergencyContact?.phone || "",
          relationship: opdForm.userDetails?.emergencyContact?.relationship || "",
        });

        setInsurance({
          provided: opdForm.insuranceDetails?.insuranceProvided || false,
          provider: opdForm.insuranceDetails?.insuranceProvider || "",
          policyNumber: opdForm.insuranceDetails?.policyNumber || "",
          coverageDetails: opdForm.insuranceDetails?.coverageDetails || "",
          expirationDate: opdForm.insuranceDetails?.expirationDate
            ? opdForm.insuranceDetails.expirationDate.substring(0, 10)
            : "",
          primaryPolicyHolderName: opdForm.insuranceDetails?.primaryPolicyHolderName || "",
        });

        setFormData({
          bloodGroup: opdForm.medicalDetails?.bloodGroup || "",
          medicalHistory: opdForm.medicalDetails?.medicalHistory || [],
          medications:
            opdForm.medicalDetails?.medications?.length > 0
              ? opdForm.medicalDetails.medications
              : [{ name: "", dosage: "", frequency: "" }],
          allergies:
            opdForm.medicalDetails?.allergies?.length > 0
              ? opdForm.medicalDetails.allergies
              : [{ allergen: "", reaction: "", severity: "" }],
          lifestyleAndHabits: opdForm.medicalDetails?.lifestyleAndHabits || {
            smokingStatus: "",
            alcoholUse: "",
            tobacco: "",
          },
          pastDentalHistory: opdForm.medicalDetails?.pastDentalHistory || [],
          notes: opdForm.medicalDetails?.notes || "",
        });

        setIsModified(false);
        setError("");
        setSuccess("");
      } catch (err) {
        console.error("Error resetting form:", err.message);
        setError("Failed to reset the form. Please try again.");
      }
    };

    fetchOpdForm();
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    // Collect all data to submit
    const opdFormData = {
      opdNumber: patientInfo.opdNumber,
      age: patientInfo.age,
      checkupInfo: patientInfo.checkupInfo === "Other"
        ? patientInfo.otherCheckupInfo
        : patientInfo.checkupInfo,
      medicalDetails: formData,
      userDetails: {
        name: patientInfo.fullName,
        gender: patientInfo.gender,
        dateOfBirth: patientInfo.dob,
        contact: {
          mobile: patientInfo.contactNumber,
          email: patientInfo.email,
          address: patientInfo.address,
        },
        emergencyContact: {
          name: emergencyContact.name,
          phone: emergencyContact.number,
          relationship: emergencyContact.relationship,
        },
      },
      insuranceDetails: {
        insuranceProvided: insurance.provided,
        insuranceProvider: insurance.provider,
        policyNumber: insurance.policyNumber,
        coverageDetails: insurance.coverageDetails,
        expirationDate: insurance.expirationDate,
        primaryPolicyHolderName: insurance.primaryPolicyHolderName,
      },
    };

    console.log("Submitting Form Data:", opdFormData);

    try {
      // Send PUT request to API
      const response = await API.put(
        `${process.env.REACT_APP_API_URL}/api/doctor/opd/${id}`,
        opdFormData
      );

      toast.success("Form Updated Successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setSuccess("Form updated successfully");
      setError("");
      setIsModified(false);

      // Navigate back or refresh data
      // navigate('/dashboard/patient-list'); // Uncomment if you want to navigate away
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update the form. Please try again.");
      }
      setSuccess("");

      toast.error("Failed to Update Form", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  }, [patientInfo, formData, emergencyContact, insurance, id]);

  // Memoize sections of the form that don't need frequent re-renders
  const HeaderSection = useMemo(() => (
    <header className="flex justify-center items-center mb-6 bg-gradient-to-r from-[#111827] to-[#111827e7] py-4 rounded-lg shadow-lg px-4">
      <div className="flex items-center space-x-3">
        <img src={user} alt="Dental Icon" className="h-12 w-12" />
        <h1 className="text-3xl font-bold text-lime-600 text-center">
          Edit OPD Registration Form
        </h1>
        <img src={logo} alt="Tooth Icon" className="h-12 w-12 rounded-full" />
      </div>
    </header>
  ), []);

  const OpdNumberSection = useMemo(() => (
    <div className="mb-4 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
      <label
        htmlFor="opdNumber"
        className="block text-xl font-semibold mb-1"
      >
        OPD Number : {patientInfo.opdNumber}
      </label>
    </div>
  ), [patientInfo.opdNumber]);

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <AnimatedContainer className="mx-auto p-6">
      {HeaderSection}

      <form onSubmit={handleSubmit}>
        {OpdNumberSection}

        {/* Basic Form Details */}
        <div className="border-b border-gray-300 pb-10 mb-10 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Patient Personal Details
          </h2>

          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 ">
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block font-semibold mb-1">
                Full Name : <span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={patientInfo.fullName}
                onChange={handlePatientInfoChange}
                placeholder="Enter Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label htmlFor="dob" className="block font-semibold mb-1">
                Date of Birth : <span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={patientInfo.dob}
                onChange={handleDobChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label htmlFor="age" className="block font-semibold mb-1">
                Patient Age : <span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={patientInfo.age}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                readOnly
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Select Gender : <span style={{ color: "red" }}> * </span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={patientInfo.gender === "Male"}
                    onChange={handlePatientInfoChange}
                    className="mr-2"
                    required
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={patientInfo.gender === "Female"}
                    onChange={handlePatientInfoChange}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
            </div>
          </section>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block font-semibold mb-1">
              Address : <span style={{ color: "red" }}> * </span>
            </label>
            <textarea
              id="address"
              name="address"
              value={patientInfo.address}
              onChange={handlePatientInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Contact Information */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Contact Number */}
            <div className="mb-4">
              <label
                htmlFor="contactNumber"
                className="block font-semibold mb-1"
              >
                Contact Number : <span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={patientInfo.contactNumber}
                onChange={handlePatientInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold mb-1">
                Email :
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={patientInfo.email}
                  onChange={handlePatientInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mr-2"
                />
                <button
                  type="button"
                  onClick={generateEmail}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="mb-4">
              <label htmlFor="checkupInfo" className="block font-semibold mb-1">
                Chief Complaint : <span style={{ color: "red" }}> * </span>
              </label>
              <select
                id="checkupInfo"
                name="checkupInfo"
                value={patientInfo.checkupInfo}
                onChange={handlePatientInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select reason</option>
                <option value="Routine Check-Up">Routine Check-Up</option>
                {chiefComplaint && chiefComplaint.map((complaint) => (
                  <option key={complaint} value={complaint}>
                    {complaint}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {patientInfo.checkupInfo === "Other" && (
              <div className="mb-4">
                <label
                  htmlFor="otherCheckupInfo"
                  className="block font-semibold mb-1"
                >
                  Specify Other Reason:
                </label>
                <input
                  type="text"
                  id="otherCheckupInfo"
                  name="otherCheckupInfo"
                  value={patientInfo.otherCheckupInfo}
                  onChange={handlePatientInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            )}
          </section>

          {/* Emergency Contact */}
          {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
            Emergency Contact Details
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block font-semibold mb-1"
              >
                Name : <span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={emergencyContact.name}
                onChange={handleEmergencyContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="number"
                className="block font-semibold mb-1"
              >
                Contact Number : <span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                value={emergencyContact.number}
                onChange={handleEmergencyContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="relationship"
                className="block font-semibold mb-1"
              >
                Relationship : <span style={{ color: "red" }}> * </span>
              </label>
              <select
                id="relationship"
                name="relationship"
                value={emergencyContact.relationship}
                onChange={handleEmergencyContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </section> */}
        </div>

        {/* Medical Details */}
        <div className="mx-auto mt-8 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Medical Details
          </h2>

          <section className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <SuspenseWrapper fallback={<div>Loading blood group selection...</div>}>
              <BloodGroupSelect
                value={formData.bloodGroup}
                onChange={handleChange}
              />
            </SuspenseWrapper>


            <SuspenseWrapper fallback={<div>Loading medical history...</div>}>
              <MedicalHistory
                value={formData.medicalHistory}
                onChange={handleMedicalHistoryChange}
              />
            </SuspenseWrapper>

            <PastDentalHistoryTextarea
              value={formData.pastDentalHistory}
              onChange={handlePastDentalHistoryChange}
            />

            <MedicationsSection
              medications={formData.medications}
              onChange={handleNestedChange}
              onAdd={() =>
                addEntry("medications", {
                  name: "",
                  dosage: "",
                  frequency: "",
                })
              }
              onRemove={(index) => removeEntry("medications", index)}
            />

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
              onRemove={(index) => removeEntry("allergies", index)}
            />

            <LifestyleHabitsSection
              data={formData.lifestyleAndHabits}
              onChange={handleNestedPropertyChange}
            />
          </section>
        </div>

        {/* Insurance Information */}
        <div className="mt-8 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
          <h3 className="text-xl font-semibold mb-4">Insurance Information</h3>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="provided"
              name="provided"
              checked={insurance.provided}
              onChange={handleInsuranceChange}
              className="mr-2"
            />
            <label htmlFor="provided" className="block font-semibold">
              Insurance Available?
            </label>
          </div>

          {insurance.provided && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="provider"
                    className="block font-semibold mb-1"
                  >
                    Insurance Provider:
                  </label>
                  <input
                    type="text"
                    id="provider"
                    name="provider"
                    value={insurance.provider}
                    onChange={handleInsuranceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="policyNumber"
                    className="block font-semibold mb-1"
                  >
                    Policy Number:
                  </label>
                  <input
                    type="text"
                    id="policyNumber"
                    name="policyNumber"
                    value={insurance.policyNumber}
                    onChange={handleInsuranceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="primaryPolicyHolderName"
                    className="block font-semibold mb-1"
                  >
                    Primary Policy Holder Name:
                  </label>
                  <input
                    type="text"
                    id="primaryPolicyHolderName"
                    name="primaryPolicyHolderName"
                    value={insurance.primaryPolicyHolderName}
                    onChange={handleInsuranceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="expirationDate"
                    className="block font-semibold mb-1"
                  >
                    Expiration Date:
                  </label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={insurance.expirationDate}
                    onChange={handleInsuranceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </section>

              <div className="mb-4">
                <label
                  htmlFor="coverageDetails"
                  className="block font-semibold mb-1"
                >
                  Coverage Details:
                </label>
                <textarea
                  id="coverageDetails"
                  name="coverageDetails"
                  value={insurance.coverageDetails}
                  onChange={handleInsuranceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* Success and Error Messages */}
        {success && (
          <p className="text-green-500 mt-4 text-center">{success}</p>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
      <ToastContainer />
    </AnimatedContainer>
  );
};

export default EditOpd;