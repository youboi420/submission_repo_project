import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Transion from '@mui/material/Slide'
import { CircularProgress, Stack, Switch } from '@mui/material'

import * as analyze_service from '../services/analyze_service'
import CustomReactJson from './CustomReactJson'
import L2ConvComp from './L2ConvComp'
import { L2_DATA_TYPES } from './L2Common'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})

const AnalyzePanelL2View = ({ isOpen, fileData, jsonData, onCloseCallBack, fetchingStatus }) => {
  const [viewMode, setViewMode] = React.useState(false)
  const FLOATING_LIMITER = 3
  const { L2_conversations } = jsonData

  const conversationDetails = L2_conversations?.map(conversation => ({
    conversationId: conversation.conv_id,
    hostA: conversation.src_mac,
    hostB: conversation.dest_mac,
    numberPacketA: conversation.packets_from_a_to_b,
    numberPacketB: conversation.packets_from_b_to_a,
    numberREQA: conversation.packets_data.reduce((accumulator, packet) => { return (packet.from_mac === conversation.src_mac  && packet.type === L2_DATA_TYPES.REQ) ? accumulator + 1 : accumulator + 0 }, 0),
    numberREQB: conversation.packets_data.reduce((accumulator, packet) => { return (packet.from_mac === conversation.dest_mac && packet.type === L2_DATA_TYPES.REQ) ? accumulator + 1 : accumulator + 0 }, 0),
    numberRESA: conversation.packets_data.reduce((accumulator, packet) => { return (packet.from_mac === conversation.src_mac  && packet.type === L2_DATA_TYPES.RES) ? accumulator + 1 : accumulator + 0 }, 0),
    numberRESB: conversation.packets_data.reduce((accumulator, packet) => { return (packet.from_mac === conversation.dest_mac && packet.type === L2_DATA_TYPES.RES) ? accumulator + 1 : accumulator + 0 }, 0),
    durationInSeconds: analyze_service.calculateConversationDuration(conversation),
    packetsPerHost: analyze_service.calculatePacketsPerHost(conversation),
    packetList: conversation.packets_data
  }));
  

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
              {fileData?.filename ? "Layer 2 report about file: " + fileData?.filename : "Somehow not selected"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ backgroundColor: "transparent", height: "100vh" }}>
          {/* <div>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: !fetchingStatus ? "grey" : "black" }} sx={{ mt: "20px" }}>
              <Typography>
                תצוגה מילולית
              </Typography>
              <Switch size='large' checked={viewMode} onChange={() => { setViewMode(!viewMode) }} disabled={!fetchingStatus} />
              <Typography>
                JSON
              </Typography>
            </Box>
          </div> */}
          { // loading animation
            !fetchingStatus &&
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '80vh' }}>
              <CircularProgress style={{ marginTop: '10px' }} size={"100px"} />
            </div>
          }
          { // verbal view
            !viewMode && fetchingStatus &&
            <div>
              <L2ConvComp convsDataArray={conversationDetails}  />
            </div>
          }
          { // json view
            viewMode && fetchingStatus && 0 &&
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >JSON - תצוגה לוגית</h1>
              <Stack direction={'column'} spacing={2} sx={{ p: 2 , alignItems: 'center'}}>
                  {/* <IconButton sx={{width: "20%", textTransform: 'none'}} onClick={() => navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2)) } color='primary' >
                    Copy
                    <ContentCopyIcon sx={{ml: "4px", mt: "4px"}}/>
                  </IconButton> */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CustomReactJson src={jsonData} />
                </div>
              </Stack>
            </div>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default AnalyzePanelL2View