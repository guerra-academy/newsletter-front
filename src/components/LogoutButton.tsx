import React from 'react';
import Button from '@mui/material/Button';

function LogoutButton() {
  const handleLogout = () => {
    // Sua lógica de logout
    console.log('Logged out');
  };

  return <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>;
}

export default LogoutButton;
