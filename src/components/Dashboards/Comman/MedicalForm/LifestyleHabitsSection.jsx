import React from 'react';

const LifestyleHabitsSection = ({ data, onChange }) => {
  const smokingStatuses = ['Never', 'Occasionally', 'Socially', 'Habitually'];
  const alcoholUses = ['No', 'Moderate', 'Habitual'];
  const tobaccoUses = ['Never', 'Occasionally', 'Socially', 'Habitually'];

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Lifestyle and Habits</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Smoking Status */}
        <div>
          <label htmlFor="smokingStatus" className="block text-gray-600 mb-1">
            Smoking Status:
          </label>
          <select
            id="smokingStatus"
            value={data?.smokingStatus}
            onChange={(e) => onChange('lifestyleAndHabits', 'smokingStatus', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select Smoking Status
            </option>
            {smokingStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Alcohol Use */}
        <div>
          <label htmlFor="alcoholUse" className="block text-gray-600 mb-1">
            Alcohol Use:
          </label>
          <select
            id="alcoholUse"
            value={data?.alcoholUse}
            onChange={(e) => onChange('lifestyleAndHabits', 'alcoholUse', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select Alcohol Use
            </option>
            {alcoholUses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tobacco */}
        <div>
          <label htmlFor="tobacco" className="block text-gray-600 mb-1">
            Tobacco Use:
          </label>
          <select
            id="tobacco"
            value={data?.tobacco}
            onChange={(e) => onChange('lifestyleAndHabits', 'tobacco', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select Tobacco Use
            </option>
            {tobaccoUses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LifestyleHabitsSection;
