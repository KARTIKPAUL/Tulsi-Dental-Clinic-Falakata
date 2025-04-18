import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Profile from "./components/Dashboards/PatientDashboard/Profile";
import MyAppointment from "./components/Dashboards/PatientDashboard/MyAppointment";
import MedicalDetails from "./components/Dashboards/PatientDashboard/MedicalDetails";
import PatientDashboard from "./components/Dashboards/PatientDashboard";
import Error from "./components/Error";
import ReceptionistDashboard from "./components/Dashboards/ReceptionistDashboard";
import AllAppointment from "./components/Dashboards/ReceptionistDashboard/AllAppointment";
import OPDForm from "./components/Dashboards/ReceptionistDashboard/OPDForm";
import { AnimatePresence } from "framer-motion";
import DoctorDashboard from "./components/Dashboards/DoctorDasboard";
import Checkup from "./components/Dashboards/DoctorDasboard/Checkup";
import ForgotPassword from "./components/ForgotPassword";
import OPDList from "./components/Dashboards/DoctorDasboard/OPDList";
import EditOpd from "./components/Dashboards/DoctorDasboard/EditOpd";
import UsersList from "./components/Dashboards/DoctorDasboard/UsersList";
import UserList from "./components/Dashboards/ReceptionistDashboard/UserList";
import OPDLists from "./components/Dashboards/ReceptionistDashboard/OPDLists";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Patient from "./components/Dashboards/Comman/Patient";
import AboutPage from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";

const App = () => {
  const { loginUser, logout } = useContext(AuthContext); // This now works because AuthProvider wraps it

  return (
    <Router>
      <AnimatePresence>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route element={<Dashboard />}>
           <Route path="/book-an-appoitement" element={<OPDForm />} /> 
          </Route>
          

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Dashboard />}>

            {loginUser?.role === "patient" && (
              <>
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route
                  path="/dashboard/appointment"
                  element={<MyAppointment />}
                />
                <Route
                  path="/dashboard/medical-details"
                  element={<MedicalDetails />}
                />
              </>
            )}
            {loginUser?.role === "receptionist" && (
              <>
                <Route path="/dashboard" element={<ReceptionistDashboard />} />
                <Route
                  path="/dashboard/appointment"
                  element={<AllAppointment />}
                />
                <Route path="/dashboard/opd-form" element={<OPDForm />} />
                <Route path="/dashboard/patient/:id" element={< Patient/>} />
                <Route path="/dashboard/user-list" element={<UserList />} />
                <Route path="/dashboard/opd-list" element={<OPDLists />} />
                <Route path="/dashboard/edit-opd/:id" element={<EditOpd />} />
              </>
            )}
            {loginUser?.role === "doctor" && (
              <>
                <Route path="/dashboard" element={<DoctorDashboard />} />
                <Route path="/dashboard/patient/:id" element={< Patient/>} />
                <Route path="/dashboard/opd-list" element={<OPDList />} />
                <Route path="/dashboard/checkup/:id" element={<Checkup />} />
                <Route path="/dashboard/edit-opd/:id" element={<EditOpd />} />
                <Route path="/dashboard/appointment" element={<AllAppointment />} />
                <Route path="/dashboard/opd-form" element={<OPDForm />} />
                <Route path="/dashboard/user-list" element={<UsersList />} />
              </>
            )}
            <Route path="*" element={<Error />} />

          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

const RootApp = () => (
  <AuthProvider>
    {/* Move AuthProvider here to wrap the entire App */}
    <App />
    <ToastContainer />
  </AuthProvider>
);

export default RootApp;
