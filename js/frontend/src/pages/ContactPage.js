import React from 'react'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import ConsoleText from '../components/consoleText';
import { styled } from '@mui/material/styles';
import Textra from 'react-textra'
import ContactPageStyles from '../Style/ContactPage.module.css'
import StyledButton from '../components/SocialButton';

import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReportLoader from '../components/Loaders/ReportLoader';

const ContactPage = ({ isValidUser, userData }) => {
  React.useEffect(() => {
    document.title = "Contact page"
  }, [])

  const whatsappMessage = 'Hello, I would like to talk with you. I have visited your network analyzer (webapp) and would like to further connect with you.'
  const whatsappLink = `https://wa.me/972546393119?text=${encodeURIComponent(whatsappMessage)}`
  
  const emailAddress = "lolim121212@gmail.com"
  const subject = "Hello, let's talk - from network analyzer (webapp)";
  const emailMessage = 'I would like to talk with you. i have visited your network analyzer webapp and would like to further connect with you.';
  const emailLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailMessage)}`;

  const githubLink = "https://github.com/youboi420"
  
  return (
    <div >
      <Box sx={{ boxShadow: '0.2px 2px 9px white', marginTop: "calc(1vh)" }} width="50%" height="86vh" mx="auto" boxShadow={3} style={{ borderRadius: '10px', padding: '20px', background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0))', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
        <div>
          <h1 className={ContactPageStyles.hero2} style={{marginBottom: "calc(-2%)", marginTop: "calc(-2%)"}}>
          About me:
          </h1>
          <p className={ContactPageStyles.about_me_text}>
          I'm Yair Elad 20 years old. From Zefat, and i study at kiryat noar Jerusalem, im a fast learner. I like hanging out with my friends. Im usually around a Rubik's Cube / computer or the piano when I'm not in class.I love making the most of an experience. My thought process and my motivation for this project was over the roof, especially because I'm doing a project for the IAF system. I am super excited and proud of the system iv'e built with the work my parent's my family friends' teachers, supervisors from the military, and so much more. I think that the product iv'e created is an absolutely amazing piece of technology.
            <br/>
            <Divider orientation="horizontal" sx={{ bgcolor: 'lightblue', borderBottomWidth: 8, marginRight: 30, marginLeft: 30, marginTop: "calc(2%)", marginBottom: "calc(2%)", borderStyle: "double", borderColor: "lightcyan" }} />
            <p className={ContactPageStyles.about_me_text}>
              I love making the most out of an experience. my though process and my motivation for this project was over the roof. especially because im doing a project for the IAF system's.
              <br/>
              I am supper excited and proud of the system iv'e built with the work of god, my parent's my family friend's teachers supervisors from the military, and so much more.
              I think that the product iv'e created is an absolutely amazing piece of technology.
            </p>
            <div className={ContactPageStyles.hobbits} style={{marginTop: "calc(4%)", marginBottom: "calc(-4%)"}}>
              I like: &nbsp;
              <Textra data={['Coding.', "Making music.", "Pen-testing.", "Reverse engineering.", "Learning.", "Experiencing."]} effect='rightLeft' stopDuration={2200} />
            </div>
          </p>
        </div>
        <div className={ContactPageStyles.hero2} style={{marginTop: "70px"}}>
          Contact & Check my socials:
          <Grid container spacing={10} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Grid item style={{marginTop: "calc(3%)"}} className={ContactPageStyles.social}>
              <StyledButton color={"#25c366"} logo={<WhatsAppIcon sx={{fontSize: "135px"}}/>} link={whatsappLink} text={"Whatsapp"} key={"1"}/>
            </Grid>
            <Grid item style={{marginTop: "calc(3%)"}} className={ContactPageStyles.social}>
              <StyledButton color={"#eb4132"} logo={<EmailIcon sx={{fontSize: "140px"}}/>} link={emailLink} text={"Email"} key={"2"}/>
            </Grid>
            <Grid item style={{marginTop: "calc(3%)"}} className={ContactPageStyles.social}>
              <StyledButton color={"#343434"} logo={<GitHubIcon sx={{fontSize: "130px"}}/>} link={githubLink} text={"Github"} key={"3"}/>
            </Grid>
          </Grid>
        </div>
        <div>
        </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px", zIndex: 1000}}>
          <Typography  >
            Network Analyzer - Coded by Yair Elad © {new Date().getFullYear()}
          </Typography>
        </div>
      </Box>
    </div>
  )
}

export default ContactPage
