import { AppBar, CircularProgress, Dialog, Divider, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import Transion from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css'

import { attack_modes_dict } from '../Panels/AnalyzePanelComp'
import PieAttacksComp from './PieAttacksComp'
import DDOSViewComp from '../Views/DDOSViewComp'
import MITMViewComp from '../Views/MITMViewComp'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})



const GraphAttacks = ( { isOpen, onCloseCallBack, fileData, DDOSJsonData, MITMJsonData, fetchingStatus, attackMode } ) => {
  let title = attackMode === attack_modes_dict.BOTH ? `Info on both Attack's` : `Info on type: ${attackMode} Attack`
  const DDOSCount = DDOSJsonData?.attacks?.length ? DDOSJsonData?.attacks?.length : 0
  const MITMCount = MITMJsonData?.attacks?.length ? MITMJsonData?.attacks?.length : 0
  const myDDOS = DDOSJsonData?.attacks
  const myMITM = MITMJsonData?.attacks
  
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
            <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(20%)"}} >
              Fortenly there were no DDoS/Man in the middle attack's in this network record :)
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
                    <DDOSViewComp attacskDataArray={myDDOS} singleMode={true}/>
                  </div>
                  <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginBottom: 5 }} />
                </div>
              }
              {
                myMITM &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                  <MITMViewComp attacskDataArray={myMITM} singleMode={true}/>
                  <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginBottom: 5 }} />
                </div>
              }
            </div>
          }
          {
            (DDOSCount === 0) &&
            fetchingStatus &&
            attackMode === attack_modes_dict.DDOS &&
            <div>
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(22%)" }} >There were no distributed denail of service (DDoS) attacks!</h1>
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
                <DDOSViewComp attacskDataArray={myDDOS} singleMode={true}/>
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
              <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(22%)" }} >There were no man in the middle (MITM) attacks!</h1>
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
                  <MITMViewComp attacskDataArray={myMITM} singleMode={true}/>
                  <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 15, marginLeft: 15, marginBottom: 5 }} />
                </div>
              }
            </div>
          }
          { // this is a comment... 
            !fetchingStatus && 
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
              <CircularProgress style={{ marginTop: 'calc(22%)' }} size={"100px"} />
            </div>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default GraphAttacks