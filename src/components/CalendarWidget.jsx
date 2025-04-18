// src/components/CalendarWidget.jsx
import React, { useState,useContext,useMemo,lazy, Suspense } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'react-calendar/dist/Calendar.css'; // Import default styles
import './CalendarWidget.css'
import { debounce } from 'lodash';

const Calendar = lazy(() => import('react-calendar'));


const CalendarWidget = ({ sendDataToParent }) => {
  const [date, setDate] = useState(new Date());
   const {
    appointments,
  } = useContext(AuthContext);

   // Memoize appointment dates to avoid recalculating on every tileContent call
  const appointmentDates = useMemo(() => {
    return appointments?.map((appointment) => new Date(appointment.date));
  }, [appointments]);

  const handlePrev = debounce(() => {
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  setDate(prevMonth);
}, 300);

 const handleNext = debounce(() => {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  setDate(nextMonth);
}, 300);

  const hasAppointment = (date) => {
    return appointmentDates.some(
      (appointmentDate) => appointmentDate.toDateString() === date.toDateString()
    );
  };

   // Custom tile content to display dots on dates with appointments
  const tileContent = useMemo(
    () => ({ date, view }) => {
      if (view === 'month' && hasAppointment(date)) {
        return <div className="mt-1 w-2 h-2 bg-indigo-600 rounded-full mx-auto"></div>;
      }
      return null;
    },
    [appointmentDates]
  );

   // Handler for day click
  const handleDayClick = (selectedDate) => {
    setDate(selectedDate); // Update the selected date
    sendDataToParent(selectedDate); // Send the selected date to the parent component
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header with Calendar Icon and Navigation */}
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaCalendarAlt className="text-indigo-600 mr-2" />
        Calendar
      </h2>

      {/* Custom Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handlePrev}
          aria-label="Previous Month"
        >
          <FaChevronLeft />
        </button>
        <span className="text-lg font-medium">
          {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
        </span>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleNext}
          aria-label="Next Month"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Calendar Component */}
      <Suspense fallback={<div>Loading...</div>}>
      <Calendar
        onChange={setDate}
        value={date}
        // Hide the default navigation
        prevLabel={null}
        nextLabel={null}
        // Customize classes for TailwindCSS styling
        className="border-none"
        tileContent={tileContent}
        onClickDay={handleDayClick} // Add the event handler for day click
        // Optional: Disable certain dates or add additional functionality
      />
      </Suspense>
    </div>
  );
};

export default CalendarWidget;
