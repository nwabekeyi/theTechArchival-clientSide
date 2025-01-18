import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Header from "../../components/Header";

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState({ id: '', title: '', description: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddContent = () => {
    if (!currentContent.title || !currentContent.description) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarOpen(true);
      return;
    }

    const newContent = {
      id: Date.now(),
      title: currentContent.title,
      description: currentContent.description,
    };

    setContent([...content, newContent]);
    setCurrentContent({ id: '', title: '', description: '' });
    setSnackbarMessage('Content added successfully');
    setSnackbarOpen(true);
  };

  const handleEditContent = (contentItem) => {
    setIsEditing(true);
    setCurrentContent(contentItem);
  };

  const handleUpdateContent = () => {
    const updatedContent = content.map(item => 
      item.id === currentContent.id ? currentContent : item
    );
    setContent(updatedContent);
    setIsEditing(false);
    setCurrentContent({ id: '', title: '', description: '' });
    setSnackbarMessage('Content updated successfully');
    setSnackbarOpen(true);
  };

  const handleDeleteContent = (id) => {
    const updatedContent = content.filter(item => item.id !== id);
    setContent(updatedContent);
    setSnackbarMessage('Content deleted successfully');
    setSnackbarOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContent({ ...currentContent, [name]: value });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
            <Header title="Content Management" subtitle="Manage page contents" />

      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          name="title"
          value={currentContent.title}
          onChange={handleInputChange}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={currentContent.description}
          onChange={handleInputChange}
        />
        <Box mt={2}>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleUpdateContent}>
              Update Content
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleAddContent}>
              Add Content
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={3} mt={3}>
        {content.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEditContent(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteContent(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ContentManagement;
