import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify

const FormModal = ({ open, handleClose }) => {
  // State to manage form inputs
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // POST request to the backend API
      const response = await axios.post('http://127.0.0.1:5000/add_record', {
        name,
        username,
        password,
        status
      });

      // Handle successful response
      if (response.status === 200) {
        toast.success('Record added successfully'); // Show success notification
        handleClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add record'); // Show error notification
    }
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
          borderRadius: '8px', // Rounded corners
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Register New Information
          </Typography>
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <TextField
              fullWidth
              label="Status"
              margin="normal"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <ToastContainer
        position="top-right" // Position notification at the top right
        autoClose={5000} // Auto close after 5 seconds
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default FormModal;
