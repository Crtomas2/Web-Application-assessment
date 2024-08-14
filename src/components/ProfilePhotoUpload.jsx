import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar } from '@mui/material';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfilePhotoUpload = ({ open, handleClose, row }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    console.log('Received Row in ProfilePhotoUpload:', row); // Debug statement
  }, [row]);

  const handleFileChange = (event) => {
    console.log('File selected:', event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      setUploadStatus('No file selected');
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', row.id); // Append employee ID
    // formData.append('username', row.username); // Append username

    try {
      console.log('Uploading file:', file);
      const response = await axios.post('http://127.0.0.1:5000/upload_photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Upload response:', response);
      setUploadStatus('File successfully uploaded');
      setOpenSnackbar(true);
      handleClose(); // Close modal on success
      setFile(null); // Clear the file selection
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file');
      if (error.response && error.response.data) {
        setUploadStatus(`Error: ${error.response.data.message}`);
      }
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Upload Profile Photo
          </Typography>
          <TextField
            fullWidth
            type="file"
            onChange={handleFileChange}
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={uploadStatus.includes('Error') ? 'error' : 'success'}>
          {uploadStatus}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfilePhotoUpload;
