// OPDForm.js

import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
  useCallback,
  useContext,
} from "react";
import API from "../../../services/interceptor";
import { chiefComplaint } from "../../../data";
import user from "../../../assets/image/user.jpg";
import logo from "../../../assets/image/kkgt-header-image.jpg";
import { toast, ToastContainer  } from "react-toastify";
import { Toaster } from "react-hot-toast"
import { AuthContext } from "../../../context/AuthContext";

// Lazy load components
const Loading = lazy(() => import("../../Loading"));
const BloodGroupSelect = lazy(() =>
  import("../Comman/MedicalForm/BloodGroupSelect")
);
const LifestyleHabitsSection = lazy(() =>
  import("../Comman/MedicalForm/LifestyleHabitsSection")
);
const AllergiesSection = lazy(() =>
  import("../Comman/MedicalForm/AllergiesSection")
);
const MedicationsSection = lazy(() =>
  import("../Comman/MedicalForm/MedicationsSection")
);
const PastDentalHistoryTextarea = lazy(() =>
  import("../Comman/MedicalForm/PastDentalHistoryTextarea")
);
const MedicalHistory = lazy(() =>
  import("../Comman/MedicalForm/MedicalHistory")
);

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

const OPDForm = () => {


  const {
      getOPDData,
      getAllPateintData,
      
    } = useContext(AuthContext);


  // Loading state
  const [loading, setLoading] = useState(false);

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
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Memoized OPD number generator
  const generateOpdNumber = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const opd = `OPD-${year[3]}${month}${day}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setPatientInfo((prev) => ({ ...prev, opdNumber: opd }));
  }, []);

  // Auto-generate OPD number on component mount
  useEffect(() => {
    generateOpdNumber();
  }, [generateOpdNumber]);

  // Inside your PastDentalHistoryTextarea component
  useEffect(() => {
    // Update component state or perform necessary actions when patientAge changes
    // This could include re-filtering content based on age or resetting selections
    console.log("Patient age changed:", patientInfo.age);

    // Add your logic here to handle the age change
  }, [patientInfo.age]);

  // Optimized handlers using functional updates
  const handlePatientInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

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

    setPatientInfo((prev) => ({
      ...prev,
      dob: value,
      age: ageNow,
    }));
  }, []);

  const handleEmergencyContactChange = useCallback((e) => {
    const { name, value } = e.target;
    setEmergencyContact((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleInsuranceChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setInsurance((prev) => ({ ...prev, [name]: fieldValue }));
  }, []);

  // Generate email from contact number
  const generateEmail = useCallback(() => {
    const generatedEmail = `${patientInfo.contactNumber}@denteex.com`;
    setPatientInfo((prev) => ({ ...prev, email: generatedEmail }));
  }, [patientInfo.contactNumber]);

  // Handle form data changes
  const handleFormChange = useCallback(() => {
    setIsModified(true);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      handleFormChange();
    },
    [handleFormChange]
  );

  // Handle changes for nested arrays (e.g., medications, allergies)
  const handleNestedChange = useCallback(
    (section, index, field, value) => {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, idx) =>
          idx === index ? { ...item, [field]: value } : item
        ),
      }));
      handleFormChange();
    },
    [handleFormChange]
  );

  // Handle changes for nested objects (e.g., lifestyleAndHabits)
  const handleNestedPropertyChange = useCallback(
    (section, field, value) => {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
      handleFormChange();
    },
    [handleFormChange]
  );

  // Functions to add/remove entries
  const addEntry = useCallback((section, defaultEntry) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultEntry],
    }));
    setIsModified(true);
  }, []);

  const removeEntry = useCallback((section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, idx) => idx !== index),
    }));
    setIsModified(true);
  }, []);

  // Specialized handlers for specific sections
  const handleMedicalHistoryChange = useCallback(
    (updatedHistory) => {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: updatedHistory,
      }));
      handleFormChange();
    },
    [handleFormChange]
  );

  const handlePastDentalHistoryChange = useCallback(
    (newSelectedTeeth) => {
      setFormData((prev) => ({
        ...prev,
        pastDentalHistory: newSelectedTeeth,
      }));
      handleFormChange();
    },
    [handleFormChange]
  );

  // Reset form function
  const resetForm = useCallback(() => {
    setPatientInfo({
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

    setEmergencyContact({
      name: "",
      number: "",
      relationship: "",
    });

    setInsurance({
      provided: false,
      provider: "",
      policyNumber: "",
      coverageDetails: "",
      expirationDate: "",
      primaryPolicyHolderName: "",
    });

    setFormData(INITIAL_FORM_STATE);
    setIsModified(false);

    // Generate a new OPD Number
    generateOpdNumber();
  }, [generateOpdNumber]);

  //Log Tha fromData
  // Add this useEffect to log form data changes
  useEffect(() => {
    console.log("Current Form Data:", {
      basicInfo: {
        opdNumber: patientInfo.opdNumber, // Corrected reference
        fullName: patientInfo.fullName, // Corrected reference
        gender: patientInfo.gender, // Corrected reference
        dob: patientInfo.dob, // Corrected reference
        age: patientInfo.age, // Corrected reference
        address: patientInfo.address, // Corrected reference
        contactNumber: patientInfo.contactNumber, // Corrected reference
        email: patientInfo.email, // Corrected reference
        checkupInfo:
          patientInfo.checkupInfo === "Other"
            ? patientInfo.otherCheckupInfo
            : patientInfo.checkupInfo, // Corrected reference
      },
      medicalDetails: formData,
      insurance: {
        insuranceProvided: insurance.provided, // Corrected reference
        insuranceProvider: insurance.provider, // Corrected reference
        policyNumber: insurance.policyNumber, // Corrected reference
        coverageDetails: insurance.coverageDetails, // Corrected reference
        expirationDate: insurance.expirationDate, // Corrected reference
        primaryPolicyHolderName: insurance.primaryPolicyHolderName, // Corrected reference
      },
      emergencyContact: {
        emergencyContactName: emergencyContact.name, // Corrected reference
        emergencyContactNumber: emergencyContact.number, // Corrected reference
        relationshipToEmergencyContact: emergencyContact.relationship, // Corrected reference
      },
    });
  }, [
    formData,
    patientInfo.opdNumber,
    patientInfo.fullName,
    patientInfo.gender,
    patientInfo.dob,
    patientInfo.age,
    patientInfo.address,
    patientInfo.contactNumber,
    patientInfo.email,
    patientInfo.checkupInfo,
    patientInfo.otherCheckupInfo,
    insurance.provided,
    insurance.provider,
    insurance.policyNumber,
    insurance.coverageDetails,
    insurance.expirationDate,
    insurance.primaryPolicyHolderName,
    emergencyContact.name,
    emergencyContact.number,
    emergencyContact.relationship,
  ]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      
      // Create loading toast
      const toastId = toast.loading("Submitting the OPD Form.....", {
        position: "top-center",
      });
      
      // Collect all data to submit
      const opdFormData = {
        opdNumber: patientInfo.opdNumber,
        age: patientInfo.age,
        checkupInfo:
          patientInfo.checkupInfo === "Other"
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
            name: "NA",
            phone: "NA",
            relationship: "NA",
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
        // Send POST request to API
        const response = await API.post(
          `${process.env.REACT_APP_API_URL}/api/receptionist/opd-form`,
          opdFormData
        );

        getOPDData();
        getAllPateintData();
        
        // Dismiss the loading toast completely
        toast.dismiss(toastId);
        
        // Create a new success toast
        toast.success("OPD Form Submitted Successfully", {
          position: "top-center",
          autoClose: 3000,
        });

       
        
        setSuccess("Form submitted successfully");
        setError("");
        setIsModified(false);
        resetForm();
      } catch (err) {
        console.error("Submission error:", err);
        
        // Dismiss the loading toast completely
        toast.dismiss(toastId);
        
        // Create a new error toast
        toast.error("Failed To Submit OPD Form", {
          position: "top-center",
          autoClose: 3000,
        });
        
        setError("Failed to submit the form. Please try again.");
        setSuccess("");
        setIsModified(false);
      } finally {
        setLoading(false);
      }
    },
    [patientInfo, formData, insurance, resetForm]
  );

  // Memoize sections of the form that don't need frequent re-renders
  const HeaderSection = useMemo(
    () => (
      <header className="flex justify-center items-center mb-6 bg-gradient-to-r from-[#111827] to-[#111827e7] py-4 rounded-lg shadow-lg px-4">
        <div className="flex items-center space-x-3">
          <img src={user} alt="Dental Icon" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-lime-600 text-center">
            OPD Registration Form
          </h1>
          <img src={logo} alt="Tooth Icon" className="h-12 w-12 rounded-full" />
        </div>
      </header>
    ),
    []
  );

  const OpdNumberSection = useMemo(
    () => (
      <div className="mb-4 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
        <label htmlFor="opdNumber" className="block text-xl font-semibold mb-1">
          OPD Number : {patientInfo.opdNumber}
        </label>
      </div>
    ),
    [patientInfo.opdNumber]
  );

  return (
    <AnimatedContainer className="mx-auto p-6">
      {HeaderSection}

      <form onSubmit={handleSubmit}>
        {OpdNumberSection}

        {/* Basic Form Details */}
        <div className="border-b border-gray-300 pb-10 mb-10 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                {chiefComplaint.map((complaint) => (
                  <option key={complaint} value={complaint}>
                    {complaint}
                  </option>
                ))}
                <option value="Other">Others</option>
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

            {/* Blood Group */}
            <Suspense fallback={<div>Loading...</div>}>
              <BloodGroupSelect
                value={formData.bloodGroup}
                onChange={handleChange}
              />
            </Suspense>
          </section>
        </div>

        {/* Medical Details */}
        <div className="mx-auto mt-8 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Medical Details
          </h2>

          <Suspense fallback={<div>Loading medical history components...</div>}>
            <section className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <MedicalHistory
                value={formData.medicalHistory}
                onChange={handleMedicalHistoryChange}
              />

              <PastDentalHistoryTextarea
                key={patientInfo.age} // Adding a key based on age forces re-render when age changes
                value={formData.pastDentalHistory}
                onChange={handlePastDentalHistoryChange}
                patientAge={patientInfo.age}
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
          </Suspense>
        </div>

        {/* Insurance Information */}
        <div className="mt-8">
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

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "submitting..." : "Submit"}
          </button>
        </div>

        {/* Success and Error Messages */}
        {success && (
          <p className="text-green-500 mt-4 text-center">{success}</p>
        )}
        {/* {error && console.log(error)} */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>

      <ToastContainer />
    </AnimatedContainer>
    
    
  );
};

export default OPDForm;
