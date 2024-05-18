import React from 'react'
import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import WbNightIcon from '@mui/icons-material/Bedtime'
import HomePageStyle from '../Style/HomePage.module.css'
import CircleInfo from '../components/CircleInfo'
import Textra from 'react-textra'

import IAFLOGO from "../Images/iaflogo.png"
import BA108LOGO from "../Images/logo1.png"
import KNOARLOGO from "../Images/knoarlogoround.png"

import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import actionsCover from "../Images/actionsCover.png"
import developmentCover from "../Images/devCover.png"
import planningCover from "../Images/planningCover.jpeg"
import Console from '../components/consoleText'
import { styled } from '@mui/material/styles';
import ImageWithOverlay from '../components/ImageOverlay'
import ContactBtn from '../components/ContactBtn'

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledImg = styled('img')(({ theme }) => ({
  width: 'var(--s)',
  height: 'var(--s)',
  cursor: 'pointer',
  transition: 'transform 0.55s, filter 0.5s',
  '&:hover': {
    transform: 'scale(1.15)',
    filter: 'brightness(0.7)',
  },
}));

const TraText = styled('div')(({ theme }) => ({
  color: "red",
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  visibility: 'hidden',

  '&:hover': {
    filter: 'brightness(0.7)',
    visibility: 'visible',
  },
}));

const TransformIcon = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '72px',
  color: '#0e515a',
  zIndex: 0,
  display: 'none',
  visibility: 'hidden',
}));


const HomePage = ({ isValidUser, userData }) => {
  const heroTitle = "About the project "
  const developTitle = "Dev - Goal's"
  const actionTitle = "User action's"

  const linkIcon = <svg style={{marginLeft: "2px", marginBottom: "-6px"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256"><path fill="currentColor" d="M238 88.18a52.42 52.42 0 0 1-15.4 35.66l-34.75 34.75A52.28 52.28 0 0 1 150.62 174h-.05A52.63 52.63 0 0 1 98 119.9a6 6 0 0 1 6-5.84h.17a6 6 0 0 1 5.83 6.16A40.62 40.62 0 0 0 150.58 162a40.4 40.4 0 0 0 28.73-11.9l34.75-34.74a40.63 40.63 0 0 0-57.43-57.46l-11 11a6 6 0 0 1-8.49-8.49l11-11a52.62 52.62 0 0 1 74.43 0A52.83 52.83 0 0 1 238 88.18m-127.62 98.9l-11 11A40.36 40.36 0 0 1 70.6 210a40.63 40.63 0 0 1-28.7-69.36l34.72-34.74A40.63 40.63 0 0 1 146 135.77a6 6 0 0 0 5.83 6.16h.17a6 6 0 0 0 6-5.84a52.63 52.63 0 0 0-89.86-38.67l-34.76 34.74A52.63 52.63 0 0 0 70.56 222a52.26 52.26 0 0 0 37.22-15.42l11-11a6 6 0 1 0-8.49-8.48Z"></path></svg>
  

  const actionDesc = (
    <div className={HomePageStyle.desc}>
      <h1 style={{ marginTop: -25, display: 'flex', alignItems: 'center', textAlign: "center", justifyContent: "center" }} >User action's</h1>
      <h3>A quick start on the Network Analyzer</h3>
      <br />
      <div style={{ marginTop: -30 }}>
        As a user you can go to the analyze and files page (in the navbar) and you can:
        <ul>
          <li style={{ marginTop: "-10px" }} >Upload a network record</li>
          <li style={{ marginTop: "4px" }} >Download an existing network record <br />(also from another device)</li>
          <li style={{ marginTop: "4px" }} >Delete an existing network record <br />(also from another device)</li>
          <li style={{ marginTop: "4px" }} >Analyze a file</li>
          <li style={{ marginTop: "4px" }} >Get report of a file</li>
          <li style={{ marginTop: "4px" }} >Get visual report of a file</li>
        </ul>
      </div>
      <div style={{ marginTop: -15 }}>
        {
          isValidUser && userData?.isadmin &&
          <div>
            <h3 style={{ marginTop: "30px", marginBottom: "-10px" }} >As an admin you can also go to the user's page (in the navbar) and: </h3>
            <ul>
              <li style={{ marginTop: "4px" }} >Create a user</li>
              <li style={{ marginTop: "4px" }} >Delete a user</li>
              <li style={{ marginTop: "4px" }} >Update a user</li>
              <li style={{ marginTop: "4px" }} >Get a list of all the user's </li>
            </ul>
          </div>
        }
      </div>
    </div>
  )


  const developDesc = (
    <div className={HomePageStyle.desc}>
      <h1 style={{ marginTop: -25, display: 'flex', alignItems: 'center', textAlign: "center", justifyContent: "center" }}>Development & Goal's</h1>
      <br />
      <div style={{ marginTop: -15 }}>
        Developing the project was a great experience from going to the base to learn with my army moderator, to learning in class how to use react and so on. i had a very positive and maturing experience, and i am very grateful for what i have achieved in the given development time period.
        <br />
        <br />
        The development process itself was a blast. i had a real good time learning new coding techniques, new tools, and new technologies. i really got aspired by my moderator's and surroundings.
        <br />
        <br />
        Before starting the project i've set up some goals for myself and the project itself.
        <br />
        <h4 style={{ marginBottom: -10, marginTop: 8 }}>My goal's were: </h4>
        <ul>
          <li style={{ marginTop: "4px" }} >Create a clean and expandable codebase</li>
          <li style={{ marginTop: "4px" }} >Integrate the system to the unit</li>
          <li style={{ marginTop: "4px" }} >Achieve a great user experience and friendly interface</li>
        </ul>
        <br />
      </div>

    </div>
  )

  const planDesc = (
    <div className={HomePageStyle.desc}>
      <h1 style={{ marginTop: -25, display: 'flex', alignItems: 'center', textAlign: "center", justifyContent: "center" }}>About</h1>
      <p>
        This is the a network analyzer web application which it's all target is to automate/shorten the job's of those who really care about their time and effort, it is designed to be user friendly and easy to use.
        it is a very capable piece of software with a lot of great analyzing techniques and features. following strict RFC rules, uses wildly common design patterns and so on.
        <br />
        it is build in the react framework {/* logo */} and uses node.js runtime
        <br />
        <br />
        The main idea is to connect all the manual analyzing process into one big web application. that organized both the network recording files and it's corresponding report's.
        <br />
        <br />
        Network analyzer web app has a lot to offer and it's a great interface for investigation team's to handle all the research automatically and with a lot of features, both verbal and visual report's.
      </p>

    </div>
  )

  const getTimeGreet = () => {
    const timeHours = new Date().getHours()
    let greeting

    if (timeHours < 12 && timeHours >= 5) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good morning</span> <div style={{ marginLeft: "10px", marginBottom: "-20px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g stroke="currentColor" stroke-linecap="round" stroke-width="2"><path fill="currentColor" fillOpacity="0" stroke-dasharray="34" stroke-dashoffset="34" d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="34;0"></animate><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;0.3"></animate></path><g fill="none" stroke-dasharray="2" stroke-dashoffset="2"><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="2;0"></animate></path><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="2;0"></animate></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></g></g></svg>          
        </div></Typography>
      )
    } else if (timeHours < 18 && timeHours >= 12) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good afternoon</span> <div style={{ marginLeft: "10px", marginBottom: "-20px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g stroke="currentColor" stroke-linecap="round" stroke-width="2"><path fill="currentColor" fillOpacity="0" stroke-dasharray="34" stroke-dashoffset="34" d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="34;0"></animate><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;0.3"></animate></path><g fill="none" stroke-dasharray="2" stroke-dashoffset="2"><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="2;0"></animate></path><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="2;0"></animate></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></g></g></svg>          
        </div></Typography>
      )
    } else if (timeHours < 20 && timeHours >= 18) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good evening</span> <div style={{ marginLeft: "10px", marginBottom: "-20px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g stroke="currentColor" stroke-linecap="round" stroke-width="2"><path fill="currentColor" fillOpacity="0" stroke-dasharray="34" stroke-dashoffset="34" d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="34;0"></animate><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;0.3"></animate></path><g fill="none" stroke-dasharray="2" stroke-dashoffset="2"><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="2;0"></animate></path><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="2;0"></animate></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></g></g></svg>          
      </div></Typography>
      )
    } else {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good night</span> <div style={{ marginLeft: "10px", marginBottom: "-20px" }} >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fillOpacity="0"><path d="m15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z"><animate id="lineMdMoonRisingFilledLoop0" fill="freeze" attributeName="fill-opacity" begin="0.7s;lineMdMoonRisingFilledLoop0.begin+6s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+2.2s" dur="0.4s" values="1;0"></animate></path><path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+3s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+5.2s" dur="0.4s" values="1;0"></animate></path><path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+0.4s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+2.8s" dur="0.4s" values="1;0"></animate></path><path d="m20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+3.4s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingFilledLoop0.begin+5.6s" dur="0.4s" values="1;0"></animate></path></g><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" transform="translate(0 22)"><animateMotion fill="freeze" calcMode="linear" dur="0.6s" path="M0 0v-22"></animateMotion></path></svg>    
        </div>
        </Typography>
      )
    }
    return greeting
  }

  React.useEffect(() => {
    document.title = "Home page"
  }, [])

  return (
    <div >
      <Box sx={{ boxShadow: '0.2px 2px 9px white', marginTop: "calc(1vh + 7px)" }} width="70%" mx="auto" boxShadow={3} style={{
        borderRadius: '10px', padding: '20px', background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        {/* i want the div below to be in the top left of the screen and in the highest z index */}
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: -20, marginTop: "-10px", fontSize: "40px" }} className={HomePageStyle.title} > Welcome to<div className={HomePageStyle.hero} style={{ marginLeft: "10px" }}> Network Analyzer</div></h1>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} className={HomePageStyle.title}> {getTimeGreet()}  </h2>
        <Box sx={{ marginTop: 15, marginBottom: "calc(17%)" }} width="100%" mx="auto">
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: -80, marginRight: "calc(7%)" }} className={HomePageStyle.title}>Learn about the &nbsp;
            <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: "calc(24.2%)" }}>
              <Textra className={HomePageStyle.hero2} data={['Project.', "Goal's.", "Actions."]} effect='topDown' stopDuration={2200} />
            </Box>
            {/* <Console wordsList={['Project.', "Goal's.", "Actions."]}/> */}
          </h1>
          <Stack direction={"row"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: "calc(-14.5%)" }}>
            <Stack spacing={10} direction={"row"}>
              <CircleInfo src={planningCover} title={heroTitle} description={planDesc} />
              <CircleInfo src={developmentCover} title={developTitle} description={developDesc} />
              <CircleInfo src={actionsCover} title={actionTitle} description={actionDesc} />
            </Stack>
          </Stack>
        </Box>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: 40 }} className={HomePageStyle.title}> In cooperation with:</h1>
        {/* <ImageWithOverlay
          imageUrl={KNOARLOGO}
          heading="Visit"
          linkUrl="https://knoar.org/"
        /> */}
        <div className={HomePageStyle.imageContainer} style={{marginBottom: "calc(3.5%)"}}>
          <Stack spacing={17} direction={"row"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title={<Typography fontSize={16}>Go to IAF's website {linkIcon} </Typography>}>
            <a href='https://www.iaf.org.il/' target='_blank' rel="noreferrer" >
              <img src={IAFLOGO} alt='hero1logo' height={150} width={150} />
            </a>
            </Tooltip>

            <Tooltip title={<Typography fontSize={16}>Learn about unit 108 from wikipedia {linkIcon}</Typography>}>
            <a href='https://he.wikipedia.org/wiki/%D7%99%D7%97%D7%99%D7%93%D7%94_108' target='_blank' rel="noreferrer" >
              <img src={BA108LOGO} alt='hero2logo' height={150} width={150} />
            </a>
            </Tooltip>

            <Tooltip title={<Typography fontSize={16}>Go to Kiryat noar's website{linkIcon}</Typography>}>
            <a href='https://knoar.org/' target='_blank' rel="noreferrer" >
              <img src={KNOARLOGO} alt='hero3logo' height={150} width={150} />
            </a>
            </Tooltip>

          </Stack>
        </div>
        <div style={{ marginBottom: "calc(0.5)" }}>
          <ContactBtn />
          <h4 style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'flex-end', marginTop: "-30px", marginBottom: "-3px", zIndex: 999 }} > server ip [ {process.env.REACT_APP_LOCAL_IP_ADDRESS}:8080 ]</h4>
        </div>
      </Box>
      <div>
      </div>
    </div>
  )
}

export default HomePage