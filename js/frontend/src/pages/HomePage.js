import React from 'react';
import HomeStyle from '../Style/HomePage.module.css';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import * as user_service from '../services/user_service';
import { NOTIFY_TYPES, notify } from '../services/notify_service';
import { Navigate } from 'react-router-dom';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WbNightIcon from '@mui/icons-material/Bedtime';
import HomePageStyle from '../Style/HomePage.module.css';
import InfoCard from '../components/InfoCard';

import L2InfoCover from "../Images/netSwitch.png";
import L4InfoCover from "../Images/netLayer.png";
import DDOSInfoCover from "../Images/ddosIllustration.png";
import MITMInfoCover from "../Images/mitmIllustration.png";

const HomePage = ({ isValidUser, userData }) => {
  const L4InfoTitle = "OSI - Layer 4"
  const L2InfoTitle = "OSI - Layer 2"
  const DDOSInfoTitle = "DDOS - distrbuted denail of service attack"
  const MITMInfoTitle = "MITM - man in the middle attack"

  const L4InfoDesc  = (
    <div>
      <p>Explanetion...</p>
    </div>
  )
  const DDOSInfoDesc = (
    <div>

    </div>
  )
  const MITMInfoDesc = (
    <div>

    </div>
  )
  
  const L2InfoDesc  = "OSI - Layer 4"
  const getTimeGreet = () => {
    const timeHours = new Date().getHours();
    let greeting;

    if (timeHours < 12) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span>Good morning</span> <WbSunnyIcon style={{ marginLeft: "10px" }} /> </Typography>
      );
    } else if (timeHours < 16) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span>Good afternoon</span> <WbTwilightIcon style={{ marginLeft: "10px" }} /> </Typography>
      );
    } else if (timeHours < 20) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span>Good evening</span> <WbTwilightIcon style={{ marginLeft: "10px" }} /> </Typography>
      );
    } else {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span>Good night</span> <WbNightIcon style={{ marginLeft: "10px" }} /> </Typography>
      );
    }
    return greeting;
  };

  React.useEffect(() => {
    document.title = "Home page";
  }, []);
  
  return (
    <div >
      <Box sx={{ boxShadow: '0.2px 2px 9px white', marginTop: 2}} width="40%" mx="auto" boxShadow={3} style={{ backdropFilter: 'blur(20px)', borderRadius: '10px', padding: '20px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: -10, paddingTop: 10, fontSize: "40px" }} className={HomePageStyle.title} > Welcome to my network analyzer home page</h1>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} className={HomePageStyle.title}> {getTimeGreet()}  </h2>
      </Box>
      <Box sx={{ boxShadow: '0.2px 2px 9px white', marginTop: 8 }} width="40%" mx="auto" style={{ backdropFilter: 'blur(40px)', borderRadius: '10px', padding: '20px' }}>
        <Stack spacing={2} direction={"row"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack spacing={2}>
            <InfoCard src={L4InfoCover} title={L4InfoTitle} description={L4InfoDesc} />
            <InfoCard src={DDOSInfoCover} title={DDOSInfoTitle} description={DDOSInfoDesc} />
          </Stack>
          <Stack spacing={2}>
            <InfoCard src={L2InfoCover} title={L2InfoTitle} description={L2InfoDesc} />
            <InfoCard src={MITMInfoCover} title={MITMInfoTitle} description={MITMInfoDesc} />
          </Stack>
        </Stack>
      </Box>
    </div>
  )
}

export default HomePage;
