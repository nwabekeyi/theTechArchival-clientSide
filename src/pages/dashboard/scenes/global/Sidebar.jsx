import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, Avatar, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FeedbackIcon from "@mui/icons-material/Feedback";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import GradeIcon from "@mui/icons-material/Grade";
import FolderIcon from "@mui/icons-material/Folder";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import profileImg from "../../../../images/profile-placeholder.png";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../../../hooks/useAuth";

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      title={title} // Tooltip for icon when sidebar is collapsed
    >
      {!isCollapsed && <Typography>{title}</Typography>}
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true); // Default state is now collapsed
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);

  if (!user) {
    return null; // or a loading spinner, or some fallback UI
  }

  const profileImage = user.profilePictureUrl ?? profileImg;

  const adminMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "User Management", to: "/dashboard/userManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Course Management", to: "/dashboard/courseManagement", icon: <ReceiptOutlinedIcon /> },
    { title: "Content Management", to: "/dashboard/contentManagement", icon: <AssignmentIcon /> },
    { title: "Financial Management", to: "/dashboard/financialManagement", icon: <ContactsOutlinedIcon /> },
    { title: "Team", to: "/dashboard/team", icon: <PersonOutlinedIcon /> },
    { title: "Analytics and Reporting", to: "/dashboard/analytics", icon: <MapOutlinedIcon /> },
    { title: "Growth & Innovation", to: "/dashboard/growth", icon: <TimelineOutlinedIcon /> },
    { title: "Contacts", to: "/dashboard/contacts", icon: <SettingsOutlinedIcon /> },
    { title: "Support", to: "/dashboard/support", icon: <SupportAgentIcon /> },
    { title: "Feedbacks", to: "/dashboard/feedbacks", icon: <FeedbackIcon /> },
    { title: "Enquiries", to: "/dashboard/enquiries", icon: <EmailIcon /> },
    { title: "Generated Codes", to: "/dashboard/offlineStudents", icon: <PersonOutlinedIcon /> },
  ];

  const studentMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "Timetable", to: "/dashboard/timeTable", icon: <CalendarTodayIcon /> },
    { title: "Assignments", to: "/dashboard/assignment", icon: <AssignmentIcon /> },
    { title: "Learning Plan", to: "/dashboard/learningPlan", icon: <LibraryBooksIcon /> },
    { title: "Student Progress", to: "/dashboard/studentProgress", icon: <TimelineOutlinedIcon /> },
    { title: "Instructor", to: "/dashboard/studentInstructors", icon: <PersonOutlinedIcon /> },
    { title: "Curriculum", to: "/dashboard/curriculum", icon: <FolderIcon /> },
    { title: "Payment History", to: "/dashboard/studentPayment", icon: <MapOutlinedIcon /> },
  ];

  const instructorMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "Course Details", to: "/dashboard/courseManagement", icon: <SchoolIcon /> },
    { title: "Timetable", to: "/dashboard/timeTable", icon: <CalendarTodayIcon /> },
    { title: "Assignments", to: "/dashboard/assignment", icon: <AssignmentIcon /> },
    { title: "Student Management", to: "/dashboard/studentManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Learning Plan", to: "/dashboard/learningPlan", icon: <LibraryBooksIcon /> },
    { title: "Reviews", to: "/dashboard/instructorReviews", icon: <GradeIcon /> },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "student":
        return studentMenuItems;
      case "instructor":
        return instructorMenuItems;
      default:
        return adminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme.palette.mode === "light" ? colors.blueAccent[200] : colors.primary[400]} !important`,
          position: "fixed",
          overflow: "hidden",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: "#fff !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon title="Menu" /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: "#fff",
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h4">Babtech E-learning</Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: "#fff" }}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  src={profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{ width: 100, height: 100, cursor: "pointer" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight="bold" fontSize="medium" sx={{ p: "10px 0 0 0" }}>
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Typography variant="h5">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"} paddingTop={"10%"}>
            {menuItems.map((item) => (
              <Item
                key={item.title}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed} // Pass isCollapsed here
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
