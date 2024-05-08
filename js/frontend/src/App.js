import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserManagePage from './pages/UserManagePage';
import NoPage from './pages/NoPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePageCards';
import ContactPage from './pages/ContactPage';
import FilesAndAnalyzePage from './pages/FilesAndAnalyzePage';

import LogoutPage from './pages/LogoutPage';
import NavbarComp from './components/NavbarComp';

import * as user_service from './services/user_service';
import PageLoader from './components/Loaders/PageLoader';

function App() {
  const [isValidUser, setIsValidUser] = React.useState(false);
  const [usersData, setIsValidData] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(true)
  const title = "Analyze app © Y-E "
  const fetchValidUser = async () => {
    try {
      const isValidUserResponse = await user_service.verifyUserCookie();
      setIsValidUser(isValidUserResponse.valid);
      setIsValidData(isValidUserResponse)
    } catch (error) {
      console.error('Error fetching valid user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    document.title = title
    fetchValidUser();
  }, []);


  if (isLoading) {
    return (
      <Box sx={{ width: '100%', justifyContent: "center", display: 'flex', alignContent: "center" }}>
          <div style={{backdropFilter: "blur(12px)", borderStyle: "solid", borderWidth: "4px", borderRadius: "12px", borderColor: "rgb(255,255,255,0.4)", padding: 25, marginTop: "calc(18%)"}}>
          <PageLoader />
          </div>
      </Box>
    )
  }

  return (
    <BrowserRouter>
      <NavbarComp isValidUser={isValidUser} userData={usersData} />
      <Routes>
        {/* Routes protected by user validity */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/login" element={<LoginPage isValidUser={isValidUser} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route index element={<HomePage isValidUser={isValidUser} userData={usersData} />} />
        <Route path="/users" element={<UserManagePage isValidUser={isValidUser} userData={usersData} />} />
        <Route path="/signup" element={<SignUpPage isValidUser={isValidUser} />} />
        {/* <Route path="/analyze" element={<AnaylzePage    isValidUser={isValidUser} userData={usersData} /> } /> */}
        <Route path="/analyzeandfiles" element={<FilesAndAnalyzePage isValidUser={isValidUser} userData={usersData} />} />
        <Route path="*" element={<NoPage isValidUser={isValidUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;