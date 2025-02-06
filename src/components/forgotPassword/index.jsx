import { useState } from "react";
import { TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/loadingButton"; 
import useApi from "../../hooks/useApi"; 
import Footer from '../../pages/homePage/components/Footer'
import NavBar from '../../pages/homePage/components/Header'
import {endpoints} from '../../utils/constants'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { data, loading, error: apiError, callApi} = useApi();
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      return setMessage("Please enter your email");
    }

    await callApi(endpoints.PASSWORD_LINK, "POST", { email });

    if (data.message === 'Password reset link sent successfully') {
      setMessage("Password reset link sent. Kindly check your email!");
      setEmail('');
    }else {
      setError("Password link not sent, something went wrong or you can check if your email is correctly inputted");
    }
  };

  return (
    <Box>
      <NavBar />
      <Container  sx={{ backgroundColor: "gainsboro", minHeight: "100vh",
     display: "flex", justifyContent: "center", alignItems: "center" , flexDirection: "column", gap: "30px"}}>
x
      <Box sx={{ p: 3, textAlign: "start", backgroundColor: "white", boxShadow: 3, borderRadius: 2,  }}>
        <Typography variant="h5" color="#1F3A93" gutterBottom>Forgot your password?</Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Enter your email and we will send you a password reset link.
        </Typography>

        {data && <Alert severity="success">{message}</Alert>}
        {apiError && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LoadingButton 
            type="submit" 
            variant="contained" 
            sx={{ backgroundColor: "#1F3A93", color: "white", "&:hover": { backgroundColor: "#fff" } }} 
            fullWidth 
            loading={loading} 
            loadingIndicator="Sending..."
          >
            Request Reset Link
          </LoadingButton>
        </form>

        {/* Back to Login Link */}
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ mt: 2, textAlign: "center", cursor: "pointer" }} 
          onClick={() => navigate("/signin")}
        >
          Back to Login
        </Typography>
      </Box>
    </Container>
    <Footer />

    </Box>
    
   
 
    
  );
};

export default ForgotPassword;
