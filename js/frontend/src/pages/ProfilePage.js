import React from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import { getUserData } from '../services/user_service';
import InfoCard from '../components/InfoCard'
import HomePageStyle from '../Style/HomePage.module.css'
import LandingStyle from '../Style/LandingPage.module.css';
import L2InfoCover from "../Images/netSwitch.png"
import L4InfoCover from "../Images/netLayer.png"
import DDOSInfoCover from "../Images/ddosIllustration.png"
import MITMInfoCover from "../Images/mitmIllustration.png"

const L4InfoTitle = "OSI - Layer 4"
const L2InfoTitle = "OSI - Layer 2"
const DDOSInfoTitle = "DDOS - distributed denail of service attack"
const MITMInfoTitle = "MITM - man in the middle attack"

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
  const username_text = userObj.username

  React.useEffect(() => {
    document.title = "Profile page"
    const getUsernameCall = async () => {
      try {
        const res = await getUserData();
        if (res.valid === true) {
          setUserObj(res.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUsernameCall();
  }, []);

  return (
    <div className={LandingStyle.container} style={{marginTop: 65, marginLeft: "calc(15%)", marginRight: "calc(15%)"}}>
      <div className={LandingStyle.centered}>
        <h1 className={LandingStyle.title} style={{marginTop: "-15px", marginBottom: "-15px"}} >Welcome</h1>
        <div className={LandingStyle.username}>{username_text}</div>
        {guest_place_holder === username_text && (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Button variant='contained' color='info' href='/signup' sx={{ textTransform: "none", paddingLeft: 10, paddingRight: 10 }}>
              <Typography fontSize={20}>
                Create a user
              </Typography>
            </Button>
          </div>
        )}
        <Box sx={{ boxShadow: '0.2px 2px 9px white', marginTop: 2}} width="80%" mx="auto" style={{ backdropFilter: 'blur(40px)', borderRadius: '10px', padding: '20px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: -15 }} className={LandingStyle.username}> Project's main topics</h1>
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
        <div style={{ marginTop: "20px", marginBottom: "-10px" }}>
          <Typography  >
            Network Analyzer - Coded by Yair Elad © {new Date().getFullYear()}
          </Typography>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;