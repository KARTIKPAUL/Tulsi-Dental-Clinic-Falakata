// // EditOpd.js

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import API from "../../../services/interceptor";
// import BloodGroupSelect from "../Comman/MedicalForm/BloodGroupSelect";
// import MedicationsSection from "../Comman/MedicalForm/MedicationsSection";
// import PastDentalHistoryTextarea from "../Comman/MedicalForm/PastDentalHistoryTextarea";
// import MedicalHistory from "../Comman/MedicalForm/MedicalHistory";
// import AllergiesSection from "../Comman/MedicalForm/AllergiesSection";
// import LifestyleHabitsSection from "../Comman/MedicalForm/LifestyleHabitsSection";
// import Loading from "../../Loading";

// const EditOpd = () => {
//   const { id } = useParams(); // Extract the OPD form ID from the URL
//   const navigate = useNavigate(); // For navigation after successful update

//   // Loading states
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Success and error messages
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Basic Patient Information
//   const [opdNumber, setOpdNumber] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [gender, setGender] = useState("");
//   const [dob, setDob] = useState("");
//   const [age, setAge] = useState("");
//   const [address, setAddress] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [checkupInfo, setCheckupInfo] = useState("");
//   const [otherCheckupInfo, setOtherCheckupInfo] = useState("");
//   const [emergencyContactName, setEmergencyContactName] = useState("");
//   const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
//   const [relationshipToEmergencyContact, setRelationshipToEmergencyContact] =
//     useState("");

//   // Insurance Information
//   const [insuranceProvided, setInsuranceProvided] = useState(false);
//   const [insuranceProvider, setInsuranceProvider] = useState("");
//   const [policyNumber, setPolicyNumber] = useState("");
//   const [coverageDetails, setCoverageDetails] = useState("");
//   const [expirationDate, setExpirationDate] = useState("");
//   const [primaryPolicyHolderName, setPrimaryPolicyHolderName] = useState("");

//   // Medical Details State
//   const [formData, setFormData] = useState({
//     bloodGroup: "",
//     medicalHistory: "",
//     medications: [{ name: "", dosage: "", frequency: "" }],
//     allergies: [{ allergen: "", reaction: "", severity: "" }],
//     lifestyleAndHabits: { smokingStatus: "", alcoholUse: "", tobacco: "" },
//     pastDentalHistory: "",
//     notes: "",
//   });
//   const [isModified, setIsModified] = useState(false);

//   // Function to generate OPD number (optional if OPD number is auto-generated on backend)
//   const generateOpdNumber = () => {
//     const today = new Date();
//     const year = today.getFullYear().toString(); // Convert year to string
//     const month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (MM) and pad if necessary
//     const day = String(today.getDate()).padStart(2, "0"); // Get day (DD) and pad if necessary

//     const opd = `OPD-${year[3]}${month}${day}-${Math.floor(
//       1000 + Math.random() * 9000
//     )}`;
//     setOpdNumber(opd);
//   };

//   // Auto-generate OPD number on component mount (if needed)
//   useEffect(() => {
//     generateOpdNumber();
//   }, []);

//   // Fetch existing OPD form data
//   useEffect(() => {
//     const fetchOpdForm = async () => {
//       try {
//         const response = await API.get(
//           `${process.env.REACT_APP_API_URL}/api/doctor/details/${id}`
//         );
//         const opdForm = response.data;
//         console.log(opdForm);

//         // Populate basic patient information
//         setOpdNumber(opdForm.opdNumber || "");
//         setFullName(opdForm.userDetails?.name || "");
//         setGender(opdForm.userDetails?.gender || "");
//         setDob(
//           opdForm.userDetails?.dateOfBirth
//             ? opdForm.userDetails.dateOfBirth.substring(0, 10)
//             : ""
//         );
//         setAge(opdForm.age || "");
//         setAddress(opdForm.userDetails?.contact?.address || "");
//         setContactNumber(opdForm.userDetails?.contact?.mobile || "");
//         setEmail(opdForm.userDetails?.contact?.email || "");
//         setCheckupInfo(opdForm.checkupInfo || "");
//         setOtherCheckupInfo(
//           opdForm.checkupInfo === "Other" ? opdForm.checkupInfo : ""
//         );
//         setEmergencyContactName(
//           opdForm.userDetails?.emergencyContact?.name || ""
//         );
//         setEmergencyContactNumber(
//           opdForm.userDetails?.emergencyContact?.phone || ""
//         );
//         setRelationshipToEmergencyContact(
//           opdForm.userDetails?.emergencyContact?.relationship || ""
//         );

//         // Populate insurance information if available
//         if (opdForm.insuranceDetails) {
//           setInsuranceProvided(
//             opdForm.insuranceDetails.insuranceProvided || false
//           );
//           setInsuranceProvider(
//             opdForm.insuranceDetails.insuranceProvider || ""
//           );
//           setPolicyNumber(opdForm.insuranceDetails.policyNumber || "");
//           setCoverageDetails(opdForm.insuranceDetails.coverageDetails || "");
//           setExpirationDate(
//             opdForm.insuranceDetails.expirationDate
//               ? opdForm.insuranceDetails.expirationDate.substring(0, 10)
//               : ""
//           );
//           setPrimaryPolicyHolderName(
//             opdForm.insuranceDetails.primaryPolicyHolderName || ""
//           );
//         } else {
//           // Set default values if insuranceDetails is not present
//           setInsuranceProvided(false);
//           setInsuranceProvider("");
//           setPolicyNumber("");
//           setCoverageDetails("");
//           setExpirationDate("");
//           setPrimaryPolicyHolderName("");
//         }

//         // Populate medical details
//         setFormData({
//           bloodGroup: opdForm.medicalDetails?.bloodGroup || "",
//           medicalHistory: opdForm.medicalDetails?.medicalHistory || "",
//           medications:
//             opdForm.medicalDetails?.medications.length > 0
//               ? opdForm.medicalDetails.medications
//               : [{ name: "", dosage: "", frequency: "" }],
//           allergies:
//             opdForm.medicalDetails?.allergies.length > 0
//               ? opdForm.medicalDetails.allergies
//               : [{ allergen: "", reaction: "", severity: "" }],
//           lifestyleAndHabits: opdForm.medicalDetails?.lifestyleAndHabits || {
//             smokingStatus: "",
//             alcoholUse: "",
//             tobacco: "",
//           },
//           pastDentalHistory: opdForm.medicalDetails?.pastDentalHistory || "",
//           notes: opdForm.medicalDetails?.notes || "",
//         });

//         setInitialLoading(false);
//       } catch (err) {
//         console.error("Error fetching OPD form:", err.message);
//         setError("Failed to load the form. Please try again.");
//         setInitialLoading(false);
//       }
//     };

//     fetchOpdForm();
//   }, [id]);

//   const handleInsuranceToggle = () => {
//     setInsuranceProvided(!insuranceProvided);
//     setIsModified(true);
//   };

//   // Handle changes for medical details form
//   const handleFormChange = () => {
//     setIsModified(true);
//   };

//   // Handle changes for top-level properties
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     handleFormChange();
//   };

//   // Handle changes for nested arrays (e.g., medications, allergies)
//   // const handleNestedChange = (e, section, index, field) => {
//   //     const updatedSection = formData[section].map((item, idx) =>
//   //         idx === index ? { ...item, [field]: e.target.value } : item
//   //     );
//   //     setFormData({ ...formData, [section]: updatedSection });
//   //     handleFormChange();
//   // };

//   // Handler for nested array changes (medications, allergies)
//   const handleNestedChange = (section, index, field, value) => {
//     setFormData((prevData) => {
//       const updatedSection = prevData[section].map((item, idx) =>
//         idx === index ? { ...item, [field]: value } : item
//       );
//       return { ...prevData, [section]: updatedSection };
//     });
//     setIsModified(true);
//   };

//   // Handle changes for nested objects (e.g., lifestyleAndHabits)
//   const handleNestedPropertyChange = (section, field, value) => {
//     setFormData({
//       ...formData,
//       [section]: {
//         ...formData[section],
//         [field]: value,
//       },
//     });
//     handleFormChange();
//   };

//   // Add new entry to a section
//   const addEntry = (section, defaultEntry) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [section]: [...prevData[section], defaultEntry],
//     }));
//     setIsModified(true);
//   };

//   // Remove entry from a section
//   const removeEntry = (section, index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [section]: prevData[section].filter((_, idx) => idx !== index),
//     }));
//     setIsModified(true);
//   };

//   // Functions to add/remove medications and allergies
//   const addMedication = () => {
//     setFormData({
//       ...formData,
//       medications: [
//         ...formData.medications,
//         { name: "", dosage: "", frequency: "" },
//       ],
//     });
//     handleFormChange();
//   };

//   const removeMedication = (index) => {
//     setFormData({
//       ...formData,
//       medications: formData.medications.filter((_, idx) => idx !== index),
//     });
//     handleFormChange();
//   };

//   const addAllergy = () => {
//     setFormData({
//       ...formData,
//       allergies: [
//         ...formData.allergies,
//         { allergen: "", reaction: "", severity: "" },
//       ],
//     });
//     handleFormChange();
//   };

//   const removeAllergy = (index) => {
//     setFormData({
//       ...formData,
//       allergies: formData.allergies.filter((_, idx) => idx !== index),
//     });
//     handleFormChange();
//   };

//   // Function to reset the form fields
//   const resetForm = () => {
//     setFullName("");
//     setGender("");
//     setDob("");
//     setAge("");
//     setAddress("");
//     setContactNumber("");
//     setEmail("");
//     setCheckupInfo("");
//     setOtherCheckupInfo("");
//     setEmergencyContactName("");
//     setEmergencyContactNumber("");
//     setRelationshipToEmergencyContact("");
//     setInsuranceProvided(false);
//     setInsuranceProvider("");
//     setPolicyNumber("");
//     setCoverageDetails("");
//     setExpirationDate("");
//     setPrimaryPolicyHolderName("");
//     setFormData({
//       bloodGroup: "",
//       medicalHistory: "",
//       medications: [{ name: "", dosage: "", frequency: "" }],
//       allergies: [{ allergen: "", reaction: "", severity: "" }],
//       lifestyleAndHabits: { smokingStatus: "", alcoholUse: "", tobacco: "" },
//       pastDentalHistory: "",
//       notes: "",
//     });
//     setIsModified(false);
//     // Generate a new OPD Number (optional)
//     generateOpdNumber();
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Collect all data to submit
//     const opdFormData = {
//       opdNumber,
//       age,
//       checkupInfo: checkupInfo === "Other" ? otherCheckupInfo : checkupInfo,
//       medicalDetails: formData,
//       userDetails: {
//         name: fullName,
//         gender,
//         dateOfBirth: dob,
//         contact: {
//           mobile: contactNumber,
//           email,
//           address,
//         },
//         emergencyContact: {
//           name: emergencyContactName,
//           phone: emergencyContactNumber,
//           relationship: relationshipToEmergencyContact,
//         },
//       },
//       insuranceDetails: {
//         insuranceProvided,
//         insuranceProvider,
//         policyNumber,
//         coverageDetails,
//         expirationDate,
//         primaryPolicyHolderName,
//       },
//     };

//     try {
//       // Send PUT request to API
//       const response = await API.put(
//         `${process.env.REACT_APP_API_URL}/api/doctor/opd/${id}`,
//         opdFormData
//       );

//       // Optionally navigate to another page
//       // navigate(`/dashboard/edit-opd/${id}`); // Redirect to the OPD form details page

//       toast.success("Form Updated Successfully", {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//       });
//       // Handle success
//       // console.log('Form updated:', response.data);
//       setSuccess("Form updated successfully");
//       setError("");
//       setIsModified(false);
//       setLoading(false);
//     } catch (err) {
//       // Handle error
//       console.error(err);
//       if (err.response && err.response.data && err.response.data.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Failed to update the form. Please try again.");
//       }
//       setSuccess("");
//       setIsModified(false);
//       setLoading(false);
//       toast.error("Failed to Update Form", {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//       });
//     }
//   };

//   return (
//     <div className="mx-auto p-6 bg-white shadow-md rounded-lg ">
//       <h2 className="text-2xl font-bold text-center mb-6">
//         Edit OPD Registration Form
//       </h2>

//       {initialLoading ? (
//         <Loading />
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {/* OPD Number */}
//           <div className="mb-4">
//             <label htmlFor="opdNumber" className="block font-semibold mb-1">
//               OPD Number:
//             </label>
//             <input
//               type="text"
//               id="opdNumber"
//               value={opdNumber}
//               readOnly
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
//             />
//           </div>

//           {/* Basic Form Details */}
//           <div className="border-b border-gray-300 pb-10 mb-10">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-12">
//               Patient Personal Details
//             </h2>

//             {/* Full Name */}
//             <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="mb-4">
//                 <label htmlFor="fullName" className="block font-semibold mb-1">
//                   Full Name:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="fullName"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               {/* Date of Birth */}
//               <div className="mb-4">
//                 <label htmlFor="dob" className="block font-semibold mb-1">
//                   Date of Birth:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="dob"
//                   value={dob}
//                   onChange={(e) => {
//                     setDob(e.target.value);
//                     // Calculate age
//                     const today = new Date();
//                     const birthDate = new Date(e.target.value);
//                     let ageNow = today.getFullYear() - birthDate.getFullYear();
//                     const m = today.getMonth() - birthDate.getMonth();
//                     if (
//                       m < 0 ||
//                       (m === 0 && today.getDate() < birthDate.getDate())
//                     ) {
//                       ageNow--;
//                     }
//                     setAge(ageNow);
//                     setIsModified(true);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               {/* Gender */}
//               <div className="mb-4">
//                 <label className="block font-semibold mb-1">
//                   Gender:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Male"
//                       checked={gender === "Male"}
//                       onChange={(e) => {
//                         setGender(e.target.value);
//                         setIsModified(true);
//                       }}
//                       className="mr-2"
//                       required
//                     />
//                     Male
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Female"
//                       checked={gender === "Female"}
//                       onChange={(e) => {
//                         setGender(e.target.value);
//                         setIsModified(true);
//                       }}
//                       className="mr-2"
//                     />
//                     Female
//                   </label>
//                 </div>
//               </div>

//               {/* Age */}
//               <div className="mb-4">
//                 <label htmlFor="age" className="block font-semibold mb-1">
//                   Age:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="age"
//                   value={age}
//                   onChange={(e) => setAge(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                   readOnly
//                 />
//               </div>
//             </section>

//             {/* Contact Information */}
//             <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Contact Number */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="contactNumber"
//                   className="block font-semibold mb-1"
//                 >
//                   Contact Number:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="contactNumber"
//                   value={contactNumber}
//                   onChange={(e) => {
//                     setContactNumber(e.target.value);
//                     setIsModified(true);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="mb-4">
//                 <label htmlFor="email" className="block font-semibold mb-1">
//                   Email:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setIsModified(true);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             </section>

//             {/* Address */}
//             <div className="mb-4 ">
//               <label htmlFor="address" className="block font-semibold mb-1">
//                 Address:<span style={{ color: "red" }}>*</span>
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 value={address}
//                 onChange={(e) => {
//                   setAddress(e.target.value);
//                   setIsModified(true);
//                 }}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>

//             {/* Emergency Contact */}
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-12 ">
//               Emergency Contact Details
//             </h2>
//             <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
//               <div className="mb-4">
//                 <label
//                   htmlFor="emergencyContactName"
//                   className="block font-semibold mb-1"
//                 >
//                   Name:<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="emergencyContactName"
//                   value={emergencyContactName}
//                   onChange={(e) => {
//                     setEmergencyContactName(e.target.value);
//                     setIsModified(true);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="emergencyContactNumber"
//                   className="block font-semibold mb-1"
//                 >
//                   Contact Number :<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="emergencyContactNumber"
//                   value={emergencyContactNumber}
//                   onChange={(e) => {
//                     setEmergencyContactNumber(e.target.value);
//                     setIsModified(true);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
//             </section>

//             <div className="mb-4">
//               <label
//                 htmlFor="relationshipToEmergencyContact"
//                 className="block font-semibold mb-1"
//               >
//                 Relationship:<span style={{ color: "red" }}>*</span>
//               </label>
//               <select
//                 id="relationshipToEmergencyContact"
//                 value={relationshipToEmergencyContact}
//                 onChange={(e) => {
//                   setRelationshipToEmergencyContact(e.target.value);
//                   setIsModified(true);
//                 }}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select relationship</option>
//                 <option value="Spouse">Spouse</option>
//                 <option value="Parent">Parent</option>
//                 <option value="Child">Child</option>
//                 <option value="Friend">Friend</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Chief Complaint */}
//             <div className="mb-4">
//               <label htmlFor="checkupInfo" className="block font-semibold mb-1">
//                 Chief Complaint:{" "}
//                 <span className="text-gray-600">{checkupInfo}</span>
//               </label>
//               <select
//                 id="checkupInfo"
//                 value={checkupInfo}
//                 onChange={(e) => {
//                   setCheckupInfo(e.target.value);
//                   if (e.target.value !== "Other") {
//                     setOtherCheckupInfo("");
//                   }
//                   setIsModified(true);
//                 }}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select reason</option>
//                 <option value="Routine Check-Up">Routine Check-Up</option>
//                 <option value="Cleaning">Cleaning</option>
//                 <option value="Fillings">Fillings</option>
//                 <option value="Extraction">Extraction</option>
//                 <option value="Orthodontics">Orthodontics</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {checkupInfo === "Other" && (
//               <div className="mb-4">
//                 <label
//                   htmlFor="otherCheckupInfo"
//                   className="block font-semibold mb-1"
//                 >
//                   Specify Other Reason:
//                 </label>
//                 <input
//                   type="text"
//                   id="otherCheckupInfo"
//                   value={otherCheckupInfo}
//                   onChange={(e) => {
//                     setOtherCheckupInfo(e.target.value);
//                     setIsModified(true);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
//             )}
//           </div>

//           {/*Patient Medical Details */}
//           <div className="mx-auto mt-8">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//               Patient Medical Details
//             </h2>
//             {/* Medical Details Section */}
//             <section className="grid grid-cols-1 sm:grid-cols-1 gap-4">
//               {/* Blood Group */}
//               <BloodGroupSelect
//                 value={formData.bloodGroup}
//                 onChange={handleChange}
//               />
//               <MedicalHistory
//                 value={formData.medicalHistory}
//                 onChange={handleChange}
//               />

//               <PastDentalHistoryTextarea
//                 value={formData.pastDentalHistory}
//                 onChange={handleChange}
//               />

//               <MedicationsSection
//                 medications={formData.medications}
//                 onChange={handleNestedChange}
//                 onAdd={() =>
//                   addEntry("medications", {
//                     name: "",
//                     dosage: "",
//                     frequency: "",
//                     startDate: "",
//                     endDate: "",
//                   })
//                 }
//                 onRemove={removeEntry}
//               />
//               <AllergiesSection
//                 allergies={formData.allergies}
//                 onChange={handleNestedChange}
//                 onAdd={() =>
//                   addEntry("allergies", {
//                     allergen: "",
//                     reaction: "",
//                     severity: "",
//                   })
//                 }
//                 onRemove={removeEntry}
//               />
//               <LifestyleHabitsSection
//                 data={formData.lifestyleAndHabits}
//                 onChange={handleNestedPropertyChange}
//               />
//               {/* <div>
//                             <label htmlFor="bloodGroup" className="block text-gray-600 mb-1">
//                                 Blood Group:
//                             </label>
//                             <select
//                                 id="bloodGroup"
//                                 name="bloodGroup"
//                                 value={formData.bloodGroup}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                                 <option value="" disabled>
//                                     Select Blood Group
//                                 </option>
//                                 {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
//                                     <option key={group} value={group}>
//                                         {group}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div> */}

//               {/* Medical History */}
//               {/* <div>
//                             <label htmlFor="medicalHistory" className="block text-gray-600 mb-1">
//                                 Medical History:
//                             </label>
//                             <textarea
//                                 id="medicalHistory"
//                                 name="medicalHistory"
//                                 value={formData.medicalHistory}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div> */}

//               {/* Medications */}
//               {/* <div className="col-span-2 mt-4">
//                             <h3 className="text-lg font-semibold">Medications:</h3>
//                             {formData.medications.map((med, idx) => (
//                                 <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
//                                     <input
//                                         placeholder="Name"
//                                         value={med.name}
//                                         onChange={(e) => handleNestedChange(e, 'medications', idx, 'name')}
//                                         className="p-2 border border-gray-300 rounded-md"
//                                     />
//                                     <input
//                                         placeholder="Dosage"
//                                         value={med.dosage}
//                                         onChange={(e) => handleNestedChange(e, 'medications', idx, 'dosage')}
//                                         className="p-2 border border-gray-300 rounded-md"
//                                     />
//                                     <input
//                                         placeholder="Frequency"
//                                         value={med.frequency}
//                                         onChange={(e) => handleNestedChange(e, 'medications', idx, 'frequency')}
//                                         className="p-2 border border-gray-300 rounded-md"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => removeMedication(idx)}
//                                         className="text-red-500 hover:text-red-700 font-bold"
//                                     >
//                                         &#10005;
//                                     </button>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={addMedication}
//                                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
//                             >
//                                 Add Medication
//                             </button>
//                         </div> */}

//               {/* Allergies */}
//               {/* <div className="col-span-2 mt-4">
//                             <h3 className="text-lg font-semibold">Allergies:</h3>
//                             {formData.allergies.map((allergy, idx) => (
//                                 <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
//                                     <input
//                                         placeholder="Allergen"
//                                         value={allergy.allergen}
//                                         onChange={(e) => handleNestedChange(e, 'allergies', idx, 'allergen')}
//                                         className="p-2 border border-gray-300 rounded-md"
//                                     />
//                                     <input
//                                         placeholder="Reaction"
//                                         value={allergy.reaction}
//                                         onChange={(e) => handleNestedChange(e, 'allergies', idx, 'reaction')}
//                                         className="p-2 border border-gray-300 rounded-md"
//                                     />
//                                     <select
//                                         value={allergy.severity}
//                                         onChange={(e) => handleNestedChange(e, 'allergies', idx, 'severity')}
//                                         className="p-2 border border-gray-300 rounded-md"
//                                     >
//                                         <option value="" disabled>
//                                             Select Severity
//                                         </option>
//                                         {['Mild', 'Moderate', 'Severe'].map((severity) => (
//                                             <option key={severity} value={severity}>
//                                                 {severity}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <button
//                                         type="button"
//                                         onClick={() => removeAllergy(idx)}
//                                         className="text-red-500 hover:text-red-700 font-bold"
//                                     >
//                                         &#10005;
//                                     </button>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={addAllergy}
//                                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
//                             >
//                                 Add Allergy
//                             </button>
//                         </div> */}

//               {/* Lifestyle and Habits */}
//               {/* <div className="col-span-2 mt-4">
//                             <h3 className="text-lg font-semibold">Lifestyle and Habits:</h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                                 <div>
//                                     <label htmlFor="smokingStatus" className="block text-gray-600 mb-1">
//                                         Smoking Status:
//                                     </label>
//                                     <select
//                                         id="smokingStatus"
//                                         value={formData.lifestyleAndHabits.smokingStatus}
//                                         onChange={(e) => handleNestedPropertyChange(e, 'lifestyleAndHabits', 'smokingStatus')}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     >
//                                         <option value="" disabled>
//                                             Select Smoking Status
//                                         </option>
//                                         {['Current', 'Former', 'Never'].map((status) => (
//                                             <option key={status} value={status}>
//                                                 {status}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label htmlFor="alcoholUse" className="block text-gray-600 mb-1">
//                                         Alcohol Use:
//                                     </label>
//                                     <select
//                                         id="alcoholUse"
//                                         value={formData.lifestyleAndHabits.alcoholUse}
//                                         onChange={(e) => handleNestedPropertyChange(e, 'lifestyleAndHabits', 'alcoholUse')}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     >
//                                         <option value="" disabled>
//                                             Select Alcohol Use
//                                         </option>
//                                         {['No', 'Moderate', 'Habitual'].map((option) => (
//                                             <option key={option} value={option}>
//                                                 {option}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label htmlFor="tobacco" className="block text-gray-600 mb-1">
//                                         Tobacco / Gutka(Kharra):
//                                     </label>
//                                     <input
//                                         id="tobacco"
//                                         value={formData.lifestyleAndHabits.tobacco}
//                                         onChange={(e) => handleNestedPropertyChange(e, 'lifestyleAndHabits', 'tobacco')}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                 </div>
//                             </div>
//                         </div> */}

//               {/* Past Dental History */}
//               {/* <div className="col-span-2 mt-4">
//                             <label htmlFor="pastDentalHistory" className="block text-gray-600 mb-1">
//                                 Past Dental History:
//                             </label>
//                             <textarea
//                                 id="pastDentalHistory"
//                                 name="pastDentalHistory"
//                                 value={formData.pastDentalHistory}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div> */}

//               {/* Notes */}
//               {/* <div className="col-span-2 mt-4">
//                             <label htmlFor="notes" className="block text-gray-600 mb-1">
//                                 Notes:
//                             </label>
//                             <textarea
//                                 id="notes"
//                                 name="notes"
//                                 value={formData.notes}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div> */}
//             </section>
//           </div>

//           {/* Insurance Information */}
//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-4">
//               Insurance Information
//             </h3>
//             <div className="mb-4 flex items-center">
//               <input
//                 type="checkbox"
//                 id="insuranceProvided"
//                 checked={insuranceProvided}
//                 onChange={handleInsuranceToggle}
//                 className="mr-2"
//               />
//               <label
//                 htmlFor="insuranceProvided"
//                 className="block font-semibold"
//               >
//                 Insurance Available?
//               </label>
//             </div>

//             {insuranceProvided && (
//               <>
//                 <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="mb-4">
//                     <label
//                       htmlFor="insuranceProvider"
//                       className="block font-semibold mb-1"
//                     >
//                       Insurance Provider:
//                     </label>
//                     <input
//                       type="text"
//                       id="insuranceProvider"
//                       name="insuranceProvider"
//                       value={insuranceProvider}
//                       onChange={(e) => {
//                         setInsuranceProvider(e.target.value);
//                         setIsModified(true);
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>

//                   <div className="mb-4">
//                     <label
//                       htmlFor="policyNumber"
//                       className="block font-semibold mb-1"
//                     >
//                       Policy Number:
//                     </label>
//                     <input
//                       type="text"
//                       id="policyNumber"
//                       name="policyNumber"
//                       value={policyNumber}
//                       onChange={(e) => {
//                         setPolicyNumber(e.target.value);
//                         setIsModified(true);
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>

//                   <div className="mb-4">
//                     <label
//                       htmlFor="primaryPolicyHolderName"
//                       className="block font-semibold mb-1"
//                     >
//                       Primary Policy Holder Name:
//                     </label>
//                     <input
//                       type="text"
//                       id="primaryPolicyHolderName"
//                       name="primaryPolicyHolderName"
//                       value={primaryPolicyHolderName}
//                       onChange={(e) => {
//                         setPrimaryPolicyHolderName(e.target.value);
//                         setIsModified(true);
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>

//                   <div className="mb-4">
//                     <label
//                       htmlFor="expirationDate"
//                       className="block font-semibold mb-1"
//                     >
//                       Expiration Date:
//                     </label>
//                     <input
//                       type="date"
//                       id="expirationDate"
//                       name="expirationDate"
//                       value={expirationDate}
//                       onChange={(e) => {
//                         setExpirationDate(e.target.value);
//                         setIsModified(true);
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>
//                 </section>

//                 <div className="mb-4">
//                   <label
//                     htmlFor="coverageDetails"
//                     className="block font-semibold mb-1"
//                   >
//                     Coverage Details:
//                   </label>
//                   <textarea
//                     id="coverageDetails"
//                     name="coverageDetails"
//                     value={coverageDetails}
//                     onChange={(e) => {
//                       setCoverageDetails(e.target.value);
//                       setIsModified(true);
//                     }}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center mt-8">
//             <button
//               type="submit"
//               className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={loading}
//             >
//               {loading ? "Updating..." : "Update"}
//             </button>
//           </div>

//           {/* Success and Error Messages */}
//           {success && (
//             <p className="text-green-500 mt-4 text-center">{success}</p>
//           )}
//           {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
//         </form>
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default EditOpd;






// 2nd attend:




import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
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
    setPatientInfo(prev => ({ ...prev, [name]: value }));
    setIsModified(true);
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

  // Handle medical form data changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    handleFormChange();
  }, [handleFormChange]);

  // Handle changes for nested arrays (e.g., medications, allergies)
  const handleNestedChange = useCallback((section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    }));
    handleFormChange();
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
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
          </section>
        </div>

        {/* Medical Details */}
        <div className="mx-auto mt-8 shadow-md rounded-lg bg-gradient-to-r from-white to-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Medical Details
          </h2>
          
          <Suspense fallback={<div>Loading medical history components...</div>}>
            <section className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <BloodGroupSelect
                value={formData.bloodGroup}
                onChange={handleChange}
              />
              
              <MedicalHistory
                value={formData.medicalHistory}
                onChange={handleMedicalHistoryChange}
              />

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
          </Suspense>
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
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
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