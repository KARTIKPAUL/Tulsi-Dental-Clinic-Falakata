// src/components/Sidebar.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import user from "../assets/image/user.jpg";
import patient from "../assets/image/patient.png";

import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaNotesMedical,
  FaUserAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaClipboardCheck,
  FaChevronDown,
} from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

import logo from "./../assets/logo-1.png";
import { log } from "util";

const Sidebar = () => {
  const [isOpenForMobile, setIsOpenForMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdownNext = () => setDropdownOpen((prev) => !prev);

  const toggleSidebarForMobile = () => setIsOpen(!isOpenForMobile);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { userDetails } = useContext(AuthContext);
  const profileData = userDetails?.userDetails || {};
  const { loginUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
      roles: ["patient", "receptionist", "doctor"],
    },
    {
      name: "Appointment",
      path: "/dashboard/appointment",
      icon: <FaCalendarAlt />,
      roles: ["patient", "receptionist", "doctor"],
    },
    {
      name: "Medical Details",
      path: "/dashboard/medical-details",
      icon: <FaNotesMedical />,
      roles: ["patient"],
    },
    {
      name: "All Patients",
      path: "/dashboard/user-list",
      icon: <FaClipboardCheck />,
      roles: ["receptionist", "doctor"],
    },
    {
      name: "Create OPD Form",
      path: "/dashboard/opd-form",
      icon: <FaNotesMedical />,
      roles: ["receptionist", "doctor"],
    },
    {
      name: "OPD List",
      path: "/dashboard/opd-list",
      icon: <FaClipboardCheck />,
      roles: ["receptionist", "doctor"],
    },

    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <FaUserAlt />,
      roles: ["patient"],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(loginUser?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}

      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white pb-6 pt-6 px-2 relative">
        <button onClick={toggleSidebarForMobile} aria-label="Toggle Sidebar">
          {isOpenForMobile ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>

        <div className="relative flex items-center gap-2">
          {/* User Avatar */}
          <img src={user} className="h-10 w-10 rounded-full" />

          {/* User Details */}
          <div className="flex flex-col">
            <p>{loginUser.role === "doctor" ? "Doctor" : loginUser.role}</p>
            <p className="text-gray-500 text-sm">{loginUser.role}</p>
          </div>

          {/* Dropdown Button */}
          <button
            onClick={toggleDropdown}
            aria-label="Toggle Dropdown"
            className="focus:outline-none"
          >
            <FaChevronDown className="w-3 h-3" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-56 bg-gray-900 text-white shadow-lg rounded-lg w-52 z-50"
            >
              {/* Profile Info */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <img src={user} className="h-8 w-8 rounded-full" />
                  <div>
                    <p className="font-bold">
                      {loginUser.role === "doctor"
                        ? "Doctor"
                        : profileData.name}
                    </p>
                    <p className="text-sm text-gray-600">{loginUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <ul>
                {loginUser.role !== "doctor" && (
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    <Link to="/dashboard/profile">Profile</Link>
                  </li>
                )}
                <li className="p-2 hover:bg-gray-100 cursor-pointer">
                  <Link
                    to="/logout"
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        >
          {" "}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20 md:translate-x-0 md:static md:shadow-none`}
      >
        {/* Logo / Title */}
        <nav className="p-6 text-2xl font-bold ">
          <Link to="#" className="flex items-center">
            <img src={logo} alt="logo" />
          </Link>
        </nav>

        <hr className="mx-2 text-gray-800" />

        <div className="relative flex items-center gap-2 p-6 ml-2">
          <img
            src={loginUser.role === "doctor" ? user : patient}
            className="h-10 w-10"
            alt="User"
          />
          <div className="flex flex-col leading-tight">
            <p className="text-sm">
              {loginUser.role === "doctor" ? "Doctor" : profileData.name}
            </p>
            <p className="text-gray-500 text-xs">
              {loginUser.role === "doctor"
                ? "Doctor"
                : loginUser.role === "patient"
                ? "Patient"
                : loginUser.role === "receptionist"
                ? "Receptionist"
                : loginUser.role}
            </p>
          </div>
        </div>

        <hr className="mx-2 text-gray-800" />

        {/* Navigation Links */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-2 text-base font-medium rounded-lg ${
                    isActive(item.path)
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-700">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2 text-base font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none"
            aria-label="Logout"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
