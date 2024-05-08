import React from 'react';
import { Box, Button, Divider, Stack, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ModernInfoCard from '../components/AnimatedInfoCard'
// import ModernInfoCard from '../components/ModernInfoCard'
import HomePageStyle from '../Style/HomePage.module.css'
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

import FilesLoader from '../components/Loaders/FilesLoaderComp';
import MenuIcon from '@mui/icons-material/Tune';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { NOTIFY_TYPES, notify } from '../services/notify_service';

import EditNote from '@mui/icons-material/EditNote';
import PasswordUpdate from '../components/Dialogs/PasswordUpdate';
import DevicesLoader from '../components/Loaders/DevicesLoader';
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

  const username_text = userObj.username
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
          <MenuIcon style={{ position: 'absolute', top: -5, left: -5, color: 'white', cursor: 'pointer', color: "black", zIndex: "1000" }} onClick={handleMenuOpen} />
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
              <MenuItem sx={{ backgroundColor: '#1976d1', color: "white", '&:hover': { backgroundColor: '#6097cd', color: "white" }}} style={{marginTop: "-12px"}} onClick={() => { setUpdatePass(true) }} >Update password <EditNote style={{ marginLeft: '15px', marginBottom: "2px" }} /> </MenuItem>
              <MenuItem sx={{ backgroundColor: '#c82a2b', color: "white", '&:hover': { backgroundColor: '#d36161', color: "white" }}} style={{marginTop: "5px"}} onClick={handleLogout} >Log Out <WarningIcon style={{ marginLeft: '15px', marginBottom: "2px" }} /> </MenuItem>
              <MenuItem sx={{ backgroundColor: '#c82a2b', color: "white", '&:hover': { backgroundColor: '#d36161', color: "white" }}} style={{marginTop: "5px"}} onClick={() => { setDeleteFilesDiag(true) }} >Delete all files <DangerousIcon style={{ marginLeft: '15px', marginBottom: "2px" }} /> </MenuItem>
              <MenuItem sx={{ backgroundColor: '#c82a2b', color: "white", '&:hover': { backgroundColor: '#d36161', color: "white" }}} style={{marginTop: "5px"}} onClick={() => { setDeleteAccDiag(true) }} >Delete My Account <DangerousIcon style={{ marginLeft: '15px', marginBottom: "2px" }} /> </MenuItem>
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
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: -15, marginBottom: 20 }} className={LandingStyle.username}> Project's main topics</h1>
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