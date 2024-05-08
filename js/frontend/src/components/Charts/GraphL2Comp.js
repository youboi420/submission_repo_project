import { AppBar, CircularProgress, Dialog, IconButton, Toolbar, Typography, Button } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import React from 'react'
import Transion from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css'

import * as analyze_service from '../../services/analyze_service'
import PieL4ProtocolsComp from './PieL4ProtocolsComp'
import PieL2ProtocolsComp from './PieL2ProtocolsComp'
import L2TimePacketChartComp from './L2TimePacketDataChartComp'

import SaveAsIcon from '@mui/icons-material/Save'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import TypeWriterLoader from '../Loaders/TypeWriterLoader'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})

const GraphL2Comp = ({ isOpen, onCloseCallBack, fileData, jsonData, fetchingStatus, conv_count }) => {
  let title = "Visual representation of OSI - Layer 2: ARP Protocol"
  let arpRESCount = 0
  let arpREQCount = 0
  const reqXDataPoints = []
  const reqYDataPoints = []
  const resXDataPoints = []
  const resYDataPoints = []

  const lenOfArr = jsonData?.L2_conversations?.length

  jsonData?.L2_conversations?.forEach(conversation => {
    conversation["packets_data"].forEach(packet => {
      if (packet["type"] === "REQ") {
        reqYDataPoints.push(1)
        reqXDataPoints.push(new Date(packet["time_stamp_date_js"]))
        arpREQCount++;
      } else if (packet["type"] === "RES") {
        arpRESCount++;
        resYDataPoints.push(0)
        resXDataPoints.push(new Date(packet["time_stamp_date_js"]))
      }
    });
  });

  const totalPages = jsonData?.L2_conversations?.length

  const exportL2vToPDF = () => {
    const cap = document.querySelector(`.L2Graphs`);
    const exportButton = document.querySelector('.exportL2vButton');
    exportButton.style.visibility = 'hidden';
    const scaleFactor = 1;
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('l', 'mm', 'a4');
      const compWidth = doc.internal.pageSize.getWidth();
      const compHeight = doc.internal.pageSize.getHeight();
      console.log(compWidth, compHeight);
      doc.text("Visual representation of OSI (ARP) - Layer 2", compWidth / 2, 20, { align: 'center' });
      doc.addImage(imgData, 'PNG', 0, 30, compWidth, compHeight / 1.8);
      doc.save(`L2Visual.pdf`);
      exportButton.style.visibility = 'visible';
    });
  };

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
              Layer 2 - Visual report of file: {fileData?.filename ? fileData?.filename : "Somehow not selected"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ backgroundColor: "transparent", height: "100vh" }} className={AnalyzePanelViewStyle.data_title} >
          <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >{title}</h1>
          {
            !fetchingStatus &&
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 'calc(20%)' }}>
              {/* <CircularProgress style={{ marginTop: 'calc(22%)' }} size={"100px"} /> */}
              <TypeWriterLoader />
            </div>
          }
            {
              fetchingStatus && lenOfArr !== 0 &&
              <div style={{ zIndex: 1000, position: "relative", left: "calc(83%)", marginTop: "calc(7% - 180px)" }}>
                <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={exportL2vToPDF} aria-label="export to PDF" endIcon={<SaveAsIcon sx={{ mb: "4px" }} />} className='exportL2vButton'>
                  <Typography variant="div">Export L2 Visual's to PDF</Typography>
                </Button>
              </div>
            }
          <div className='L2Graphs'>
            {
              fetchingStatus &&
              !((arpRESCount === 0 || arpRESCount === undefined) || (arpREQCount === 0 || arpREQCount === undefined)) &&
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                <L2TimePacketChartComp reqXDataPoints={reqXDataPoints} reqYDataPoints={reqYDataPoints} resXDataPoints={resXDataPoints} resYDataPoints={resYDataPoints} height={"200%"} width={"100%"} />
              </div>
            }
            {
              fetchingStatus &&
              !((arpRESCount === 0 || arpRESCount === undefined) || (arpREQCount === 0 || arpREQCount === undefined)) &&
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                <PieL2ProtocolsComp res={arpRESCount} req={arpREQCount} />
              </div>
            }
          </div>

          {
            fetchingStatus && lenOfArr === 0 &&
            <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: "calc(20%)" }} className={AnalyzePanelViewStyle.data_title} >
              Arp conversations didn't accour
            </h1>
          }
          {
            fetchingStatus && lenOfArr !== 0 &&
            ((arpRESCount === 0 || arpRESCount === undefined) || (arpREQCount === 0 || arpREQCount === undefined)) &&
            <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className={AnalyzePanelViewStyle.data_title} >
              No valid Layer 2 data provided in your file...
            </h2>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default GraphL2Comp