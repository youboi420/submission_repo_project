import { AppBar, CircularProgress, Dialog, Divider, IconButton, Toolbar, Typography, Tooltip } from '@mui/material'
import React from 'react'
import Transion from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info';
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css'

import { attack_modes_dict } from '../Panels/AnalyzePanelComp'
import PieAttacksComp from './PieAttacksComp'
import DDOSViewComp from '../Views/DDOSViewComp'
import MITMViewComp from '../Views/MITMViewComp'
import TypeWriterLoader from '../Loaders/TypeWriterLoader';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})



const GraphAttacks = ({ isOpen, onCloseCallBack, fileData, DDOSJsonData, MITMJsonData, fetchingStatus, attackMode }) => {
  let title = attackMode === attack_modes_dict.BOTH ? `Info on both Attack's` : `Info on type: ${attackMode} Attack`
  const DDOSCount = DDOSJsonData?.attacks?.length ? DDOSJsonData?.attacks?.length : 0
  const MITMCount = MITMJsonData?.attacks?.length ? MITMJsonData?.attacks?.length : 0
  const myDDOS = DDOSJsonData?.attacks
  const myMITM = MITMJsonData?.attacks

  const MITMAttackExplained = <div style={{ fontSize: "18px", width: "95%" }}>
    mitm or man in the middle is an attack which it's whole porose is to stand in the middle of a two host's communication and get all the transferred data between the two. <br /><br /> there a lot of use cases for this attack from hijacking a session in layer 7 to making a physical change to the arp table in the host's cache. <br /><br /> it is usually related to poisoning which is a special technique fo preforming  the attack. poisoning is where you send a lot of response's to a host and try to make it change it's arp table/cache
  </div>

  const DDOSAttackExplained = <div style={{ fontSize: "18px", width: "95%" }}>
    ddos or distributed denial of service attack is an attack which it's whole porose is to deny other's from getting a service.
    <br/><br/>
    denial of service is an attack situation where a malicious actor want to take down a service for example some one trying to overwhelm the router with a lot of request's so it'l get busy and won't response.
    <br/><br/>
    ddos can be multiple bad actors just abusing a simple bug to prevent you from buying a ticket to a movie or it can be a million plus devices (bot-net) to try and attack a bank.
    <br/><br/>
    the attack can range and also it's techniques.

  </div>

  return (
    <div>
      <Dialog
        fullScreen
        TransitionComponent={Transition}
        open={isOpen}
        onAbort={onCloseCallBack}
        onClose={onCloseCallBack}
        PaperProps={{
          sx: {
            backgroundColor: '#EEEEEE',
            opacity: "100%",
            marginTop: "100px",
            marginRight: "100px",
            marginLeft: "100px",
          },
        }}
      >
        <AppBar sx={{ position: 'sticky' }} style={{ top: 0, zIndex: 1000, backgroundColor: 'rgba(25, 118, 210, 0.9)' }} >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onCloseCallBack}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: '20px' }} variant="h6" component="div">
              Attack's report of file: {fileData?.filename ? fileData?.filename : "Somehow not selected"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ backgroundColor: "transparent", height: "100vh" }} className={AnalyzePanelViewStyle.data_title} >
          {
            (MITMCount === 0 && DDOSCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.BOTH &&
            <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(8%)" }} >
              <svg style={{ marginTop: "40px", marginBottom: "70px" }} xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 48 48"><g fill="none" stroke="#000" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M24 6H9C7.34315 6 6 7.34315 6 9V31C6 32.6569 7.34315 34 9 34H39C40.6569 34 42 32.6569 42 31V27"></path><path stroke-linecap="round" d="M24 34V42"></path><rect width="12" height="8" x="30" y="12" fill="#2F88FF" rx="3"></rect><path fill="#2F88FF" d="M36 6C37.6569 6 39 7.34315 39 9L39 12L33 12L33 9C33 7.34315 34.3431 6 36 6Z"></path><path stroke-linecap="round" d="M14 42L34 42"></path></g></svg>
              <br/>
              There were no detected DDoS/MITM attack's in this network recording file
            </h1>
          }
          {
            !(MITMCount === 0 && DDOSCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.BOTH &&
            <div>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >{title}</h1>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                {DDOSCount} ddos attacks and {MITMCount} MITM attacks
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                <PieAttacksComp MITM={MITMCount} DDOS={DDOSCount} />
              </div>
              <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginTop: 5, marginBottom: 5 }} />
              {
                myDDOS &&
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                  <Tooltip title={DDOSAttackExplained} style={{ zIndex: 2000, cursor: "zoom-in" }}>
                      <h1>
                        DDOS Attack's <InfoIcon sx={{ mr: "5px", mb: "-2px" }} />
                      </h1>
                  </Tooltip>
                  <div>
                  <DDOSViewComp attacskDataArray={myDDOS} singleMode={true} filename={fileData?.filename} />
                  </div>
                </div>
                  <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginBottom: 5, marginTop: 5 }} />
                </div>
              }
              {
                myMITM &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                  <Tooltip title={MITMAttackExplained} style={{ cursor: "zoom-in" }}>
                    <div style={{ marginTop: "-20px" }} >
                      <h1>
                        MITM Attack's <InfoIcon sx={{ mr: "5px", mb: "-2px" }} />
                      </h1>
                    </div>
                  </Tooltip>
                  <MITMViewComp attacskDataArray={myMITM} singleMode={true} filename={fileData?.filename} />
                  <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginBottom: 20 }} />
                </div>
              }
            </div>
          }
          {
            (DDOSCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.DDOS &&
            <div>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(8%)" }} >
                  <svg style={{ marginTop: "40px", marginBottom: "70px" }} xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 48 48"><g fill="none" stroke="#000" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M24 6H9C7.34315 6 6 7.34315 6 9V31C6 32.6569 7.34315 34 9 34H39C40.6569 34 42 32.6569 42 31V27"></path><path stroke-linecap="round" d="M24 34V42"></path><rect width="12" height="8" x="30" y="12" fill="#2F88FF" rx="3"></rect><path fill="#2F88FF" d="M36 6C37.6569 6 39 7.34315 39 9L39 12L33 12L33 9C33 7.34315 34.3431 6 36 6Z"></path><path stroke-linecap="round" d="M14 42L34 42"></path></g></svg>
                  <br />
                There were no detected distributed denial of service (DDoS) attacks!
              </h1>
            </div>
          }
          {
            !(DDOSCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.DDOS &&
            <div  >
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >{title}</h1>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                {DDOSCount} Distributed denail of service attacks
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                <DDOSViewComp attacskDataArray={myDDOS} singleMode={true} filename={fileData?.filename}/>
              </div>
              {/* {
                fetchingStatus &&
                <div>
                  We good :) // still loading infintly...
                </div>
              } */}
            </div>
          }
          {
            (MITMCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.MITM &&
            <div>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(8%)" }} >
                  <svg style={{ marginTop: "40px", marginBottom: "70px" }} xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 48 48"><g fill="none" stroke="#000" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M24 6H9C7.34315 6 6 7.34315 6 9V31C6 32.6569 7.34315 34 9 34H39C40.6569 34 42 32.6569 42 31V27"></path><path stroke-linecap="round" d="M24 34V42"></path><rect width="12" height="8" x="30" y="12" fill="#2F88FF" rx="3"></rect><path fill="#2F88FF" d="M36 6C37.6569 6 39 7.34315 39 9L39 12L33 12L33 9C33 7.34315 34.3431 6 36 6Z"></path><path stroke-linecap="round" d="M14 42L34 42"></path></g></svg>
                  <br />
                  There were no detected man in the middle (MITM) attacks!
              </h1>
            </div>
          }
          {
            !(MITMCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.MITM &&
            <div>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >{title}</h1>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                {MITMCount} Man in the middle attacks
              </h1>
              {
                myMITM &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                  <MITMViewComp attacskDataArray={myMITM} singleMode={true} filename={fileData?.filename} />
                  <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginBottom: 5 }} />
                </div>
              }
            </div>
          }
          { // this is a comment... 
            !fetchingStatus &&
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 'calc(22%)'}}>
              {/* <CircularProgress style={{ marginTop: 'calc(22%)' }} size={"100px"} /> */}
              <TypeWriterLoader />
            </div>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default GraphAttacks