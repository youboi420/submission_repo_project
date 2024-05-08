import { AppBar, Button, CircularProgress, Dialog, Divider, Grid, IconButton, Radio, Slider, Stack, TextField, Toolbar, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import React from 'react'
import Transion from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css'

import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as analyze_service from '../../services/analyze_service'
import L4TimePacketChartComp from "../L4TimePacketDataChartComp"
import PieL4ProtocolsComp from './PieL4ProtocolsComp'
import L4TopHosts from '../L4TopHostsByPackets'
import L4TopHostsBySize from '../L4TopHostsBySize'
import WinSizeChartComp from './WinSizeChartComp'
import FlagsChartComp from './FlagsChartComp'

import SaveAsIcon from '@mui/icons-material/SaveAs'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { NOTIFY_TYPES, notify } from '../../services/notify_service'
import TypeWriterLoader from '../Loaders/TypeWriterLoader'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})


const convInRange = (conv, startTime, endTime) => {
  return (
    conv?.packets_data[0]?.time_stamp_rltv >= startTime && conv?.packets_data[0]?.time_stamp_rltv <= endTime
  )
}

const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
  height: 5,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
    '&:before': {
      boxShadow:
        '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 5,
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    boxShadow: 'inset 0px 0px 4px -2px #000',
    backgroundColor: 'lightblue',
  },
}));

const tcpFlagTypes = {
  fin_flag: 0x01,
  syn_flag: 0x02,
  rst_flag: 0x04,
  psh_flag: 0x08,
  ack_flag: 0x10,
  urg_flag: 0x20
}

const GraphL4Comp = ({ isOpen, onCloseCallBack, fileData, jsonData, fetchingStatus, conv_count }) => {
  const [convIndex, setConvIndex] = React.useState(0);
  const [convIndexLabel, setConvIndexLabel] = React.useState(1);
  const [packetSizeChartData, setPacketSizeChartData] = React.useState({ xDataPoints: [], yDataPoints: [] });
  const [windowSizeChartData, setWindowSizeChartData] = React.useState({ xDataPoints: [], yDataPoints: [] });
  const [packetFlagsChartData, setPacketFlagsChartData] = React.useState({ xDataPoints: [], yDataPoints: [] });
  const [sliderValue, setSliderValue] = React.useState([0, Number.MAX_SAFE_INTEGER]);
  const [minInputValue, setMinInputValue] = React.useState('0');
  const [maxInputValue, setMaxInputValue] = React.useState(Number.MAX_SAFE_INTEGER.toString());
  const [conversationDetails, setConversationDetails] = React.useState([]);

  const maxDuration = new Number(jsonData?.duration).toFixed(3) || 0;
  const minDistance = 0.1

  const handleMinInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= parseFloat(maxInputValue)) {
      setMinInputValue(newValue.toString());
      setSliderValue([newValue, parseFloat(maxInputValue)]);
    }
  };
  const handleMaxInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue >= parseFloat(minInputValue) && newValue <= maxDuration) {
      setMaxInputValue(newValue.toString());
      setSliderValue([parseFloat(minInputValue), newValue]);
    }
  };

  const handlePageInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue >= 1 && newValue <= conversationDetails?.length) {
      setConvIndex(newValue - 1);
      setConvIndexLabel(newValue);
    }
  };

  const handleSliderChange = (event, newValue) => {
    const newMinValue = Math.min(newValue[0], sliderValue[1] - minDistance);
    const newMaxValue = Math.max(newValue[1], sliderValue[0] + minDistance);
    setSliderValue([newMinValue, newMaxValue]);
    setMinInputValue(newMinValue.toString());
    setMaxInputValue(newMaxValue.toString());
  };
  

  React.useEffect(() => {
    const maxDuration = jsonData?.duration || 0;
    setConvIndexLabel(1)
    setSliderValue([0, maxDuration]);
    setMinInputValue('0');
    setMaxInputValue((Number(maxDuration).toFixed(3)).toString());
    const filteredConversations = jsonData?.l4_conversations || [];
    setConversationDetails(filteredConversations);
  }, [jsonData])

  React.useEffect(() => {
    if (jsonData && jsonData?.l4_conversations !== undefined) {
      const conversations = jsonData?.l4_conversations[convIndex] ? jsonData?.l4_conversations[convIndex] : null;
      if (conversations?.packets_data) {
        const packetSize_xDataPoints = [];
        const packetSize_yDataPoints = [];

        const ws_xDataPoints = [];
        const ws_yDataPoints = [];

        const flags_xDataPoints = [];
        const flags_yDataPoints = [];


        for (let index = 0; index < conversations.packets_data.length; index++) {
          const packet = conversations.packets_data[index];
          const packet_size_point = { x: packet.time_stamp_date_js, rltvX: packet.time_stamp_rltv, y: packet.size_in_bytes };
          const window_size_point = { x: packet.time_stamp_date_js, rltvX: packet.time_stamp_rltv, y: (packet?.win_size) ? (packet?.win_size) : -1 };
          const flags_point = { x: packet.time_stamp_date_js, rltvX: packet.time_stamp_rltv, y: (packet?.tcp_flags) ? (packet?.tcp_flags) : -1 };


          const time = new Date(packet_size_point.x).getTime();

          packetSize_xDataPoints.push(time);
          packetSize_yDataPoints.push(packet_size_point.y);

          ws_xDataPoints.push(time);
          ws_yDataPoints.push(window_size_point.y);

          flags_xDataPoints.push(time);
          flags_yDataPoints.push({
            "fin_flag": flags_point.y & tcpFlagTypes.fin_flag,
            "syn_flag": flags_point.y & tcpFlagTypes.syn_flag,
            "rst_flag": flags_point.y & tcpFlagTypes.rst_flag,
            "psh_flag": flags_point.y & tcpFlagTypes.psh_flag,
            "ack_flag": flags_point.y & tcpFlagTypes.ack_flag,
            "urg_flag": flags_point.y & tcpFlagTypes.urg_flag
          });
        }
        setPacketSizeChartData({ xDataPoints: packetSize_xDataPoints, yDataPoints: packetSize_yDataPoints });
        setWindowSizeChartData({ xDataPoints: ws_xDataPoints, yDataPoints: ws_yDataPoints })
        setPacketFlagsChartData({ xDataPoints: flags_xDataPoints, yDataPoints: flags_yDataPoints })
      }
    }
  }, [convIndex, jsonData]);

  React.useEffect(() => {
    // if (!!jsonData?.l4_conversations) return;
    const filteredConversations = jsonData?.l4_conversations?.filter(conv => convInRange(conv, minInputValue, maxInputValue))
    setConversationDetails(filteredConversations || []);
  }, [minInputValue, maxInputValue, sliderValue]);

  React.useEffect(() => {
    // if (!!jsonData?.l4_conversations) return;
    setConvIndex(0)
  }, [conversationDetails?.length]);
  
  const nextPage = () => {
    const numOfPages = conversationDetails?.length || 0;
    setConvIndex(prev => (prev + 1 < numOfPages ? prev + 1 : numOfPages - 1));
    setConvIndexLabel(prev => (prev + 1 <= numOfPages ? prev + 1 : numOfPages - 1));
  };

  const lastPage = () => {
    setConvIndex(prev => (prev - 1 >= 0 ? prev - 1 : 0));
  };

  const exportL4vToPDF = (conversation) => {
    const cap = document.querySelector(`.L4Graphs`);
    const exportButton = document.querySelector('.exportL4vButton');
    exportButton.style.visibility = 'hidden';
    const scaleFactor = 1;
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('l', 'mm', 'a4');
      const compWidth = doc.internal.pageSize.getWidth();
      const compHeight = doc.internal.pageSize.getHeight();
      console.log(compWidth, compHeight);
      doc.text("Visual representation of OSI - Layer 4", compWidth / 2, 20, { align: 'center' });
      doc.addImage(imgData, 'PNG', 0, 30, compWidth, compHeight / 3);
      doc.save(`L4Visual.pdf`);
      exportButton.style.visibility = 'visible';
    });
  };

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setSliderValue([Math.min(newValue[0], sliderValue[1] - minDistance), sliderValue[1]]);
    } else {
      setSliderValue([sliderValue[0], Math.max(newValue[1], sliderValue[0] + minDistance)]);
    }
  };

  const marks = [
    {
      value: 0,
      label: "0's",
    },
    {
      value: (maxDuration / 2).toFixed(1),
      label: `${(maxDuration / 2).toFixed(1)}'s`,
    },
    {
      value: maxDuration,
      label: `${maxDuration}'s`,
    },
  ];

  const exportconvToPDF = (conversation) => {
    const cap = document.querySelector(`.convGraphs`);
    const exportButton = document.querySelector('.exportconvButton');
    exportButton.style.visibility = 'hidden';
    const scaleFactor = 1;
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('l', 'mm', 'a4');
      const compWidth = doc.internal.pageSize.getWidth();
      const compHeight = doc.internal.pageSize.getHeight();
      console.log(compWidth, compHeight);
      doc.text(`Visual representation of conversation ${convIndex + 1} (${jsonData?.l4_conversations[convIndex]?.conv_type}) - Layer 4`, compWidth / 2, 10, { align: 'center' });
      doc.addImage(imgData, 'PNG', 0, 25, compWidth, compHeight / 1.2);
      doc.save(`visual_of_conversation_${convIndex + 1}.pdf`);
      exportButton.style.visibility = 'visible';
    });
  };

  return (
    <div>
      <Dialog
        fullScreen
        TransitionComponent={Transition}
        open={isOpen}
        onAbort={() => { setConvIndex(0); onCloseCallBack() }}
        onClose={() => { setConvIndex(0); onCloseCallBack() }}
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
              Layer 4 - Visual report of file: {fileData?.filename ? fileData?.filename : "Somehow not selected"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ backgroundColor: "transparent", height: "100vh" }} className={AnalyzePanelViewStyle.data_title} >
          <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >Visual representation of OSI - Layer 4</h1>
          {
            !fetchingStatus &&
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 'calc(20%)'}}>
            {/* <CircularProgress style={{ marginTop: 'calc(22%)' }} size={"100px"} /> */}
            <TypeWriterLoader />
          </div>
          }
          {
            fetchingStatus &&
            <div style={{ height: "110%" }}>
              <div style={{ zIndex: 1000, position: "relative", left: "calc(83%)", marginBottom: "calc(7% - 120px)" }}>
                <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={exportL4vToPDF} aria-label="export to PDF" endIcon={<SaveAsIcon sx={{ mb: "4px" }} />} className='exportL4vButton'>
                  <Typography variant="div">Export L4 Visual's to PDF</Typography>
                </Button>
              </div>
              <div className='L4Graphs'>
                <Grid container spacing={0} >
                  <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PieL4ProtocolsComp tcpConversations={jsonData?.tcp_count} udpConversations={jsonData?.udp_count} />
                  </Grid>
                  <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <L4TopHosts jsonData={jsonData} height={'400px'} width={'100%'} />
                  </Grid>
                  <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <L4TopHostsBySize jsonData={jsonData} height={'350px'} width={'100%'} />
                  </Grid>
                </Grid>
              </div>
              <Divider orientation='horizontal' sx={{ borderWidth: "2px", marginBottom: "10px", marginRight: "calc(40% - 200px)", marginLeft: "calc(40% - 200px)", borderColor: "rgba(0, 0, 0, 0.52)" }} />
              <div>
                <div style={{ zIndex: 1000, position: "relative", left: "calc(61%)", marginBottom: "calc(7% - 160px)" }}>
                  <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={exportconvToPDF} aria-label="export to PDF" endIcon={<SaveAsIcon sx={{ mb: "4px" }} />} className='exportconvButton'>
                    <Typography variant="div">Export Conversation Visual's to PDF</Typography>
                  </Button>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={lastPage}
                    aria-label="close"
                    sx={{ marginRight: "calc(0.1%)", marginBottom: "calc(-1%)" }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  {
                    jsonData?.l4_conversations &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "calc(1%)"}}> Conversation 
                    <TextField
                      label="Index"
                      type="number"
                      value={convIndexLabel}
                      onChange={handlePageInputChange}
                      variant="outlined"
                      sx={{ marginLeft: "calc(1%)", marginRight: "calc(1%)", width: "20%" }}
                      InputProps={{ inputProps: { min: 0, max: conversationDetails?.length - 1 } }}
                    /> of {conversationDetails?.length} - type: {jsonData?.l4_conversations[convIndex]?.conv_type} </div>
                  }
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={nextPage}
                    aria-label="close"
                    sx={{ marginLeft: "calc(0.1%)", marginBottom: "calc(-1%)" }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </div>
                <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: "-20px" }}>
                  Time Filter
                </h4>
                <Stack style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: "20px", marginTop: "20px" }}>
                  <IOSSlider disableSwap style={{ width: '70%' }} getAriaLabel={() => 'Temperature'} min={0} max={maxDuration} step={0.1} value={sliderValue} valueLabelDisplay="auto" onChange={handleSliderChange} marks={marks} />
                </Stack>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "20px" }}>
                  <TextField
                    label="Min duration in second's"
                    type="number"
                    value={minInputValue}
                    onChange={handleMinInputChange}
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0, max: parseFloat(maxInputValue) } }}
                  />
                  <TextField
                    label="Max duration in second's"
                    type="number"
                    value={maxInputValue}
                    onChange={handleMaxInputChange}
                    variant="outlined"
                    InputProps={{ inputProps: { min: parseFloat(minInputValue), max: maxDuration } }}
                  />
                </div>
              </div>
              {
                conversationDetails?.length === 0 &&
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                  <h1>
                    Conversation's didn't occur during this time
                  </h1>
                </div>
              }
              {
                conversationDetails?.length !== 0 &&
                <div className='convGraphs'>
                  {
                    packetSizeChartData.xDataPoints &&
                    packetSizeChartData.yDataPoints &&
                    jsonData?.l4_conversations &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: jsonData?.l4_conversations[convIndex]?.conv_type === analyze_service.l4MODES.TCP ? "20px" : "100px" }}>
                      <L4TimePacketChartComp key={packetSizeChartData.xDataPoints} xDataPoints={packetSizeChartData.xDataPoints} yDataPoints={packetSizeChartData.yDataPoints} height={jsonData?.l4_conversations[convIndex]?.conv_type === analyze_service.l4MODES.TCP ? "420px" : "550px"} width={"95%"} />
                    </div>
                  }
                  {
                    jsonData?.l4_conversations &&
                    jsonData?.l4_conversations[convIndex]?.conv_type === analyze_service.l4MODES.TCP &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "100px", marginRight: "calc(0.75%)", marginLeft: "calc(0.75%)" }} >
                      <Grid container spacing={-5} >
                        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <WinSizeChartComp key={windowSizeChartData.xDataPoints} xDataPoints={windowSizeChartData.xDataPoints} yDataPoints={windowSizeChartData.yDataPoints} height={"550px"} width={"96%"} />
                        </Grid>
                        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <FlagsChartComp key={packetFlagsChartData.xDataPoints} xDataPoints={packetFlagsChartData.xDataPoints} yDataPoints={packetFlagsChartData.yDataPoints} height={"550px"} width={"96%"} />
                        </Grid>
                      </Grid>
                    </div>
                  }
                </div>
              }
            </div>
          }
          {
            fetchingStatus &&
            (conv_count === 0 || conv_count === undefined) &&
            <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className={AnalyzePanelViewStyle.data_title} >
              No valid Layer 4 data provided in your file...
            </h2>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default GraphL4Comp