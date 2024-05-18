import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Transion from '@mui/material/Slide'
import { Box, Button, CircularProgress, Stack, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import InfoIcon from '@mui/icons-material/Info'
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css'

import SaveAsIcon from '@mui/icons-material/Save'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import TypeWriterLoader from '../Loaders/TypeWriterLoader'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Transion direction="up" ref={ref} {...props} />
})

const AnalyzePanelGISView = ({ isOpen, fileData, jsonData, onCloseCallBack, fetchingStatus }) => {
  const [open, setOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState(false)
  const FLOATING_LIMITER = 3
  const { hosts, ports } = jsonData

  const VERBAL_BOX_HEIGHT = "75vh"
  const hostsWithIds = hosts?.map((host, index) => ({ ...host, id: `host_${index}` }))
  const portsWithIds = ports?.map((port, index) => ({ ...port, id: `port_${index}` }))
  
  const portsGridCols = [
    { field: "count", headerName: 
      (
        <Tooltip title={<Typography fontSize={16}>  Number of occurrences in the file un related to a certian conversation service or protocol. </Typography>} style={{ borderRadius: '12px', backgroundColor: "#1976d2", color: "white", padding: 2, cursor: 'zoom-in' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}> Count <InfoIcon sx={{ml: "5px"}}/> </div>
        </Tooltip>
        // <div title={<Typography fontSize={16}> Number of occurrences in the file un related to a certian conversation service or protocol </Typography>} style={{ borderRadius: '12px', backgroundColor: "#1976d2", color: "white", padding: 2, cursor: 'zoom-in' }}>
        //   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Number of occurrences <InfoIcon sx={{ml: "5px"}}/> </div>
        // </div>
      ), 
      headerAlign: "center", align: "center", flex: 1, },
    { field: "port", headerName:  (
      <Tooltip title={<Typography fontSize={16}> Ports are essential for enabling multiple network services to operate concurrently on a single device. They allow a single device to offer various services to clients over a network, such as web browsing, email, file transfer, and more. </Typography>} style={{ borderRadius: '12px', backgroundColor: "#1976d2", color: "white", padding: 2, cursor: 'zoom-in' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}> Ports<InfoIcon sx={{ml: "5px"}}/> </div>
      </Tooltip>
    ),  headerAlign: "center", align: "center",  flex: 1 },
  ]
  
  const hostsGridCols = [
    { field: "count", headerName: 
    (
      <Tooltip title={<Typography fontSize={16}> Number of occurrences in the file un related to a certian conversation service or protocol </Typography>} style={{ borderRadius: '12px', backgroundColor: "#1976d2", color: "white", padding: 2, cursor: 'zoom-in' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Count <InfoIcon sx={{ml: "5px"}}/> </div>
      </Tooltip>
    ), headerAlign: "center", align: "center" ,  flex: 1 },
    { field: "host_ip", headerName: (
      <Tooltip title={<Typography fontSize={16}> An IP (Internet Protocol) address is a unique numerical logical identifier assigned to each device on a network, allowing them to communicate with each other. It serves as the address system of the internet, enabling data packets to be routed to their intended destinations across the network. </Typography>} style={{ borderRadius: '12px', backgroundColor: "#1976d2", color: "white", padding: 2, cursor: 'zoom-in' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Host IP <InfoIcon sx={{ml: "5px"}}/> </div>
      </Tooltip>
    ), headerAlign: "center", align: "center"       ,  flex: 1 },
  ]

  const exportToPDF = () => {
    const cap = document.querySelector('.gis_report')
    const scaleFactor = 1
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const doc = new jsPDF('l', 'mm', 'a4')
      const compWidth = doc.internal.pageSize.getWidth()
      const compHeight = doc.internal.pageSize.getHeight()
      const marginTop = 20
      doc.addImage(imgData, 'PNG', 0, marginTop, compWidth, compHeight * 0.75)
      doc.save(`gisReport_${String(fileData?.filename).replace(".pcap", '')}.pdf`)
    })
  }
  
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
            marginTop: "100px",

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
            <Typography sx={{ ml: '20px', }} variant="h6" component="div">
              {fileData?.filename ? "General info about file: " + fileData?.filename : "Somehow not selected"}
            </Typography>

          </Toolbar>
        </AppBar>
        {
          !viewMode &&
          fetchingStatus &&
          (hostsWithIds?.length === 0 || hostsWithIds?.length === undefined) &&
          (portsWithIds?.length === 0 || portsWithIds?.length === undefined) &&
          <div>
            <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className={AnalyzePanelViewStyle.data_title} >
              <svg style={{ marginTop: "calc(14%)", marginBottom: "calc(2%)" }} xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 14 14"><path fill="#1976d2" fillRule="evenodd" d="M.28 1.962c0-.111.054-.283.294-.507c.24-.224.623-.455 1.147-.662C2.767.381 4.253.112 5.927.112c1.674 0 3.16.269 4.206.681c.525.207.907.438 1.147.662c.24.224.295.396.295.507c0 .111-.055.283-.295.506c-.24.225-.622.455-1.147.662c-1.045.413-2.532.682-4.206.682c-1.674 0-3.16-.27-4.206-.682c-.524-.207-.906-.437-1.147-.662c-.24-.223-.294-.395-.294-.506m11.422 1.76c-.323.22-.7.41-1.11.571c-1.225.483-2.874.769-4.665.769c-1.79 0-3.44-.286-4.664-.769a5.746 5.746 0 0 1-1.11-.57v2.584c.039.093.118.208.266.343c.248.226.642.458 1.183.666c1.076.414 2.605.683 4.325.683c.271 0 .537-.007.797-.02a4.657 4.657 0 0 1 4.978-1.919zM5.927 9.25l.195-.001a4.662 4.662 0 0 0-.196 1.34c0 .625.123 1.22.346 1.764c-.114.003-.23.005-.345.005c-3.19 0-5.774-1.11-5.774-2.475V7.999c.298.183.636.343 1 .483c1.252.482 2.94.767 4.774.767ZM10.588 14a3.412 3.412 0 1 0 0-6.824a3.412 3.412 0 0 0 0 6.824m-2.116-3.412c0-.345.28-.625.625-.625h2.982a.625.625 0 1 1 0 1.25H9.097a.625.625 0 0 1-.625-.625" clipRule="evenodd"></path></svg>
              No valid data provided in your file...
            </h1>
          </div>
        }
        {
          !viewMode &&
          fetchingStatus &&
          !(hostsWithIds?.length === 0 || hostsWithIds?.length === undefined) &&
          !(portsWithIds?.length === 0 || portsWithIds?.length === undefined) &&
          <div style={{ zIndex: 1000, position: "absolute", right: "calc(25%)", top: "calc(8%)" }}>
            <Button
              sx={{ ml: 1, textTransform: 'none' }}
              edge="end"
              color="primary"
              variant='contained'
              onClick={exportToPDF}
              aria-label="export to PDF"
              endIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"></path><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"></path><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"></path><path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"></path></svg>
              }
              >
              <Typography variant="h6">Export to PDF</Typography>
            </Button>
          </div>
        }
        <div style={{ backgroundColor: "transparent" }} className='gis_report'>
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
          { // loading animatio
            !fetchingStatus &&
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 'calc(22%)' }}>
              {/* <CircularProgress style={{ marginTop: 'calc(22%)' }} size={"100px"} /> */}
              <TypeWriterLoader />
            </div>
          }
          { // verbal view
            !viewMode &&
            fetchingStatus &&
            !(hostsWithIds?.length === 0 || hostsWithIds?.length === undefined) &&
            !(portsWithIds?.length === 0 || portsWithIds?.length === undefined) &&
            <div style={{marginBottom: "calc(3%)"}}>
              <h1 className={AnalyzePanelViewStyle.data_title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: "-200px", paddingBottom: "-200px" }} >General info text based 
              </h1>
                <Stack direction={'row'} spacing={2} style={{ justifyContent: 'center' }} >
                  <Stack direction={'column'} sx={{ borderRadius: "12px", borderStyle: "solid", height: VERBAL_BOX_HEIGHT}} >
                    <div style={{ alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center'}}>
                      <div style={{marginTop: "calc(35%)"}}>
                        <h1 className={AnalyzePanelViewStyle.data_title} >File Size</h1>
                        <h3>
                          {jsonData.file_size_mb ? Number(jsonData.file_size_mb).toFixed(FLOATING_LIMITER) + " MB" : "No valid data in file"}
                        </h3>
                      </div>
                      <Divider orientation='horizontal' sx={{ bgcolor: "black" }} />
                      <div>
                        <h1 className={AnalyzePanelViewStyle.data_title} >Packet's</h1>
                        <h3>
                          {jsonData.num_packets ? jsonData.num_packets : "No valid data in file"}
                        </h3>
                      </div>
                      <Divider orientation='horizontal' sx={{ bgcolor: "black" }}/>
                      <div>
                        <h1 className={AnalyzePanelViewStyle.data_title}  style={{padding: 4}}>Time Duration </h1>
                        <h3>
                          {jsonData?.duration === 0 ? "0 sec - " : ""}
                          {jsonData.duration ? parseFloat(jsonData.duration) < 60.0 ? (parseFloat(jsonData.duration).toFixed(FLOATING_LIMITER) + " ' sec") : `${(parseFloat(jsonData.duration) / 60 * 60).toFixed(FLOATING_LIMITER)} minuets`  : "No valid data in file"}
                        </h3>
                      </div>
                      <Divider orientation='horizontal' sx={{ bgcolor: "black" }} />
                      <div>
                        <h1 className={AnalyzePanelViewStyle.data_title} >Host's Count</h1>
                        <h3>
                          {jsonData.num_hosts ? jsonData.num_hosts : "No valid data in file"}
                        </h3>
                      </div>
                      <Divider orientation='horizontal' sx={{ bgcolor: "black" }} />
                      <div>
                        <h1 className={AnalyzePanelViewStyle.data_title} > Port's Count </h1>
                        <h3>
                          {jsonData.num_ports ? jsonData.num_ports : "No valid data in file"}
                        </h3>
                      </div>
                    </div>
                  </Stack>
                  <Box sx={{ height: VERBAL_BOX_HEIGHT, width: "39%", borderRadius: "12px", borderStyle: "solid", overflow: "hidden" }}>
                    <h1 className={AnalyzePanelViewStyle.data_title} style={{textAlign: 'center'}} > Port's Table</h1>
                    <div style={{ width: "100%", height: "calc(100% - 75px)", overflow: "auto" }}>
                      <DataGrid rows={portsWithIds} columns={portsGridCols} style={{fontFamily: "monospace", fontSize: "16px"}}/>
                    </div>
                  </Box>
                  <Box sx={{ height: VERBAL_BOX_HEIGHT, width: "39%", borderRadius: "12px", borderStyle: "solid", overflow: "hidden" }}>
                    <h1 className={AnalyzePanelViewStyle.data_title} style={{ textAlign: 'center' }}> Host's Table </h1>
                    <div style={{ width: "100%", height: "calc(100% - 75px)", overflow: "auto" }}>
                      <DataGrid rows={hostsWithIds} columns={hostsGridCols}  style={{fontFamily: "monospace", fontSize: "16px"}} />
                    </div>
                  </Box>
                </Stack>
            </div>
          }
        </div>
      </Dialog>
    </div>
  )
}

export default AnalyzePanelGISView