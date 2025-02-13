import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
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
import { useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        display: 'flex',
        color: selected === title ? "#6870fa" : colors.grey[100], // Matching title color with icon
        boxShadow: selected === title ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none", // Adding box shadow for active menu
        borderRadius: selected === title ? "15px" : "none", // Adding box shadow for active menu

      }}
      onClick={() => setSelected(title)}
      icon={icon}
      title={title}
    >
      {!isCollapsed && <Typography>{title}</Typography>}
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const user = useSelector((state) => state.users.user);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileOrTabletDevice = /iphone|ipod|ipad|android|windows phone|blackberry|opera mini|mobile|tablet/i.test(userAgent);
    setIsMobileOrTablet(isMobileOrTabletDevice);
  }, []);

  if (!user) {
    return null; // or a loading spinner, or some fallback UI
  }

  const profileImage = user.profilePictureUrl ?? profileImg;

  const superAdminMenuItems = [
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

  const adminMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "User Management", to: "/dashboard/userManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Course Management", to: "/dashboard/courseManagement", icon: <ReceiptOutlinedIcon /> },
    { title: "Content Management", to: "/dashboard/contentManagement", icon: <AssignmentIcon /> },
    { title: "Analytics and Reporting", to: "/dashboard/analytics", icon: <MapOutlinedIcon /> },
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
      case "admin":
        return adminMenuItems;
      default:
        return superAdminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box
      sx={{
        "& .pro-sidebar .pro-menu": {
          padding: `${isCollapsed ? '8px 0 0 0' : '20px'}`,
          display: !isCollapsed && 'flex'
        },
        "& .pro-sidebar-inner": {
          backgroundColor: colors.primary[400],
          position: "fixed",
          width: 'fit-content',
          height: '95%',
          borderRadius: `${isCollapsed ? '20px' : '10px'}`,
          boxShadow: theme.palette.mode === 'light'
            ? '0px 4px 12px rgba(0, 0, 0, 0.3)'
            : '0px 4px 12px rgba(0, 0, 0, 0.5)',
        },
        "& .pro-sidebar": {
          paddingLeft: "4%",
          minWidth: isCollapsed ? "50px" : "220px",
          width: 'fit-content',
          maxWidth: isCollapsed ? "50px" : "220px",
          display: 'flex',
          alignItems: 'center',
          backgroundColor:
            theme.palette.mode === "light"
              ? colors.primary[900]
              : colors.primary[500],
          justifyContent: "center",
        },
        "& .pro-sidebar.collapsed": {
          minWidth: '60px'
        },
        "& .pro-sidebar .pro-menu.square .pro-menu-item > .pro-inner-item > .pro-icon-wrapper":{
          backgroundColor: "transparent",
          margin: "1vh 0",
          display: "flex",
          justifyContent: 'center',
          height: 'auto'
        },
        "& .pro-icon": {
          justifyContent: "flex-start !important",
        },
        "& .pro-menu-item.active ": {
          justifyContent: "start !important",
        },

        
        "& .pro-inner-item": {
          padding: "10px 5px 5px 5px !important",
          color: theme.palette.mode === "light"
            ? colors.grey[100]
            : colors.primary[200],
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          display: 'flex',
          justifyContent: "center",
          color: "#6870fa !important",

        },
        "& .css-1l8icbj": {
          padding: 0,
        },
        "& .pro-sidebar > .pro-sidebar-inner > .pro-sidebar-layout": {
          padding: '5px',
        },

      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">

           {/* Only show the MenuOutlinedIcon on non-mobile devices */}
           {
             !isMobileOrTablet && 
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                // Toggle between MenuOutlinedIcon (when expanded) and CloseIcon (when collapsed)
                style={{
                  margin: "10px 0 20px 0",
                  color: isCollapsed && colors.grey[100],
                }}
              >
            {!isCollapsed ? 
              <Box display="flex"  color={colors.grey[100]} justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h3" >
                  {user?.role}
                </Typography>
                <CloseIcon sx={{color:colors.grey[100]}}
                 onClick={() => setIsCollapsed(!isCollapsed)} />
              </Box>
              :
              <Box display="flex"  color={colors.grey[100]} justifyContent="center" alignItems="center">
              <MenuOutlinedIcon sx={{color:colors.grey[100]}}
               onClick={() => setIsCollapsed(!isCollapsed)} />
            </Box>
            }
          </MenuItem>
           }

          {!isCollapsed && (
            <Box mb="25px" display="flex" justifyContent="center" alignItems="center">
              <Avatar
                src={profileImage}
                alt="user-profile"
                sx={{
                  width: "120px",
                  height: "120px",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menuItems.map(({ title, to, icon }) => (
              <Item
                key={title}
                title={title}
                to={to}
                icon={icon}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
