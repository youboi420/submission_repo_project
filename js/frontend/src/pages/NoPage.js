import { Button, IconButton, Stack } from '@mui/material';
import React from 'react';
import NTErrorImage from '../components/NoPageSvgComp'
import HomeIcon from '@mui/icons-material/Home'
import { Navigate } from 'react-router-dom';

function NoPage({ isValidUser }) {
  if (!isValidUser) {
    return (
      <Navigate to={'/login'} />
    )
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '85vh',
    }}>
      <div style={{ width: '40%', background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0))', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', padding: '20px',
      }}>
        <Stack spacing={2} alignItems="center">
          <NTErrorImage />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: "column",
            color: "#2b2a38",
            fontFamily: "monospace"
          }}>
            <h1>Page Not Found</h1>
            <h2>Sorry, the page you are looking for does not exist.</h2>
            <Button href='/' color='primary' variant='contained' sx={{textTransform: "none"}} >Go Back To  <HomeIcon sx={{mb: "2px", ml: "10px"}}/></Button>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default NoPage;
