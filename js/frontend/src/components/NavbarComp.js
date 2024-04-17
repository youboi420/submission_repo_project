import React from 'react'
import { AppBar, Box, Button, Card, Divider, Stack, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useLocation } from 'react-router-dom'

import GroupIcon from '@mui/icons-material/Group'
import AnalyzeIcon from '@mui/icons-material/FindInPage'
import ProfileIcon from '@mui/icons-material/AccountBox'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import FilesIcon from '@mui/icons-material/FolderCopy'
import HomeIcon from '@mui/icons-material/Home'
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import logo from '../Images/applogo.png'

const BTN_COLOR = "#0a236780"//"#0a238e"
const BORDER_COLOR = "#73DFF1"

const StyledNavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'normal',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'background-color 0.4s ease-in-out',
  '&:hover': {
    backgroundColor: BTN_COLOR,
  },
}))

const NavbarComp = ({ isValidUser, userData }) => {
  const location = useLocation()
  const isActive = (path) => {
    return location.pathname === path
  }

  const svgStyles = {
    width: '20px',
    height: '20px',
    marginRight: '5px',
  };

  const loggedInSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={svgStyles}>
      <circle cx="12" cy="12" r="10" fill="#77DD76" />
    </svg>
  );
  
  const guestSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={svgStyles}>
      <circle cx="12" cy="12" r="10" fill="#FF6962" />
    </svg>
  );
  

  return (
    <>
      <AppBar position="sticky" style={{ top: 0, zIndex: 1000, backgroundColor: 'rgba(25, 118, 210, 0.96)' }} px={2}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img style={{ marginLeft: "-5px", marginTop: "2px", marginBottom: "1px" }} src={logo} alt='logo...' width={180} height={70} />
            </Box>
          </a>
          </Box>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: "calc(35%)", flexGrow: 1, marginTop: "4px" }}>
            <Typography variant="h6">
              {isValidUser ?  "logged as: " +userData.username : 'please log in'}
            </Typography>
            <div style={{marginLeft: "4px"}}>
              {isValidUser ? loggedInSVG : guestSVG}
            </div>
          </div>
          <Stack direction={'row'} spacing={2} >
            <Card
              variant="elevation"
              sx={{
                display: 'flex',
                backgroundColor: "transparent",
                color: 'white',
                '& svg': {
                  m: 1.2,
                },
                '& hr': {
                  mx: 0.5,
                },
              }}
            >
              <StyledNavButton href="/" sx={{ fontWeight: isActive('/') ? 'bold' : 'normal', backgroundColor: isActive("/") ? BTN_COLOR : "inherit" }} startIcon={<HomeIcon />} >
                <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                Home
                </div>
              </StyledNavButton>
              <Divider orientation="vertical" variant="middle" sx={{ borderWidth: 2, bgcolor: BORDER_COLOR }} flexItem />
              {
                isValidUser &&
                <StyledNavButton href="/analyzeandfiles" sx={{ textTransform: 'none', fontWeight: isActive('/analyzeandfiles') ? 'bold' : 'normal', backgroundColor: isActive("/analyzeandfiles") ? BTN_COLOR : "inherit" }} >
                  <AnalyzeIcon /> 
                  <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                  Analyze  && 
                  </div>
                  <FilesIcon />
                  <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                    Files
                  </div>
                </StyledNavButton>
              }
              {
                isValidUser &&
                <Divider orientation="vertical" variant="middle" sx={{ borderWidth: 2, bgcolor: BORDER_COLOR }} flexItem />
              }
              {
                isValidUser && userData.isadmin &&
                <StyledNavButton href="/users" sx={{ textTransform: 'none', fontWeight: isActive('/users') ? 'bold' : 'normal', backgroundColor: isActive("/users") ? BTN_COLOR : "inherit" }}  startIcon={<GroupIcon />}>
                  <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                  Users
                  </div>
                </StyledNavButton>
              }
              {
                userData.isadmin &&
                <Divider orientation="vertical" variant="middle" sx={{ borderWidth: 2, bgcolor: BORDER_COLOR }} flexItem />
              }
              <StyledNavButton href="/profile" sx={{ textTransform: 'none', fontWeight: isActive('/profile') ? 'bold' : 'normal', backgroundColor: isActive("/profile") ? BTN_COLOR : "inherit"}}  startIcon={<ProfileIcon />}>
                <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                Profile
                </div>
              </StyledNavButton>
              <Divider orientation="vertical" variant="middle" sx={{ borderWidth: 2, bgcolor: BORDER_COLOR }} flexItem />
              {
                !isValidUser && /* false */
                <StyledNavButton href="/signup" sx={{ textTransform: 'none', fontWeight: isActive('/signup') ? 'bold' : 'normal', backgroundColor: isActive("/signup") ? BTN_COLOR : "inherit"}} startIcon={<PersonAddIcon />}>
                  <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                  Signup
                  </div>
                </StyledNavButton>
              }
              {
                !isValidUser && /* false */
                <Divider orientation="vertical" variant="middle" sx={{ borderWidth: 2, bgcolor: BORDER_COLOR }} flexItem />
              }
              {
                !isValidUser && /* false */
                <StyledNavButton href="/login" sx={{ textTransform: 'none', fontWeight: isActive('/login') ? 'bold' : 'normal', backgroundColor: isActive("/login") ? BTN_COLOR : "inherit"}} startIcon={<LoginIcon />}>
                  <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                  Login
                  </div>
                </StyledNavButton>
              }
              {
                isValidUser &&
                <StyledNavButton color="error"  href="/logout" sx={{ textTransform: 'none', fontWeight: isActive('/logout') ? 'bold' : 'normal', backgroundColor: isActive("/logout") ? BTN_COLOR : "#b22222" }} startIcon={<LogoutIcon />}>
                  <div style={{marginTop: "5px", marginLeft: "-7px"}} >
                  Logout
                  </div>
                </StyledNavButton>
              }
            </Card>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default NavbarComp