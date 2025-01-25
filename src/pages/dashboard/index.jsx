import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingMessageIcon from "./components/floatingMessageIcon";
import { setNotifications } from "../../reduxStore/slices/notificationSlice";
import { tokens } from "./theme";



// Lazy load the components
const Dashboard = lazy(() => import("./scenes/dashboard"));
const Team = lazy(() => import("./scenes/team"));
const FinancialManagement = lazy(() => import("./scenes/financialManagement"));
const Contacts = lazy(() => import("./scenes/contacts"));
const Form = lazy(() => import("./scenes/form"));
const Line = lazy(() => import("./scenes/line"));
const Pie = lazy(() => import("./scenes/pie"));
const Enquiries = lazy(() => import("./scenes/enquiries"));
const UserManagement = lazy(() => import("./scenes/userManagement"));
const ContentManagement = lazy(() => import("./scenes/contentManagement"));
const CourseManagement = lazy(() => import("./scenes/courseManagement"));
const Feedbacks = lazy(() => import("./scenes/feebacks"));
const Support = lazy(() => import("./scenes/support"));
const TimeTable = lazy(() => import("./scenes/timeTable"));
const Assignment = lazy(() => import("./scenes/assignments"));
const LearningPlan = lazy(() => import("./scenes/learningPlan"));
const StudentProgress = lazy(() => import("./scenes/studentProgess"));
const Curriculum = lazy(() => import("./scenes/curriculum"));
const StudentPayment = lazy(() => import("./scenes/studentPayment"));
const InstructorReviews = lazy(() => import("./scenes/instructorReviews"));
const StudentManagement = lazy(() => import("./scenes/studentManagement/studentManagement"));
const OfflineStudentTable = lazy(() => import("./scenes/offlineStudent/offlineStudent"));
const StudentInstructors = lazy(() => import("./scenes/studentInstructors"));
const ChatApp = lazy(() => import("../messaging"));
import useWebSocket from '../../hooks/useWebocket'; // Import socket instance


function DashboardHome() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [userData, setUserData] = useState(null);
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);
  const userRole = user.role;
  const navigate = useNavigate();
  const { emit, isConnected, listen} = useWebSocket();



  const renderRoutesBasedOnRole = (role) => {
    switch (role) {
      case "superadmin":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/financialManagement" element={<FinancialManagement />} />
            <Route path="/form" element={<Form />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/userManagement" element={<UserManagement />} />
            <Route path="/contentManagement" element={<ContentManagement />} />
            <Route path="/courseManagement" element={<CourseManagement />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/support" element={<Support />} />
            <Route path="/offlineStudents" element={<OfflineStudentTable />} />
          </>
        );
      case "student":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/studentPayment" element={<StudentPayment />} />
            {/* <Route path="/studentInstructors" element={<StudentInstructors />} /> */}
          </>
        );
      case "instructor":
        return (
          <>
            <Route path="/messenger" element={<ChatApp />} />
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/instructorReviews" element={<InstructorReviews />} />
            <Route path="/courseManagement" element={<CourseManagement />} />
            <Route path="/studentManagement" element={<StudentManagement />} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    // <WebSocketProvider>
      <ColorModeContext.Provider value={colorMode}>
        <FloatingMessageIcon />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ display: "flex", height: "100%" }}>
            {/* Sidebar */}
            <Sidebar isSidebar={isSidebar} />

            {/* Content */}
            <Box
  id="dashboard"
  className="content"
  sx={{
    backgroundColor:
      theme.palette.mode === "light"
        ? colors.primary[900]
        : colors.primary[500],
    height: "100vh", // Make the content area take full height
    display: "flex",
    flexDirection: "column",
    overflowY: "auto", // Enable vertical scrolling
  }}
>
  <Box sx={{ height: "auto" }}>
    <Topbar userData={userData} />
  </Box>

  {/* Routes */}
  <Box sx={{ flexGrow: 1, overflowY: "auto", height: "calc(100vh - 64px)" }}>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard userData={userData} />} />
        {userRole && renderRoutesBasedOnRole(userRole)}
      </Routes>
    </Suspense>
  </Box>
</Box>

          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
 );
}

export default DashboardHome;
