import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Transion from '@mui/material/Slide'
import { Button, Slider, Stack, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { L4_DATA_TYPES } from '../Common/L4Common'
import * as analyze_service from '../../services/analyze_service'
import L4ConvPanel from '../L4ConvComp'
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css';
import MemoizedL4ConvPanel from '../MemoL4ConvComp'
import TypeWriterLoader from '../Loaders/TypeWriterLoader'
import { NOTIFY_TYPES, notify } from '../../services/notify_service'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})

const convInRange = (conv, startTime, endTime) => {
  return (
    conv?.packets_data[0]?.time_stamp_rltv >= startTime && conv?.packets_data[0]?.time_stamp_rltv <= endTime
  )
}

const bothPanel = (tcpConversationDetails, udpConversationDetails, filename) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'center' }}>
      <MemoizedL4ConvPanel convsDataArray={tcpConversationDetails} singleMode={false} proType={L4_DATA_TYPES.TCP} filename={filename}/>
      <MemoizedL4ConvPanel convsDataArray={udpConversationDetails} singleMode={false} proType={L4_DATA_TYPES.UDP} filename={filename}/>
    </div>
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

const AnalyzePanelL4View = ({ isOpen, fileData, jsonData, onCloseCallBack, fetchingStatus, l4Mode }) => {
  const [viewMode, setViewMode] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState([0, 1]);
  const [conversationDetails, setConversationDetails] = React.useState([]);
  const [minInputValue, setMinInputValue] = React.useState('0');
  const [maxInputValue, setMaxInputValue] = React.useState('1');
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
  const handleSliderChange = (event, newValue) => {
    const newMinValue = Math.min(newValue[0], sliderValue[1] - minDistance);
    const newMaxValue = Math.max(newValue[1], sliderValue[0] + minDistance);
  
    setSliderValue([newMinValue, newMaxValue]);
    setMinInputValue(newMinValue.toString());
    setMaxInputValue(newMaxValue.toString());
  };
  
  const maxDuration = new Number(jsonData?.duration).toFixed(3) || 0;

  let title = l4Mode === analyze_service.l4MODES.TCP ? `Protocol: ${analyze_service.l4MODES.TCP}` : l4Mode === analyze_service.l4MODES.UDP ? `Protocol: ${analyze_service.l4MODES.UDP}` : `Layer 4 - transport conversation's (by time)`

  React.useEffect(() => {
    setSliderValue([0, maxDuration]);
    setMaxInputValue(maxDuration.toString());
    setMinInputValue(0);
  }, [jsonData]);

  React.useEffect(() => {
    const filteredConversations = jsonData?.l4_conversations?.filter(conv => convInRange(conv, minInputValue, maxInputValue)).map(conversation => ({
      conversationId: conversation.conv_id,
      conversationType: conversation.conv_type,
      hostA: conversation.source_ip,
      hostB: conversation.destination_ip,
      portA: conversation.source_port,
      portB: conversation.destination_port,
      numberPacketA: conversation.packets_from_a_to_b,
      numberPacketB: conversation.packets_from_b_to_a,
      durationInSeconds: analyze_service.calculateConversationDuration(conversation),
      packetsPerHost: analyze_service.calculatePacketsPerHost(conversation),
      exceptionsList: conversation.conv_type === L4_DATA_TYPES.TCP ? conversation.exceptions : [],
      packetList: conversation.packets_data
    }));
    setConversationDetails(filteredConversations || []);
  }, [minInputValue, maxInputValue, sliderValue]);

  const tcpConversationDetails = conversationDetails?.filter(conversation => conversation.conversationType === "TCP");
  const udpConversationDetails = conversationDetails?.filter(conversation => conversation.conversationType === "UDP");

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

  return (
    <div>
      <Dialog fullScreen open={isOpen} onClose={() => { setViewMode(false); onCloseCallBack() }} TransitionComponent={Transition} onAbort={() => { setViewMode(false); onCloseCallBack() }}
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
              onClick={() => { setViewMode(false); onCloseCallBack() }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: '20px' }} variant="h6" component="div">
              {fileData?.filename ? "Layer 4 report about file: " + fileData?.filename : "Somehow not selected"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ height: "100vh" }}>
          { // loading animatio
            !fetchingStatus &&
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '80vh' }} >
              {/* <CircularProgress style={{ marginTop: '40px' }} size={"100px"} /> */}
              <TypeWriterLoader />
            </div>
          }
          { // verbal view
            !viewMode && fetchingStatus &&
            <div >
              <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} className={AnalyzePanelViewStyle.data_title} >{title}</h1>
              {
                (
                  l4Mode === analyze_service.l4MODES.BOTH ? conversationDetails?.length !== 0 :
                    l4Mode === analyze_service.l4MODES.TCP ? tcpConversationDetails?.length !== 0 :
                      udpConversationDetails?.length !== 0
                ) &&
                jsonData?.duration &&
                <div /* style={{ borderStyle: "solid", paddingTop: "10px", paddingLeft: "300px", paddingRight: "300px",  marginLeft: "450px", marginRight: "450px", marginBottom: "20px" }} */>
                <h4 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                  Time Filter
                </h4>
                <Stack style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: "20px" }}>
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
              {
                l4Mode === analyze_service.l4MODES.BOTH
                && bothPanel(tcpConversationDetails, udpConversationDetails, fileData?.filename)
              }
              {
                l4Mode === analyze_service.l4MODES.TCP && (
                  <MemoizedL4ConvPanel
                    convsDataArray={tcpConversationDetails}
                    singleMode={true}
                    proType={L4_DATA_TYPES.TCP}
                    filename={fileData?.filename}
                  />
                )
              }

              {
                l4Mode === analyze_service.l4MODES.UDP && (
                  <MemoizedL4ConvPanel
                    convsDataArray={udpConversationDetails}
                    singleMode={true}
                    proType={L4_DATA_TYPES.UDP}
                  />
                )
              }

              {/* {
                l4Mode === analyze_service.l4MODES.TCP &&
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'center' }}>
                  <L4ConvPanel convsDataArray={tcpConversationDetails} singleMode={true} proType={L4_DATA_TYPES.TCP} />
                </div>
              }
              {
                l4Mode === analyze_service.l4MODES.UDP &&
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'center' }}>
                  <L4ConvPanel convsDataArray={udpConversationDetails} singleMode={true} proType={L4_DATA_TYPES.UDP} />
                </div>
              } */}
            </div>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default AnalyzePanelL4View