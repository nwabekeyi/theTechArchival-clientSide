import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase/config';
import { Button, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import logo from '../../../assets/logo.jpg';
import backendDevImg from "../../../images/backend.jpeg";
import frontendDevImg from "../../../images/frontend.jpeg";
import imgplaceholder from "../../../images/karen.jpg";
import useSessionStorage from '../../../hooks/useSessionStorage';

// IDCard component (not exported, used internally for generating the card)
const IDCard = ({ idCardRef, userData }) => {
  const fallbackData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone:'00000000000',
    role: 'student',
    studentId: 'btech/std/Data Analysis/10',
    instructorId: '',
    program: 'Data Analysis',
    profilePictureUrl: imgplaceholder,
    address: '123 Tech Street, Babtech',
  };
x
  const {
    firstName,
    lastName,
    email,
    phone,          
    role,
    studentId,
    instructorId,
    program,
    profilePictureUrl,
  } = userData || fallbackData;

  const companyName = "Babtech School of Technology";

  return (
    <div ref={idCardRef} style={{ display: 'flex', justifyContent:"center", width: 'auto' }}>

      {/* FRONT CARD */}
    <Card sx={{ maxWidth: 400, height: 550, margin: 'auto', boxShadow: 3, borderRadius: 2,   backgroundColor: "#fff",  backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.9)), url(${frontendDevImg})`, margin:"2px"}} >
    {/* <CardImage src={images.image} alt={images.name} /> */}
      <CardContent>
        {/* Company Logo and Company Name side by side */}
        <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1}>
          {/* Company Logo */}
          <Grid item>
            <CardMedia
              component="img"
              image={logo}
              alt="Company Logo"
              sx={{ width: 40, height: 50,  }}
            />
          </Grid>
  
          {/* Company Name */}
          <Grid item>
            <Typography variant="h6" fontWeight="bold">
              {companyName}
            </Typography>
          </Grid>
        </Grid>
  
        {/* Centered Profile Picture */}
        <Grid container justifyContent="center" marginTop={5}>
          <Grid item>
            <CardMedia
              component="img"
              image={profilePictureUrl || fallbackData.profilePictureUrl}
              alt={firstName}
              sx={{ width: 150, height: 150, border: '2px solid #3f51b5' }}
            />
          </Grid>
        </Grid>
  
        {/* User Information */}
        <Typography variant="h5" textAlign="center" fontWeight="bold" marginTop={0} fontFamily={'sans-serif'} fontSize={25}>
          {firstName} {lastName}
        </Typography>
  
        {/* Conditional rendering for Role below the name */}
        <Typography variant="body2" fontWeight="smaller" textAlign="center" marginTop={0.5} fontFamily={'sans-serif'} fontSize={15}>
          {role === 'student' ? 'Student' : role === 'instructor' ? 'Instructor' : ''}
        </Typography>
  
        {/* Details Section */}
        <Grid container spacing={1} justifyContent="center" marginTop={2} alignItems="center">
  
  {/* Email */}
  <Grid item container color="textSecondary" sx={{ width: '80%' }}>
    <Grid item xs={4}>
      <Typography variant="body2" fontWeight="bold" sx={{ paddingLeft: '20%' }}>
        Email
      </Typography>
    </Grid>
    
    <Grid item xs={8}>
      <Typography variant="body2" fontWeight="bold">: {email}</Typography>
    </Grid>
  </Grid>

  {/* Phone */}
  <Grid item container  sx={{ width: '80%' }}>
    <Grid item xs={4}>
      <Typography variant="body2" fontWeight="bold" sx={{ paddingLeft: '20%' }}>
        Phone
      </Typography>
    </Grid>
    
    <Grid item xs={8}>
      <Typography variant="body2" fontWeight="bold">: {phone}</Typography>
    </Grid>
  </Grid>

 {/* Program */}
 <Grid item container sx={{ width: '80%' }}>
    <Grid item xs={4}>
      <Typography variant="body2" fontWeight="bold" sx={{ paddingLeft: '20%' }}>
        Program
      </Typography>
    </Grid>

    <Grid item xs={8}>
      <Typography variant="body2" fontWeight="bold">: {program}</Typography>
    </Grid>
  </Grid>

  {/* Student ID */}
  {role === 'student' && (
    <Grid item container sx={{ width: '80%' }}>
      <Grid item xs={4}>
        <Typography variant="body2" fontWeight="bold" sx={{ paddingLeft: '20%' }}>
          Student ID
        </Typography>
      </Grid>
      
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight="bold">: {studentId}</Typography>
      </Grid>
    </Grid>
  )}

  {/* Instructor ID */}
  {role === 'instructor' && (
    <Grid item container sx={{ width: '80%' }}>
      <Grid item xs={4}>
        <Typography variant="body2" fontWeight="bold" sx={{ paddingLeft: '30%' }}>
          Instructor ID
        </Typography>
      </Grid>
    
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight="bold">: {instructorId}</Typography>
      </Grid>
    </Grid>
  )}

 
</Grid>

  
        {/* Company Address */}
        <Typography variant="body2" textAlign="center" color="textSecondary" marginTop={3} fontWeight="bold">
          {companyName}
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary" fontWeight="bold">
          53, Governor's road, Anishere bus-stop, Ikotun, Lagos.
        </Typography>
      </CardContent>
    </Card>
    
  {/* BACK CARD */}

 
  <Card sx={{ width: 400, height: 550, margin: 'auto', boxShadow: 3, borderRadius: 2 ,backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)), url(${backendDevImg})`, margin:"2px"}}>
  <CardContent  sx={{ paddingX:"30px"}}>
    {/* Top Section */}
    <Grid container spacing={1} style={{ marginBottom: '0px', paddingTop: '30px' }}>
      {/* First Text Section */}
        <Typography style={{color:'darkblue', width:'auto', height:'20px' }} > </Typography>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <Typography>•</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          This is to certify that the bearer whose name, email and phone is affixed is a student/staff of Babtech 

          </Typography>
        </Grid>
      </Grid>

      {/* Second Text Section */}
      <Grid container spacing={1} style={{ marginTop: '5px' }}>
        <Grid item xs={1}>
          <Typography>•</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          If found, kindly return to the nearest police station or 53, Governor Road, Ikotun, Lagos.
          </Typography>
        </Grid>
      </Grid>
    </Grid>

    {/* Date and ID Section */}
    <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
      <Grid item>
        <Typography variant="body2" sx={{ marginBottom: '5px', fontWeight: 'bold' }}>
          Joined Date: MM/DD/YEAR
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '5px', fontWeight: 'bold' }}>
          Expire Date: MM/DD/YEAR
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '15px', fontWeight: 'bold' }}>
          Emp ID: 00-0000
        </Typography>
      </Grid>
    </Grid>

    {/* Signature Section */}
    <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
      <Grid item textAlign="center">
        <Typography variant="body2" style={{ color: '#1F3A93', fontWeight: 'bold' }}>
          Your Signature
        </Typography>
        <Typography variant="body2" style={{ color: '#1F3A93', marginTop: '5px', fontWeight: 'bold' }}>
          Your Sincerely
        </Typography>
      </Grid>
    </Grid>
  </CardContent>

  {/* Bottom Section - Company Info */}
  <Grid container style={{ 
    backgroundColor:'#1F3A93',
     padding: '50px 0', 
     textAlign: 'center', 
     color: 'white', 
     borderRadius: '0 0 8px 8px',
     margin:'50px 0'
      }} alignItems="center" justifyContent="center" >
  <Grid item>
    <CardMedia
      component="img"
      image={logo}
      alt="Company Logo"
      sx={{ width: 40, height: 50, marginRight: '10px', marginBottom:'25px'}} // Add margin-right to create space between logo and text
    />
  </Grid>
  
  <Grid item>
    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left' }}> {/* Align the text to the left */}
      Babtech School of technology
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: '1px', textAlign: 'left', marginTop:'10px'}}>
    info@babtechcomputers.com
    </Typography>
  </Grid>
</Grid>

</Card>

       
  </div>
  
  );
};

// Function to generate and upload PDF
const generatePDFAndUpload = async (idCardRef, userId) => {
  try {
    if (!idCardRef.current) throw new Error('ID card reference is not set.');

    // Set the exact width and height based on the component's size
    const componentWidth = idCardRef.current.offsetWidth;
    const componentHeight = idCardRef.current.offsetHeight;

    const canvas = await html2canvas(idCardRef.current, {
      useCORS: true,
      scale: 1, // Retain original scale to avoid resizing
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'px', [componentWidth, componentHeight]);
    pdf.addImage(imgData, 'JPEG', 0, 0, componentWidth, componentHeight);

    // PDF upload and Firestore update
    const pdfBlob = pdf.output('blob');
    const storageRef = ref(storage, `idcards/${Date.now()}_${userId}.pdf`);
    await uploadBytes(storageRef, pdfBlob);
    const downloadUrl = await getDownloadURL(storageRef);
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { idCardUrl: downloadUrl });

    return downloadUrl;
  } catch (error) {
    console.error('Error generating or uploading PDF:', error);
  }
};


// Exported DownloadButton component
const DownloadIdButton = ({ userId }) => {
  const idCardRef = useRef(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = useSessionStorage().memoizedUserDetails;
    setUserData(storedUser);
  }, []);

  const handleDownload = async () => {
    if (!userId) {
      console.error("User ID is required for downloading the ID card.");
      return;
    }
    const downloadUrl = await generatePDFAndUpload(idCardRef, userId);
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <>
      <IDCard idCardRef={idCardRef} userData={userData} />
      <Button variant="contained" color="primary" onClick={handleDownload} sx={{ marginTop: 2 }}>
        Download ID Card as PDF
      </Button>
    </>
  );
};

export default DownloadIdButton;