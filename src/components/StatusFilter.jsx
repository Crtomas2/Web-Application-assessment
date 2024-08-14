import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const StatusFilter = ({ status, setStatus }) => {
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ maxWidth: 200 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={status}
        onChange={handleChange}
        label="Status"
        sx={{ width: 200 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Inactive">Inactive</MenuItem>
      </Select>
    </FormControl>
  );
};

export default StatusFilter;
