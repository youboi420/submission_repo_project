import React from 'react';
import { Box, Button, Divider, Stack, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ModernInfoCard from '../components/AnimatedInfoCard'
// import ModernInfoCard from '../components/ModernInfoCard'
import LandingStyle from '../Style/LandingPage.module.css';
import L2InfoCover from "../Images/info1.svg"
import L4InfoCover from "../Images/info2.svg"
import DDOSInfoCover from "../Images/info3.svg"
import MITMInfoCover from "../Images/info4.svg"
import Avvvatars from 'avvvatars-react'

import * as websocket_service from '../services/websocket_service';
import * as user_service from '../services/user_service'
import * as utils_service from '../services/utils_service'
import GenericDeleteDialog from '../components/Dialogs/GenereicDeleteDialog';

import { NOTIFY_TYPES, notify } from '../services/notify_service';

import PasswordUpdate from '../components/Dialogs/PasswordUpdate';
import ContactBtn from '../components/ContactBtn';

const L4InfoTitle = "OSI - Layer 4"
const L2InfoTitle = "OSI - Layer 2"
const DDOSInfoTitle = "DDOS - attack"
const MITMInfoTitle = "MITM - attack"

const L2InfoDesc = (
  <div>
    <h1 style={{ marginTop: -10 }}>Layer 2 - Data Link</h1>
    <p style={{ marginTop: -15 }}>
      Layer 2, also known as the Data Link layer, is the second layer of the OSI model. It is responsible for the reliable transmission of data between adjacent network nodes over a physical link. This layer provides error detection and correction mechanisms, as well as addressing and framing of data packets.
    </p>
    <h2 style={{ marginTop: -10 }}>ARP</h2>
    <p style={{ marginTop: -15 }}>
      ARP (Address Resolution Protocol) is a protocol used for mapping IP addresses to MAC addresses within a local network. When a device wants to communicate with another device on the same network, it uses ARP to discover the MAC address associated with the destination IP address. ARP broadcasts a request message to all devices on the network, and the device with the matching IP address responds with its MAC address. This mapping information is then cached by devices to facilitate future communication.
    </p>
  </div>
)


const L4InfoDesc = (
  <div>
    <h1 style={{ marginTop: -10 }}>Layer 4 - Transport</h1>
    <p style={{ marginTop: -15 }}>
      Layer 4, also known as the Transport layer, is the fourth layer of the OSI model. It is responsible for managing end-to-end communication between devices across a network. This layer ensures that data is reliably transmitted between the sender and receiver, handling issues such as data integrity, sequencing, and flow control.
    </p>
    <h2 style={{ marginTop: -10 }}>TCP</h2>
    <p style={{ marginTop: -15 }}>
      TCP (Transmission Control Protocol) is a communication protocol operating at the Transport layer. It facilitates reliable and ordered transmission of data between devices. TCP establishes a connection between the sender and receiver before data transfer, ensuring that data is delivered in the correct order and retransmitting any lost packets. This connection-oriented approach makes TCP suitable for applications that require guaranteed delivery and sequencing of data, such as web browsing, email, and file transfer.
    </p>
    <h2 style={{ marginTop: -10 }}>UDP</h2>
    <p style={{ marginTop: -15 }}>
      UDP (User Datagram Protocol) is a communication protocol operating at the Transport layer. Unlike TCP, UDP provides connectionless transmission with minimal overhead. It sends datagrams to the recipient without establishing a connection, making it faster but less reliable than TCP. UDP is commonly used for applications where speed is prioritized over reliability, such as real-time communication, video streaming, and online gaming.
    </p>
  </div>
)

const DDOSInfoDesc = (
  <div>
    <h2 style={{ marginTop: -10 }}>DDoS - Distributed Denial of Service</h2>
    <p style={{ marginTop: -15 }}>
      DDoS (Distributed Denial of Service) is a type of cyber attack aimed at disrupting the normal functioning of a targeted server, service, or network by overwhelming it with a flood of internet traffic. Unlike traditional DoS attacks, which are launched from a single source, DDoS attacks harness the power of multiple compromised devices distributed across different networks, forming a botnet.
    </p>
    <p style={{ marginTop: -5 }}>
      The basic principle behind a DDoS attack is to flood the target with an excessive volume of traffic, such as requests for information or connection attempts, rendering it unable to respond to legitimate requests from users. This can result in downtime, slow performance, or complete unavailability of the targeted service, causing disruption to businesses and organizations.
    </p>
  </div>
)

const MITMInfoDesc = (
  <div>
    <h2 style={{ marginTop: -10 }}>MITM - man in the middle attack</h2>
    <p style={{ marginTop: -15 }}>
      MITM (man in the middle) attack is a form of cyber attack where an attacker secretly intercepts and relays communication between two parties without their knowledge. The attacker positions themselves between the communicating parties, allowing them to eavesdrop on sensitive information or manipulate the communication.
    </p>
    <p style={{ marginTop: -5 }}>
      In a MITM attack, the attacker can intercept data transmitted between the parties, modify the content of the communication, or even impersonate one of the parties involved. This type of attack is often used to steal confidential information such as login credentials, financial data, or personal information.
    </p>
    <p style={{ marginTop: -5 }}>
      MITM attacks can occur in various scenarios, including insecure Wi-Fi networks, compromised network devices, or through malicious software installed on a user's device. To mitigate MITM attacks, encryption protocols such as SSL/TLS are commonly used to secure communication channels and prevent unauthorized interception.
    </p>
  </div>
)

const ProfilePage = ({ isValidUser }) => {
  const guest_place_holder = 'Guest  -  user'
  const [userObj, setUserObj] = React.useState({ username: guest_place_holder });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteAccDiag, setDeleteAccDiag] = React.useState(false)
  const [deleteFilesDiag, setDeleteFilesDiag] = React.useState(false)
  const [updatePass, setUpdatePass] = React.useState(false)

  const username_text = userObj.username.substring(0, 25)
  let navigate = useNavigate()


  React.useEffect(() => {
    document.title = "Profile page"
    const getUsernameCall = async () => {
      try {
        const res = await user_service.getUserData();
        if (res.valid === true) {
          setUserObj(res.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUsernameCall();
  }, []);

  const handleMenuOpen = (event) => {
    if (guest_place_holder !== username_text)
      setAnchorEl(event.currentTarget);
    else {
      notify("you are not logged in", NOTIFY_TYPES.warn)
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // handleDeleteFiles
  const handleDeleteFiles = async () => {
    const res = await user_service.deleteAllFiles()
    handleMenuClose();
    if (res.valid) {
      websocket_service.update(websocket_service.signal_codes.FILEDEL, "deleted_all_files")
      notify("deleted files successfully", NOTIFY_TYPES.success)
    } else {
      notify("files didn't delete", NOTIFY_TYPES.error)
    }
  };

  
  const handleDeleteAccount = async () => {
    const res = await user_service.deleteAccount()
    handleMenuClose();
    if (res.valid) {
      websocket_service.update(websocket_service.signal_codes.DELETE, "deleted_account")
      notify("account deleted successfully", NOTIFY_TYPES.success)
      navigate('/')
      utils_service.refreshPage()
    } else {
      notify("account didn't delete", NOTIFY_TYPES.error)
    }
  };

  const handleLogout = () => {
    navigate('/logout')
    handleMenuClose();
  };

  const EditPasswordIcon = () => {
    return (
      <div style={{ marginLeft: '23px', marginBottom: "-4px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="currentColor" fillOpacity="0" d="M20 7L17 4L8 13V16H11L20 7Z"><animate fill="freeze" attributeName="fill-opacity" begin="1.2s" dur="0.15s" values="0;0.3"></animate></path><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21H21"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0"></animate></path><path stroke-dasharray="44" stroke-dashoffset="44" d="M7 17V13L17 3L21 7L11 17H7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.6s" values="44;0"></animate></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6L18 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="8;0"></animate></path></g></svg>
      </div>
    )
  }
  
  const LogoutIcon = () => {
    return (
      <div style={{ marginLeft: '95px', marginBottom: "-4px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M5 21V20C5 17.7909 6.79086 16 9 16H13C15.2091 16 17 17.7909 17 20V21"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"></animate></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M11 13C9.34315 13 8 11.6569 8 10C8 8.34315 9.34315 7 11 7C12.6569 7 14 8.34315 14 10C14 11.6569 12.6569 13 11 13Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="20;0"></animate></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M20 3V7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="6;0"></animate><animate attributeName="stroke-width" begin="1.5s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"></animate></path></g><circle cx="20" cy="11" r="1" fill="currentColor" fillOpacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1.2s" dur="0.4s" values="0;1"></animate><animate attributeName="r" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="1;2;2;1;1"></animate></circle></svg>
      </div>
    )
  }
  
  const CloudDeleteIcon = () => {
    return (
      <div style={{ marginLeft: '23px', marginBottom: "-4px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 19c0 .34.04.67.09 1H6.5c-1.5 0-2.81-.5-3.89-1.57C1.54 17.38 1 16.09 1 14.58q0-1.95 1.17-3.48C3.34 9.57 4 9.43 5.25 9.15c.42-1.53 1.25-2.77 2.5-3.72S10.42 4 12 4c1.95 0 3.6.68 4.96 2.04S19 9.05 19 11c1.15.13 2.1.63 2.86 1.5c.51.57.84 1.21 1 1.92A5.9 5.9 0 0 0 19 13c-3.31 0-6 2.69-6 6m8.12-3.54L19 17.59l-2.12-2.12l-1.41 1.41L17.59 19l-2.12 2.12l1.41 1.42L19 20.41l2.12 2.13l1.42-1.42L20.41 19l2.13-2.12z"></path></svg>
      </div>
    )
  }

  const DeleteAccIcon = () => {
    return (
      <div style={{ marginLeft: '15px', marginBottom: "-4px" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21V20C3 17.7909 4.79086 16 7 16H11C13.2091 16 15 17.7909 15 20V21"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"></animate></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M9 13C7.34315 13 6 11.6569 6 10C6 8.34315 7.34315 7 9 7C10.6569 7 12 8.34315 12 10C12 11.6569 10.6569 13 9 13Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="20;0"></animate></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M15 3L21 9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="10;0"></animate></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M21 3L15 9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="10;0"></animate></path></g></svg>
    </div>
    )
  }

  return (
    <div className={LandingStyle.container} style={{ marginTop: 55, marginLeft: "calc(15%)", marginRight: "calc(15%)" }}>
      
      
      {/* {
        guest_place_holder !== username_text &&
        <Typography variant="div" style={{ borderColor: userObj.isadmin ? "#7fb4c6" : "#c4c4c4", backgroundColor: userObj.isadmin ? "#0f565d" : "#305e8f", color: 'white', borderStyle: "solid", borderWidth: "2px", borderRadius: "6px", padding: "2px", fontSize: "12px", position: 'absolute', top: "calc(24%)", left: "calc(25%)", zIndex: 2 }}>
          {userObj.isadmin ? <div>admin <StarIcon sx={{ fontSize: "14px", marginBottom: "-3px", color: "#dcdb69" }} /> </div> : <div>user <ManIcon sx={{ fontSize: "14px", marginBottom: "-3px", color: "#00b6e6" }} /> </div>}
        </Typography>
      } */}
      {
        updatePass &&
        <PasswordUpdate isOpen={updatePass} onClose={() => { setUpdatePass(false) }} onFailed={() => { setUpdatePass(false); notify("Changing password failed", NOTIFY_TYPES.error) }} onSuccess={() => {notify("Changed password successfully", NOTIFY_TYPES.success)}}/>
      }
      {
        deleteFilesDiag &&
        <GenericDeleteDialog isOpen={deleteFilesDiag} callBackFunction={handleDeleteFiles} onClose={() => { setDeleteFilesDiag(false) }} deletionType={"all your files"} />
      }
      {
        deleteAccDiag &&
        <GenericDeleteDialog isOpen={deleteAccDiag} callBackFunction={handleDeleteAccount} onClose={() => { setDeleteAccDiag(false) }} deletionType={"account"} />
      }
      <div className={LandingStyle.centered}>
        <h1 className={LandingStyle.title} style={{ marginTop: "-15px", marginBottom: "-15px" }} >Welcome</h1>
        <div className={LandingStyle.username}>{username_text}</div>
        <div style={{ zIndex: 1000, position: "absolute", top: "calc(2.5%)" }}>
          <div>
          {/* <div>
          <label className={LandingStyle.hamburger} style={{position: 'relative', zIndex: 1000}}>
              <input  type="checkbox" onClick={handleMenuOpen}/>
                <svg viewBox="0 0 32 32">
                  <path className={`${LandingStyle.line} ${LandingStyle.line_top_bottom}`} d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                  <path className={LandingStyle.line} d="M7 16 27 16"></path>
                </svg>
            </label>
          </div> */}
          <div style={{ position: 'absolute', top: -5, left: -5, color: 'white', cursor: 'pointer', color: "black", zIndex: "1000" }} onClick={handleMenuOpen} >
            <svg xmlns="http://www.w3.org/2000/svg" width="2.1em" height="2.1em" viewBox="0 0 24 24"><defs><symbol id="lineMdCogFilledLoop0"><path fill="#fff" d="M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 16.57 6.05 16.57 6.05C16.64 6.1 16.71 6.16 16.77 6.22C18.14 7.34 19.09 8.94 19.4 10.75C19.41 10.84 19.42 10.92 19.43 11C19.43 11 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.2s" values="M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 16.57 6.05 16.57 6.05C16.64 6.1 16.71 6.16 16.77 6.22C18.14 7.34 19.09 8.94 19.4 10.75C19.41 10.84 19.42 10.92 19.43 11C19.43 11 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z;M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 19.09 5.04 19.09 5.04C19.25 4.98 19.52 5.01 19.6 5.17C19.6 5.17 21.67 8.75 21.67 8.75C21.77 8.92 21.73 9.2 21.6 9.32C21.6 9.32 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z"></animate></path></symbol><mask id="lineMdCogFilledLoop1"><path fill="none" stroke="#fff" stroke-dasharray="36" stroke-dashoffset="36" stroke-width="5" d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="36;0"></animate><set attributeName="opacity" begin="0.4s" to="0"></set></path><g opacity="0"><use href="#lineMdCogFilledLoop0"></use><use href="#lineMdCogFilledLoop0" transform="rotate(60 12 12)"></use><use href="#lineMdCogFilledLoop0" transform="rotate(120 12 12)"></use><use href="#lineMdCogFilledLoop0" transform="rotate(180 12 12)"></use><use href="#lineMdCogFilledLoop0" transform="rotate(240 12 12)"></use><use href="#lineMdCogFilledLoop0" transform="rotate(300 12 12)"></use><set attributeName="opacity" begin="0.4s" to="1"></set><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></g><circle cx="12" cy="12" r="3.5"></circle></mask></defs><rect width="24" height="24" fill="currentColor" mask="url(#lineMdCogFilledLoop1)"></rect></svg>            
          </div>
          <Avatar style={{ width: 100, height: 100, cursor: "pointer" }} onClick={handleMenuOpen}>
            <Avvvatars size={100} value={username_text } id={username_text + username_text.substring(username_text.length / 2)} style={username_text + username_text.substring(username_text.length / 2)} />
          </Avatar>
          {
            guest_place_holder !== username_text &&
            <div className={userObj.isadmin ? LandingStyle.admin_ribbon : LandingStyle.user_ribbon}>{userObj.isadmin ? "admin" : "user"}</div>
          }
          {
            guest_place_holder === username_text &&
            <div className={LandingStyle.guest_ribbon}>Guest</div>
          }
          </div>
          
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
              PaperProps={{
                style: { borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(200, 200, 200, 0.4))', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' },
              }}
            >
              <MenuItem disabled > </MenuItem>
              <MenuItem sx={{ backgroundColor: '#1976d1', color: "white", '&:hover': { backgroundColor: '#6097cd', color: "white" }}} style={{marginTop: "-12px"}} onClick={() => { setUpdatePass(true) }} >Update password <EditPasswordIcon /> </MenuItem>
              <MenuItem sx={{ backgroundColor: '#c82a2b', color: "white", '&:hover': { backgroundColor: '#d36161', color: "white" }}} style={{marginTop: "5px"}} onClick={handleLogout} >Log out <LogoutIcon /> </MenuItem>
              <MenuItem sx={{ backgroundColor: '#c82a2b', color: "white", '&:hover': { backgroundColor: '#d36161', color: "white" }}} style={{marginTop: "5px"}} onClick={() => { setDeleteFilesDiag(true) }} >Delete all my files <CloudDeleteIcon /> </MenuItem>
              <MenuItem sx={{ backgroundColor: '#c82a2b', color: "white", '&:hover': { backgroundColor: '#d36161', color: "white" }}} style={{marginTop: "5px"}} onClick={() => { setDeleteAccDiag(true) }} >Delete my account <DeleteAccIcon /></MenuItem>
            </Menu>
        </div>
        {
          guest_place_holder === username_text && (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Button variant='contained' color='info' href='/signup' sx={{ textTransform: "none", paddingLeft: 10, paddingRight: 10 }}>
              <Typography fontSize={20}>
                Create a user
              </Typography>
            </Button>
          </div>
        )}
        <Box sx={{ /* boxShadow: '0.2px 2px 9px white', */ marginTop: 2 }} width="80%" mx="auto" style={{ /* backdropFilter: 'blur(40px)', */ /* borderRadius: '10px', */ padding: '20px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: -15, marginBottom: 20 }} className={LandingStyle.username}> Learn about the project's topics</h1>
          <Stack spacing={4} direction={"row"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack spacing={4}>
              <ModernInfoCard src={L4InfoCover} title={L4InfoTitle} description={L4InfoDesc} />
              <ModernInfoCard src={DDOSInfoCover} title={DDOSInfoTitle} description={DDOSInfoDesc} />
            </Stack>
            <Stack spacing={4}>
              <ModernInfoCard src={L2InfoCover} title={L2InfoTitle} description={L2InfoDesc} />
              <ModernInfoCard src={MITMInfoCover} title={MITMInfoTitle} description={MITMInfoDesc} />
            </Stack>
          </Stack>
        </Box>
        <div style={{ marginTop: "8px", marginBottom: "-10px" }}>
          <ContactBtn />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;