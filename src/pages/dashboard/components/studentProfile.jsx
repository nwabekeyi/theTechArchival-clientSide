import React from "react";
import { useSelector } from "react-redux";
import { Typography, Avatar, Grid, Paper, Box, Divider, Link } from "@mui/material";
import { Star, StarHalf, StarBorder, AccountCircle } from "@mui/icons-material";

const StudentProfile = () => {
  const studentData = useSelector((state) => state.users.user);

  // Function to render star icons based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={index} sx={{ color: "#FFD700" }} />
        ))}
        {halfStar && <StarHalf sx={{ color: "#FFD700" }} />}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorder key={index} sx={{ color: "#FFD700" }} />
        ))}
      </>
    );
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "linear-gradient(135deg, #3a8ef6, #6c5ce7)",
    fontFamily: "Poppins, sans-serif", }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: "900px",
          margin: "auto",
          borderRadius: 1,
          background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    backdropFilter: "blur(40px)", // Frosted glass effect
    border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle white border
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          
        }}
      >
        <Grid container spacing={4} alignItems="">
          {/* Profile Picture */}
          <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={studentData.profilePictureUrl || "/default-avatar.png"}
              alt="Profile Picture"
              sx={{ width: 250, height: 250, borderRadius: 1 }}
            />
            {/* Role Section */}
           
            <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 2 }}>{studentData.role || "N/A"}</Typography>
          </Grid>

          {/* User Info */}
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight="bold">
              {`${studentData.firstName || "First"} ${studentData.lastName || "Last"}`}
            </Typography>

            {/* Program with Styling */}
            <Typography
              variant="body1"
              sx={{
                background: "linear-gradient(135deg, #3a8ef6, #6c5ce7)",
                color: "white",
                fontWeight: "500",
                fontSize: "11px",
                padding: "2px 3px",
                display: "inline-block",
                borderRadius: "5px",
                marginTop: "-100px",
              }}
            >
              {studentData.program || "No Program Assigned"}
            </Typography>

            {/* Rating Section */}
            <Box sx={{ marginTop: 6 }}>
              <Typography variant="h6" fontWeight="400" fontSize="13px">
                Rating
              </Typography>
              <Box display="flex" alignItems="center" sx={{ marginTop: 1 }}>
                <Typography variant="h6" fontWeight="400" fontSize="13px">
                  {studentData.rating ? `${studentData.rating}` : "No Rating"}
                </Typography>
                <Box sx={{ marginLeft: 1 }}>{studentData.rating && renderStars(studentData.rating)}</Box>
              </Box>
            </Box>

             {/* About Section */}
        <Box sx={{ marginTop: 4 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountCircle sx={{ color: "#1976D2" }} />
            <Typography variant="h6" fontWeight="500" fontSize="17px">
              About
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />

          {/* Contact Information */}
          <Typography variant="h6" fontWeight="bold" fontSize="14px" color="gray" sx={{ marginTop: 1.5, marginBottom:1 }}>
            Contact Information
          </Typography>
          <Typography variant="body1" marginBottom="12px" fontSize="14px">
            Phone:{" "}
            <Link href={`tel:${studentData.phoneNumber}`} sx={{ color: "linear-gradient(135deg, #3a8ef6, #6c5ce7)" }}>
              {studentData.phoneNumber || "N/A"}
            </Link>
          </Typography>
          <Typography variant="body1" marginBottom="12px" fontSize="14px">
            Email:{" "}
            <Link href={`mailto:${studentData.email}`} sx={{ color: "linear-gradient(135deg, #3a8ef6, #6c5ce7)" }}>
              {studentData.email || "N/A"}
            </Link>
          </Typography>
          <Typography variant="body1" marginBottom="12px" fontSize="14px">
            Site:{" "}
            <Link href={studentData.website} target="_blank" rel="noopener noreferrer" sx={{ color: "linear-gradient(135deg, #3a8ef6, #6c5ce7)" }}>
              {studentData.website || "N/A"}
            </Link>
          </Typography>
          <Typography variant="body1" marginBottom="12px" fontSize="14px">Address: {studentData.address || "N/A"}</Typography>

          {/* Basic Information */}
          <Typography variant="h6" fontWeight="bold" fontSize="14px" color="gray" sx={{ marginTop: 3, marginBottom: 1 }}>
            Basic Information
          </Typography>
          <Typography variant="body1" marginBottom="12px" fontSize="14px">Birthday: {studentData.dob || "N/A"}</Typography>
          <Typography variant="body1" fontSize="14px">Gender: {studentData.gender || "N/A"}</Typography>
        </Box>
          </Grid>
        </Grid>

       
      </Paper>
    </div>
  );
};

export default StudentProfile;
