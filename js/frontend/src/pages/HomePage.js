import React from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import WbNightIcon from '@mui/icons-material/Bedtime'
import HomePageStyle from '../Style/HomePage.module.css'
import InfoCard from '../components/InfoCard'

import IAFLOGO from "../Images/iaflogo.png"
import BA108LOGO from "../Images/logo1.png"
import KNOARLOGO from "../Images/knoarlogo.jpg"

import actionsCover from "../Images/actionsCover.jpeg"
import developmentCover from "../Images/devCover.jpg"
import planningCover from "../Images/planningCover.jpg"

const HomePage = ({ isValidUser, userData }) => {
  const heroTitle = "About the project "
  const developTitle = "Dev - Goal's"
  const actionTitle = "User action's"
  
  const actionDesc = (
    <div className={HomePageStyle.desc}>
      <h1 style={{ marginTop: -25, display: 'flex', alignItems: 'center', textAlign: "center", justifyContent: "center" }} >User action's</h1>
      <h3>A quick start on the Network Analyzer</h3>
      <br/>
      <div style={{ marginTop: -30 }}>
        As a user you can go to the analyze and files page (in the navbar) and you can:
        <ul>
          <li style={{marginTop: "-10px"}} >Upload a network record</li>
          <li style={{marginTop: "4px"}} >Download an existing network record <br/>(also from another device)</li>
          <li style={{marginTop: "4px"}} >Delete an existing network record <br/>(also from another device)</li>
          <li style={{marginTop: "4px"}} >Analyze a file</li>
          <li style={{marginTop: "4px"}} >Get report of a file</li>
          <li style={{marginTop: "4px"}} >Get visual report of a file</li>
        </ul>
      </div>
      <div style={{ marginTop: -15 }}>
        {
          isValidUser && userData?.isadmin &&
          <div>
            <h3 style={{ marginTop: "30px", marginBottom: "-10px" }} >As an admin you can also go to the user's page (in the navbar) and: </h3>
            <ul>
              <li style={{marginTop: "4px"}} >Create a user</li>
              <li style={{marginTop: "4px"}} >Delete a user</li>
              <li style={{marginTop: "4px"}} >Update a user</li>
              <li style={{marginTop: "4px"}} >Get a list of all the user's </li>
            </ul>
          </div>
        }
      </div>
    </div>
  )
  

  const developDesc = (
    <div className={HomePageStyle.desc}>
      <h1 style={{ marginTop: -25, display: 'flex', alignItems: 'center', textAlign: "center", justifyContent: "center" }}>Development & Goal's</h1>
      <br/>
      <div style={{ marginTop: -15 }}>
        Developing the project was a great experience from going to the base to learn with my army moderator, to learning in class how to use react and so on. i had a very positive and maturing experience, and i am very grateful for what i have achieved in the given development time period.
        <br/>
        <br/>
        The development process itself was a blast. i had a real good time learning new coding techniques, new tools, and new technologies. i really got aspired by my moderator's and surroundings. 
        <br/>
        <br/>
        Before starting the project i've set up some goals for myself and the project itself.
        <br/>
        <h4 style={{marginBottom: -10, marginTop: 8}}>My goal's were: </h4>
        <ul>
          <li style={{marginTop: "4px"}} >Create a clean and expandable codebase</li>
          <li style={{marginTop: "4px"}} >Integrate the system to the unit</li>
          <li style={{marginTop: "4px"}} >Achieve a great user experience and friendly interface</li>
        </ul>
        <br/>
      </div>

    </div>
  )
  
  const planDesc = (
    <div className={HomePageStyle.desc}>
      <h1 style={{ marginTop: -25, display: 'flex', alignItems: 'center', textAlign: "center", justifyContent: "center" }}>About</h1>
      <p>
        This is the a network analyzer web application which it's all target is to automate/shorten the job's of those who really care about their time and effort, it is designed to be user friendly and easy to use.
        it is a very capable piece of software with a lot of great analyzing techniques and features. following strict RFC rules, uses wildly common design patterns and so on.
        <br/>
        it is build in the react framework {/* logo */} and uses node.js runtime
        <br/>
        <br/>
        The main idea is to connect all the manual analyzing process into one big web application. that organized both the network recording files and it's corresponding report's.
        <br/>
        <br/>
        Network analyzer web app has a lot to offer and it's a great interface for investigation team's to handle all the research automatically and with a lot of features, both verbal and visual report's.
      </p>
      
    </div>
  )
  
  const getTimeGreet = () => {
    const timeHours = new Date().getHours()
    let greeting

    if (timeHours < 12 && timeHours >= 5) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good morning</span> <WbSunnyIcon style={{ marginLeft: "10px", marginTop: "4px" }} /> </Typography>
      )
    } else if (timeHours < 18 && timeHours >= 12) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good afternoon</span> <WbTwilightIcon style={{ marginLeft: "10px", marginTop: "4px" }} /> </Typography>
      )
    } else if (timeHours < 20 && timeHours >= 18) {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good evening</span> <WbTwilightIcon style={{ marginLeft: "10px", marginTop: "4px" }} /> </Typography>
      )
    } else {
      greeting = (
        <Typography style={{ display: 'flex', alignItems: 'center', fontSize: "35px", fontFamily: "inherit" }}> <span className={HomePageStyle.hero3} >Good night</span> <WbNightIcon style={{ marginLeft: "10px", marginTop: "4px" }} /> </Typography>
      )
    }
    return greeting
  }

  React.useEffect(() => {
    document.title = "Home page"
  }, [])
  
  return (
    <div >
      <Box sx={{ boxShadow: '0.2px 2px 9px white', marginTop: 3}} width="70%" mx="auto" boxShadow={3} style={{ backdropFilter: 'blur(25px)', borderRadius: '10px', padding: '20px' }}>
        {/* i want the div below to be in the top left of the screen and in the highest z index */}
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: -20, marginTop: "-10px", fontSize: "40px" }} className={HomePageStyle.title} > Welcome to<div className={HomePageStyle.hero} style={{marginLeft: "10px"}}> Network Analyzer</div></h1>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} className={HomePageStyle.title}> {getTimeGreet()}  </h2>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: 40 }} className={HomePageStyle.title}> In cooperation with:</h1>
        <div className={HomePageStyle.imageContainer}>
        <Stack spacing={8} direction={"row"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <a href='https://www.iaf.org.il/' target='_blank' rel="noreferrer" >
            <img src={IAFLOGO} alt='hero1logo'   height={150} width={150} />
          </a>
          <Divider orientation="vertical" sx={{ bgcolor: 'white', borderWidth: 2}} />
          <a href='https://he.wikipedia.org/wiki/%D7%99%D7%97%D7%99%D7%93%D7%94_108' target='_blank' rel="noreferrer" >
            <img src={BA108LOGO} alt='hero2logo' height={150} width={150} />
          </a>
          <Divider orientation="vertical" sx={{ bgcolor: 'white', borderWidth: 2}} />
          <a href='https://knoar.org/' target='_blank' rel="noreferrer" >
            <img src={KNOARLOGO} alt='hero3logo' height={150} width={150} />
          </a>
        </Stack>
        </div>
        <Box sx={{ marginTop: 15, marginBottom: "calc(17%)" }} width="100%" mx="auto">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: -80 }} className={HomePageStyle.title}>A little bit about the <div className={HomePageStyle.hero2} style={{marginLeft: "10px"}}>Project</div></h1>
        <Stack direction={"row"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: -170  }}>
          <Stack spacing={10} direction={"row"}>
            <InfoCard src={planningCover} title={heroTitle} description={planDesc} />
            <InfoCard src={developmentCover} title={developTitle} description={developDesc} />
            <InfoCard src={actionsCover} title={actionTitle} description={actionDesc} />
          </Stack>
        </Stack>
      </Box>
        <div style={{ marginTop: "8px", marginBottom: "-10px" }}>
          <Typography  >
            Network Analyzer - Coded by Yair Elad © {new Date().getFullYear()}
          </Typography>
        </div>
        <h4 style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'flex-end', marginTop: "-20px", marginBottom: "-3px",zIndex: 999 }} > server ip {process.env.REACT_APP_LOCAL_IP_ADDRESS}</h4>
      </Box>
    </div>
  )
}

export default HomePage
