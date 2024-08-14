import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests
import { Close } from '@mui/icons-material';

const EditModal = ({ open, handleClose, row }) => {
  // State to manage form inputs
  const [name, setName] = useState(row.name);
  const [username, setUsername] = useState(row.username);
  const [password, setPassword] = useState(row.password);
  const [status, setStatus] = useState('');

  // State for pop-up notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // PUT request to the backend API
      const response = await axios.put('http://127.0.0.1:5000/update_record', {
        id: row.id,
        name,
        username,
        password,
        status
      });

      // Handle successful response
      if (response.status === 200) {
        setNotification({
          open: true,
          message: 'Record updated successfully',
          severity: 'success',
        });
        handleClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error updating record:', error);
      setNotification({
        open: true,
        message: 'Failed to update record',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (row) {
      setName(row.name);
      setUsername(row.username);
      setPassword(row.password);
      setStatus(row.status);
    }
  }, [row]);

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
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
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" component="h2">
            Edit Information
          </Typography>

          {/* Display profile photo */}
          {row.profile_photo && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img
                src={`http://127.0.0.1:5000/profile_photo/${row.id}`}
                alt="Profile"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
              />
            </Box>
          )}

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

      {/* Snackbar for pop-up notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditModal;
