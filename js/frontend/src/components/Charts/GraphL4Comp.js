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
    setConvIndexLabel(filteredConversations?.length ? 1 : 0)
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
    setConvIndexLabel(prev => (prev - 1 >= 0 ? prev - 1 : 0));
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
      doc.save(`${fileData?.filename}L4_Visuals.pdf`);
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
      doc.save(`${fileData?.filename}_visual_of_conversation_${convIndex + 1}.pdf`);
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
          <Button onClick={() => { notify(conv_count, NOTIFY_TYPES.info) }}>

          </Button>
          <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >Visual representation of OSI - Layer 4</h1>
          {
            !fetchingStatus &&
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 'calc(20%)' }}>
              {/* <CircularProgress style={{ marginTop: 'calc(22%)' }} size={"100px"} /> */}
              <TypeWriterLoader />
            </div>
          }
          {
            fetchingStatus &&
            !(conv_count === 0 || conv_count === undefined) &&
            <div style={{ height: "110%" }}>
              <div style={{ zIndex: 1000, position: "relative", left: "calc(83%)", marginBottom: "calc(7% - 120px)" }}>
                <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={exportL4vToPDF} aria-label="export to PDF" endIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"></path><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"></path><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"></path><path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"></path></svg>
                } className='exportL4vButton'>
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
                <div style={{ zIndex: 1, position: "absolute", left: "calc(61%)", marginBottom: "calc(7% - 160px)", marginTop: "calc(1.5%)" }}>
                  <Button sx={{ ml: 16, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={exportconvToPDF} aria-label="export to PDF" endIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"></path><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"></path><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"></path><path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"></path></svg>
                  } className='exportconvButton'>
                    <Typography variant="div">Export Conversation Visual's to PDF</Typography>
                  </Button>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={lastPage}
                    aria-label="close"
                    disabled={convIndex <= 0}
                    sx={{ marginRight: "calc(0.1%)", marginBottom: "calc(-1%)" }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  {
                    jsonData?.l4_conversations &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "calc(1%)" }}> Conversation
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
                    disabled={convIndex >= conversationDetails?.length - 1}
                    sx={{ marginLeft: "calc(0.1%)", marginBottom: "calc(-1%)", zIndex: 1000 }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </div>
                {
                  jsonData?.duration &&
                  <div>
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
                }
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
            <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className={AnalyzePanelViewStyle.data_title} >
              <svg style={{ marginTop: "calc(10%)", marginBottom: "calc(2%)" }} xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 14 14"><path fill="#1976d2" fillRule="evenodd" d="M.28 1.962c0-.111.054-.283.294-.507c.24-.224.623-.455 1.147-.662C2.767.381 4.253.112 5.927.112c1.674 0 3.16.269 4.206.681c.525.207.907.438 1.147.662c.24.224.295.396.295.507c0 .111-.055.283-.295.506c-.24.225-.622.455-1.147.662c-1.045.413-2.532.682-4.206.682c-1.674 0-3.16-.27-4.206-.682c-.524-.207-.906-.437-1.147-.662c-.24-.223-.294-.395-.294-.506m11.422 1.76c-.323.22-.7.41-1.11.571c-1.225.483-2.874.769-4.665.769c-1.79 0-3.44-.286-4.664-.769a5.746 5.746 0 0 1-1.11-.57v2.584c.039.093.118.208.266.343c.248.226.642.458 1.183.666c1.076.414 2.605.683 4.325.683c.271 0 .537-.007.797-.02a4.657 4.657 0 0 1 4.978-1.919zM5.927 9.25l.195-.001a4.662 4.662 0 0 0-.196 1.34c0 .625.123 1.22.346 1.764c-.114.003-.23.005-.345.005c-3.19 0-5.774-1.11-5.774-2.475V7.999c.298.183.636.343 1 .483c1.252.482 2.94.767 4.774.767ZM10.588 14a3.412 3.412 0 1 0 0-6.824a3.412 3.412 0 0 0 0 6.824m-2.116-3.412c0-.345.28-.625.625-.625h2.982a.625.625 0 1 1 0 1.25H9.097a.625.625 0 0 1-.625-.625" clipRule="evenodd"></path></svg>
              No valid Layer 4 data provided in your file...
            </h1>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default GraphL4Comp