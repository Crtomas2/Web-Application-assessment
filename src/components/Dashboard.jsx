import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton, TablePagination, Box
} from '@mui/material';
import FormModal from './FormModal';
import EditModal from './EditModal';
import StatusFilter from './StatusFilter';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false); // State for photo upload modal
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [selectedRow, setSelectedRow] = useState(null); // State to hold the selected row for modals
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle opening and closing of different modals
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = (row) => {
    setSelectedRow(row); // Set the selected row when opening the edit modal
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handlePhotoUploadOpen = (row) => {
    setSelectedRow(row); // Set the selected row when opening the photo upload modal
    setPhotoUploadOpen(true);
  };
  const handlePhotoUploadClose = () => setPhotoUploadOpen(false);
  
  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setPasswordVisibility(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  // Fetch records from the API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_record');
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
    const intervalId = setInterval(fetchRecords, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and slice rows for pagination
  const displayedRows = rows
    .filter(row => (status === '' || row.status === status))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', color: '#000000' }}>
        <Toolbar>
          <Typography variant="h6">
            South AsiaLink Finance Corporation
          </Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container style={{ marginTop: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create Record
          </Button>
          <StatusFilter status={status} setStatus={setStatus} />
        </Box>
      </Container>

      <Container style={{ marginTop: '20px' }}>
        <TableContainer component={Paper} style={{ backgroundColor: '#f5f5f5' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Profile Picture</TableCell> {/* New column for profile picture */}
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Toggle Visibility</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {row.profile_photo ? (
                      <a
                        href={`http://127.0.0.1:5000/profile_photo/${row.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://127.0.0.1:5000/profile_photo/${row.id}`}
                          alt="Profile"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </a>
                    ) : (
                      <img
                        src="/profile-picture.png" // Relative path to the public directory
                        alt="Default Profile"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>
                    {passwordVisibility[row.id] ? row.password : '******'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => togglePasswordVisibility(row.id)}>
                      {passwordVisibility[row.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEditOpen(row)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handlePhotoUploadOpen(row)} sx={{ ml: 2 }}>
                      Upload Photo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      <FormModal open={open} handleClose={handleClose} />
      {selectedRow && (
        <>
          <EditModal open={editOpen} handleClose={handleEditClose} row={selectedRow} />
          <ProfilePhotoUpload open={photoUploadOpen} handleClose={handlePhotoUploadClose} row={selectedRow} />
        </>
      )}
    </>
  );
};

export default Dashboard;