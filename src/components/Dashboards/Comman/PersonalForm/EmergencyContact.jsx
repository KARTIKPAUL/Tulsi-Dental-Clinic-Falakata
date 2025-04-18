// src/components/Profile/EmergencyContact.jsx

import React from 'react';

const RELATIONSHIP_OPTIONS = [
    { value: '', label: 'Select Relationship' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' },
];

const EmergencyContact = ({ formData, onChange }) => {
    const relationship = formData?.emergencyContact?.relationship;

    return (<>
        <p className=" text-black font-semibold"> Emergency Contact </p>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
                <label className="block text-gray-600 mb-1" htmlFor="emergencyContact.name">
                    Name:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    id="emergencyContact.name"
                    name="emergencyContact.name"
                    value={formData?.emergencyContact?.name || ''}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div>
                <label className="block text-gray-600 mb-1" htmlFor="emergencyContact.phone">
                    Phone:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="tel"
                    id="emergencyContact.phone"
                    name="emergencyContact.phone"
                    value={formData?.emergencyContact?.phone || ''}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="sm:col-span-2">
                <label className="block text-gray-600 mb-1" htmlFor="emergencyContact.relationship">
                    Relationship:<span style={{ color: 'red' }}>*</span>
                </label>
                <select
                    id="emergencyContact.relationship"
                    name="emergencyContact.relationship"
                    value={relationship || ''}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {RELATIONSHIP_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {relationship === 'Other' && (
                <div className="sm:col-span-2">
                    <label className="block text-gray-600 mb-1" htmlFor="emergencyContact.relationshipOther">
                        Specify Relationship:
                    </label>
                    <input
                        type="text"
                        id="emergencyContact.relationshipOther"
                        name="emergencyContact.relationshipOther"
                        value={formData?.emergencyContact?.relationshipOther || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            )}
        </section></>
    );
};

export default EmergencyContact;
