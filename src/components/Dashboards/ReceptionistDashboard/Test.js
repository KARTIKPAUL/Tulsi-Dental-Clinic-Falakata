// OPDForm.js

import axios from 'axios'; 
import React, { useState, useEffect } from 'react';

const OPDForm = () => {
    // Loading state
    const [loading, setLoading] = useState(false);

    // Basic Patient Information
    const [opdNumber, setOpdNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [checkupInfo, setCheckupInfo] = useState('');
    const [otherCheckupInfo, setOtherCheckupInfo] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
    const [relationshipToEmergencyContact, setRelationshipToEmergencyContact] = useState('');

    // Insurance Information
    const [insuranceProvided, setInsuranceProvided] = useState(false);
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [coverageDetails, setCoverageDetails] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [primaryPolicyHolderName, setPrimaryPolicyHolderName] = useState('');

    // Medical Details State
    const [formData, setFormData] = useState({
        bloodGroup: '',
        medicalHistory: '',
        medications: [{ name: '', dosage: '', frequency: '' }],
        allergies: [{ allergen: '', reaction: '', severity: '' }],
        lifestyleAndHabits: { smokingStatus: '', alcoholUse: '', tobacco: '' },
        pastDentalHistory: '',
        notes: '',
    });
    const [isModified, setIsModified] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to generate OPD number
    const generateOpdNumber = () => {
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const opd = `OPD-${year.slice(-2)}${month}${day}-${Math.floor(1000 + Math.random() * 9000)}`;
        setOpdNumber(opd);
    };

    // Auto-generate OPD number on component mount
    useEffect(() => {
        generateOpdNumber();
    }, []);

    const handleInsuranceToggle = () => {
        setInsuranceProvided(!insuranceProvided);
    };

    const handleFormChange = () => {
        setIsModified(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        handleFormChange();
    };

    const handleNestedChange = (e, section, index, field) => {
        const updatedSection = formData[section].map((item, idx) =>
            idx === index ? { ...item, [field]: e.target.value } : item
        );
        setFormData({ ...formData, [section]: updatedSection });
        handleFormChange();
    };

    const handleNestedPropertyChange = (e, section, field) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: e.target.value,
            },
        });
        handleFormChange();
    };

    const addMedication = () => {
        setFormData({
            ...formData,
            medications: [...formData.medications, { name: '', dosage: '', frequency: '' }],
        });
        handleFormChange();
    };

    const removeMedication = (index) => {
        setFormData({
            ...formData,
            medications: formData.medications.filter((_, idx) => idx !== index),
        });
        handleFormChange();
    };

    const addAllergy = () => {
        setFormData({
            ...formData,
            allergies: [...formData.allergies, { allergen: '', reaction: '', severity: '' }],
        });
        handleFormChange();
    };

    const removeAllergy = (index) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter((_, idx) => idx !== index),
        });
        handleFormChange();
    };

    const resetForm = () => {
        setFullName('');
        setGender('');
        setDob('');
        setAge('');
        setAddress('');
        setContactNumber('');
        setEmail('');
        setCheckupInfo('');
        setOtherCheckupInfo('');
        setEmergencyContactName('');
        setEmergencyContactNumber('');
        setRelationshipToEmergencyContact('');
        setInsuranceProvided(false);
        setInsuranceProvider('');
        setPolicyNumber('');
        setCoverageDetails('');
        setExpirationDate('');
        setPrimaryPolicyHolderName('');
        setFormData({
            bloodGroup: '',
            medicalHistory: '',
            medications: [{ name: '', dosage: '', frequency: '' }],
            allergies: [{ allergen: '', reaction: '', severity: '' }],
            lifestyleAndHabits: { smokingStatus: '', alcoholUse: '', tobacco: '' },
            pastDentalHistory: '',
            notes: '',
        });
        setIsModified(false);
        generateOpdNumber();
        setError('');
        setSuccess('');
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await API.post('/api/submit-opd-form', {
                opdNumber,
                fullName,
                gender,
                dob,
                age,
                address,
                contactNumber,
                email,
                checkupInfo,
                otherCheckupInfo,
                emergencyContactName,
                emergencyContactNumber,
                relationshipToEmergencyContact,
                insuranceProvided,
                insuranceProvider,
                policyNumber,
                coverageDetails,
                expirationDate,
                primaryPolicyHolderName,
                formData
            });
            
            if (response.data.success) {
                setSuccess('Form submitted successfully!');
                resetForm();
            } else {
                setError('Form submission failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white shadow-md rounded-lg max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-6">OPD Registration Form</h2>

            <form onSubmit={handleSubmit}>
                {/* OPD Number */}
                <div className="mb-4">
                    <label htmlFor="opdNumber" className="block font-semibold mb-1">
                        OPD Number:
                    </label>
                    <input
                        type="text"
                        id="opdNumber"
                        value={opdNumber}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                </div>

                {/* Basic Form Details */}
                <div className="border-b border-gray-300 pb-10 mb-10">
                    {/* Full Name */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block font-semibold mb-1">
                                Full Name:
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="mb-4">
                            <label htmlFor="dob" className="block font-semibold mb-1">
                                Date of Birth:
                            </label>
                            <input
                                type="date"
                                id="dob"
                                value={dob}
                                onChange={(e) => {
                                    setDob(e.target.value);
                                    // Calculate age
                                    const today = new Date();
                                    const birthDate = new Date(e.target.value);
                                    let ageNow = today.getFullYear() - birthDate.getFullYear();
                                    const m = today.getMonth() - birthDate.getMonth();
                                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                        ageNow--;
                                    }
                                    setAge(ageNow);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Gender:</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Male"
                                        checked={gender === 'Male'}
                                        onChange={(e) => setGender(e.target.value)}
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
                                        checked={gender === 'Female'}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="mr-2"
                                    />
                                    Female
                                </label>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="mb-4">
                            <label htmlFor="age" className="block font-semibold mb-1">
                                Age:
                            </label>
                            <input
                                type="number"
                                id="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                readOnly
                            />
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Contact Number */}
                        <div className="mb-4">
                            <label htmlFor="contactNumber" className="block font-semibold mb-1">
                                Contact Number:
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block font-semibold mb-1">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </section>

                    {/* Address */}
                    <div className="mb-4">
                        <label htmlFor="address" className="block font-semibold mb-1">
                            Address:
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Emergency Contact */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="emergencyContactName" className="block font-semibold mb-1">
                                Emergency Contact Name:
                            </label>
                            <input
                                type="text"
                                id="emergencyContactName"
                                value={emergencyContactName}
                                onChange={(e) => setEmergencyContactName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="emergencyContactNumber" className="block font-semibold mb-1">
                                Emergency Contact Number:
                            </label>
                            <input
                                type="tel"
                                id="emergencyContactNumber"
                                value={emergencyContactNumber}
                                onChange={(e) => setEmergencyContactNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </section>

                    <div className="mb-4">
                        <label htmlFor="relationshipToEmergencyContact" className="block font-semibold mb-1">
                            Relationship to Emergency Contact:
                        </label>
                        <select
                            id="relationshipToEmergencyContact"
                            value={relationshipToEmergencyContact}
                            onChange={(e) => setRelationshipToEmergencyContact(e.target.value)}
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

                    {/* Chief Complaint */}
                    <div className="mb-4">
                        <label htmlFor="checkupInfo" className="block font-semibold mb-1">
                            Chief Complaint:
                        </label>
                        <select
                            id="checkupInfo"
                            value={checkupInfo}
                            onChange={(e) => setCheckupInfo(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">Select reason</option>
                            <option value="Routine Check-Up">Routine Check-Up</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Fillings">Fillings</option>
                            <option value="Extraction">Extraction</option>
                            <option value="Orthodontics">Orthodontics</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {checkupInfo === 'Other' && (
                        <div className="mb-4">
                            <label htmlFor="otherCheckupInfo" className="block font-semibold mb-1">
                                Specify Other Reason:
                            </label>
                            <input
                                type="text"
                                id="otherCheckupInfo"
                                value={otherCheckupInfo}
                                onChange={(e) => setOtherCheckupInfo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Medical Details */}
                <div className="mx-auto mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Medical Details</h2>
                    {/* Medical Details Section */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Blood Group */}
                        <div>
                            <label htmlFor="bloodGroup" className="block text-gray-600 mb-1">
                                Blood Group:
                            </label>
                            <select
                                id="bloodGroup"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="" disabled>
                                    Select Blood Group
                                </option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Medical History */}
                        <div>
                            <label htmlFor="medicalHistory" className="block text-gray-600 mb-1">
                                Medical History:
                            </label>
                            <textarea
                                id="medicalHistory"
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Medications */}
                        <div className="col-span-2 mt-4">
                            <h3 className="text-lg font-semibold">Medications:</h3>
                            {formData.medications.map((med, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
                                    <input
                                        placeholder="Name"
                                        value={med.name}
                                        onChange={(e) => handleNestedChange(e, 'medications', idx, 'name')}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        placeholder="Dosage"
                                        value={med.dosage}
                                        onChange={(e) => handleNestedChange(e, 'medications', idx, 'dosage')}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        placeholder="Frequency"
                                        value={med.frequency}
                                        onChange={(e) => handleNestedChange(e, 'medications', idx, 'frequency')}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeMedication(idx)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMedication}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                            >
                                Add Medication
                            </button>
                        </div>

                        {/* Allergies */}
                        <div className="col-span-2 mt-4">
                            <h3 className="text-lg font-semibold">Allergies:</h3>
                            {formData.allergies.map((allergy, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
                                    <input
                                        placeholder="Allergen"
                                        value={allergy.allergen}
                                        onChange={(e) => handleNestedChange(e, 'allergies', idx, 'allergen')}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        placeholder="Reaction"
                                        value={allergy.reaction}
                                        onChange={(e) => handleNestedChange(e, 'allergies', idx, 'reaction')}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <select
                                        value={allergy.severity}
                                        onChange={(e) => handleNestedChange(e, 'allergies', idx, 'severity')}
                                        className="p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="" disabled>
                                            Select Severity
                                        </option>
                                        {['Mild', 'Moderate', 'Severe'].map((severity) => (
                                            <option key={severity} value={severity}>
                                                {severity}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeAllergy(idx)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAllergy}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                            >
                                Add Allergy
                            </button>
                        </div>

                        {/* Lifestyle and Habits */}
                        <div className="col-span-2 mt-4">
                            <h3 className="text-lg font-semibold">Lifestyle and Habits:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                    <label htmlFor="smokingStatus" className="block text-gray-600 mb-1">
                                        Smoking Status:
                                    </label>
                                    <select
                                        id="smokingStatus"
                                        value={formData.lifestyleAndHabits.smokingStatus}
                                        onChange={(e) => handleNestedPropertyChange(e, 'lifestyleAndHabits', 'smokingStatus')}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="" disabled>
                                            Select Smoking Status
                                        </option>
                                        {['Current', 'Former', 'Never'].map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="alcoholUse" className="block text-gray-600 mb-1">
                                        Alcohol Use:
                                    </label>
                                    <select
                                        id="alcoholUse"
                                        value={formData.lifestyleAndHabits.alcoholUse}
                                        onChange={(e) => handleNestedPropertyChange(e, 'lifestyleAndHabits', 'alcoholUse')}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="" disabled>
                                            Select Alcohol Use
                                        </option>
                                        {['No', 'Moderate', 'Habitual'].map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="tobacco" className="block text-gray-600 mb-1">
                                        Tobacco / Gutka(Kharra):
                                    </label>
                                    <input
                                        id="tobacco"
                                        value={formData.lifestyleAndHabits.tobacco}
                                        onChange={(e) => handleNestedPropertyChange(e, 'lifestyleAndHabits', 'tobacco')}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Past Dental History */}
                        <div className="col-span-2 mt-4">
                            <label htmlFor="pastDentalHistory" className="block text-gray-600 mb-1">
                                Past Dental History:
                            </label>
                            <textarea
                                id="pastDentalHistory"
                                name="pastDentalHistory"
                                value={formData.pastDentalHistory}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-2 mt-4">
                            <label htmlFor="notes" className="block text-gray-600 mb-1">
                                Notes:
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </section>
                </div>

                {/* Insurance Information */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Insurance Information</h3>
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="insuranceProvided"
                            checked={insuranceProvided}
                            onChange={handleInsuranceToggle}
                            className="mr-2"
                        />
                        <label htmlFor="insuranceProvided" className="block font-semibold">
                            Insurance Available?
                        </label>
                    </div>

                    {insuranceProvided && (
                        <>
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="insuranceProvider" className="block font-semibold mb-1">
                                        Insurance Provider:
                                    </label>
                                    <input
                                        type="text"
                                        id="insuranceProvider"
                                        value={insuranceProvider}
                                        onChange={(e) => setInsuranceProvider(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="policyNumber" className="block font-semibold mb-1">
                                        Policy Number:
                                    </label>
                                    <input
                                        type="text"
                                        id="policyNumber"
                                        value={policyNumber}
                                        onChange={(e) => setPolicyNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="primaryPolicyHolderName" className="block font-semibold mb-1">
                                        Primary Policy Holder Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="primaryPolicyHolderName"
                                        value={primaryPolicyHolderName}
                                        onChange={(e) => setPrimaryPolicyHolderName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="expirationDate" className="block font-semibold mb-1">
                                        Expiration Date:
                                    </label>
                                    <input
                                        type="date"
                                        id="expirationDate"
                                        value={expirationDate}
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </section>

                            <div className="mb-4">
                                <label htmlFor="coverageDetails" className="block font-semibold mb-1">
                                    Coverage Details:
                                </label>
                                <textarea
                                    id="coverageDetails"
                                    value={coverageDetails}
                                    onChange={(e) => setCoverageDetails(e.target.value)}
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
                        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
                {/* Success and Error Messages */}
                {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </form>
        </div>
    );
};

export default OPDForm;