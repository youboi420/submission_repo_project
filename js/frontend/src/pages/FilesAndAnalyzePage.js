import * as React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Backdrop, Box, Button, CircularProgress, Divider, LinearProgress, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import AdminIcon from '@mui/icons-material/SupervisedUserCircle';
import UserIcon from '@mui/icons-material/AccountCircle';
import DownArrowIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close'
import UpArrowIcon from '@mui/icons-material/ArrowUpward';

import { NOTIFY_TYPES, notify } from '../services/notify_service';
import UploadComp from '../components/UploadComp';
import AnalyzePanelComp from '../components/Panels/AnalyzePanelComp';
import FilesPageStyle from '../Style/FilesPage.module.css'
import * as files_service from '../services/files_service'
import * as websocket_service from '../services/websocket_service';
import FilesLoader from '../components/Loaders/FilesLoaderComp';

const sleep = (milliseconds) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}
const SLEEP_CONST = 600



const FilesAndAnalyzePage = ({ isValidUser, userData }) => {
  const [userAnalyzeData, setUserAnalyzeData] = React.useState({
    username: 'none',
    permission: 'none',
    id: 'none',
    numOfFiles: 'none'
  })
  const [rows, setRows] = React.useState([])
  const [selectedRow, setSelectedRow] = React.useState({})
  const [gridLoading, setGridLoading] = React.useState(false);  
  const [isAnalyzeLoading, setIsAnalyzeLoading] = React.useState(false)
  const [isAnalyzeViewOpen, setIsAnalyzeViewOpen] = React.useState(false)
  const [timeText, setTimeText] = React.useState(new Date().getTime())

  const const_width = 300 * 2
  const const_end_str = 72
  const BORDER_COLOR = "#1976d2"

  // React.useEffect(() => {
  //   setTimeText(new Date().getTime())
  // }, [new Date().getTime()])
  

  const handleFileIdClick = async (file_id, filename) => {
    try {
      await files_service.download(file_id, filename)
      notify(`Downloaded succesfully`, NOTIFY_TYPES.info)
    } catch (error) {
      notify("error while downloading the file.", NOTIFY_TYPES.error)
    }
  }
  const columns = [
    {
      field: 'filename', headerName: 'filename', width: const_width, headerAlign: 'center', align: 'center', renderCell: (params) => {
        let btnText = String(params.row.filename)
        btnText = btnText.replace(".pcap", "")
        if (btnText.slice(0, const_end_str) !== btnText) {
          btnText = btnText.slice(0, const_end_str - 3) + "..."
        }
        return (
          // <button className={FilesPageStyle.files_grid}  onClick={() => { handleFileIdClick(params.row.file_id, params.row.filename); }} style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'transparent', boxShadow: '0px 0px 0px transparent', border: '0px solid transparent', textShadow: '0px 0px 0px transparent', cursor: 'pointer', borderRadius: "12px", borderStyle: 'solid', borderWidth: '5px', borderColor: 'transparent', backgroundColor: '#1976d2', width: "100%", fontSize: "18px" }} > <DownloadIcon style={{ marginRight: '5px' }} /> {btnText} </button>
          <Button
            color='primary'
            variant='contained'
            sx={{textTransform: "none", fontSize: "18px", width: "50%", height: "65%"}}
            className={`${FilesPageStyle.files_grid_button} ${FilesPageStyle.files_grid}`}
            onClick={() => {
              handleFileIdClick(params.row.file_id, params.row.filename);
            }}
          >
            <DownloadIcon style={{ marginRight: '5px' }} /> {btnText}
          </Button>
        )
      }
    },
    {
      field: 'analyzed', headerName: 'analyzed', headerAlign: 'center', align: 'center', flex: 1, renderCell: (params) => {
        return <Box sx={{boxShadow: 3}} className={FilesPageStyle.files_grid} style={{ borderRadius: '4px',width: "20%", fontSize: "20px", color: "White", backgroundColor: params.value === 1 ? "#2e7d32" : "#d32f2f", fontWeight: "lighter"}}> {params.value === 1 ? <div>Yes</div> : <div>No</div>} </Box>
        // for users page! -> return <span className={FilesPageStyle.files_grid} style={{borderRadius: '12px',width: "50%", backgroundColor: params.value === 1 ? "#77DD76" : "#FF6962"}}> {params.value === 1 ? "Yes" : "No"} </span>
      }
    },
    { field: 'path', headerName: 'path', headerAlign: 'center', align: 'center', width: const_width + 35 }
  ]

  const handleSelectionChange = (selectionModel) => {
    if (selectionModel) {
      setSelectedRow(selectionModel[0])
      scrollToStart()
    }
  }

  const PermissionsP = "Your permission's"
  
  const AdminMSG = <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'inherit', justifyContent: "center"}}> {PermissionsP} - Admin <AdminIcon style={{ fontSize: "40px",marginLeft: '5px', marginTop: 8 }} /> </div>
  const UserMSG = <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'inherit' , justifyContent: "center"}}> {PermissionsP} - Regullar User <UserIcon style={{ fontSize: "40px",marginLeft: '5px', marginTop: 8 }} /> </div>

  const userAnalyzeDataCallback = async () => {
    fetchFilesData()
  }

  const fetchFilesData = async () => {
    setGridLoading(true);
    let files = await files_service.get_my_files()
    if (files === undefined) {
      setUserAnalyzeData((oldState) => ({
        ...oldState,
        username: userData.username,
        permission: userData.isadmin ? AdminMSG : UserMSG,
        numOfFiles: 0 /* need to fetch manually from reports db */
      }));
      setRows([])
    } else {
      files = files.map((obj, i) => ({ ...obj, id: i }))
      setUserAnalyzeData((oldState) => ({
        ...oldState,
        username: userData.username,
        permission: userData.isadmin ? AdminMSG : UserMSG,
        numOfFiles: files.length /* need to fetch manually from reports db */
      }));
      setRows(files)
    }
    setGridLoading(false);
  }

  const fallBack = () => {
    setSelectedRow({})
  }
  
  const fetchDataCallBack = async () => {
    setIsAnalyzeLoading(false)
    // make it the same object but analyzed = 1
    setSelectedRow((prevState) => { return { ...prevState, analyzed: 1 } })
    fetchFilesData()
  }

  const analyzeLoading = () => {
    setIsAnalyzeLoading(true)
  }

  const analyzeEndError = () => {
    setIsAnalyzeLoading(false)
  }

  const openViewPanel = () => {
    setIsAnalyzeViewOpen(true)
  }

  const scrollToTop  = () => {
    const container = document.getElementById('files_panel_container');
    if (container) {
      container.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }
  const deselectCallback = async () => {
    scrollToTop()
    await sleep(SLEEP_CONST)
    setSelectedRow({})
  }
  
  React.useEffect(() => {
    if (isValidUser)
      fetchFilesData()
    document.title = "Files and analyze page"
  }, []);

  React.useEffect(() => {
    scrollToStart()
  }, [selectedRow])

  const scrollToStart = () => {
    const container = document.getElementById('analyze_panel_container');
    if (container) {
      container.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }
  
  if (isValidUser) {
    return (
      <div style={{ display: 'flex', marginTop: "calc(-0.05%)" }} className={FilesPageStyle.info_panel}>
        {
          isAnalyzeLoading &&
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isAnalyzeLoading} onClick={() => {setIsAnalyzeLoading(false)}} >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
        <Box style={{ width: '100%' }} sx={{ mr: -1, color: 'black' }}>
          <Stack direction={'column'}>
            <Box sx={{ mt: "10px", mx: "10px", p: 1.5, height: "calc(4%)", background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0))', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', textAlign: "center", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Stack direction={'row'} spacing={4} justifyContent="center" alignItems="center" /* sx={{marginRight: "calc(4%)"}} */>
                <h1 className={FilesPageStyle.info_panel} > Hello again, {userAnalyzeData.username} </h1>
                <Divider orientation='vertical' flexItem sx={{ bgcolor: "black", borderWidth: 1.5 }}/>
                {/* <div className={FilesPageStyle.info_panel} >{userAnalyzeData.permission}</div> */}
                {/* <Divider orientation='vertical' flexItem sx={{ bgcolor: "black", marginRight: "20px", borderWidth: 1 }}/> */}
                <h1 className={FilesPageStyle.info_panel}> Uploaded files: {userAnalyzeData.numOfFiles} </h1>
                {/* <Divider orientation='vertical' flexItem sx={{ bgcolor: "black", marginRight: "20px", borderWidth: 1 }}/>
                <h1 className={FilesPageStyle.info_panel}> {timeText} </h1> */}
              </Stack>
            </Box>
            <Box sx={{ mt: "6px", mx: "10px", p: 2,  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0))', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <UploadComp className={FilesPageStyle.info_panel} userAnalyzeDataCallback={userAnalyzeDataCallback} fallBack={fallBack}/>
            </Box>
            <Box id="files_panel_container" className={FilesPageStyle.files_grid} sx={{ mt: "6px", mx: "10px", height: "60vh", display: 'flex', flexDirection: 'column',  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0))', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(25px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', textAlign: 'center' }}>
            <Box sx={{ fontSize: "20px", justifyContent: 'center', textAlign: 'center', paddingTop: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}> <span>Your uploaded pcap files</span> <CloudUploadIcon style={{ marginLeft: '5px' }} /></Box>
              {
                userAnalyzeData.numOfFiles === 0 &&
                <Box sx={{ fontSize: "40px", marginBottom: '10px', marginTop: "calc(13%)",justifyContent: 'center', textAlign: 'center' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}> <UpArrowIcon style={{ marginRight: '5px', fontSize: "40px" }}/> <span> please upload a file to analyze/view</span> <UpArrowIcon style={{ marginLeft: '5px', fontSize: "40px" }}/> </Box>
              }
              {
                userAnalyzeData.numOfFiles !== 0 &&
                <Box sx={{ fontSize: "20px", marginBottom: '10px', justifyContent: 'center', textAlign: 'center', }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}> <DownArrowIcon style={{ marginRight: '5px' }}/> <span> please select a file to analyze/view</span> <DownArrowIcon style={{ marginLeft: '5px' }}/> </Box>
              }
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                {
                  // gridLoading && <LinearProgress size={75} style={{marginTop: "calc(20%)"}} />
                  gridLoading &&  <div style={{justifyContent: 'center', textAlign: 'center', zIndex: 1000, marginTop: "calc(7%)", marginLeft: "calc(44%)"}}><FilesLoader/></div>
                }
                {
                  !gridLoading &&
                  userAnalyzeData.numOfFiles !== 0 &&
                  <DataGrid
                    sx={{ borderRadius: "10px", fontWeight: 'bold', fontFamily: 'monospace', borderColor: "transparent", fontSize: "16px"}}
                    rows={rows}
                    columns={columns}
                    style={{  fontWeight: "bold" }}
                    // rowSelectionModel={handleSelectionChange}
                    onRowClick={(row) => { 
                      setSelectedRow(row.row); 
                      scrollToStart()
                    }}
                  />
                }
              </Box>
            </Box>
              {
                selectedRow.file_id &&
                <Box id="analyze_panel_container" sx={{ color: 'black', mt: "5px", mx: "10px", mb: "5px",p: 2, background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.16), rgba(255, 255, 255, 0))', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }} style={{ flex: 1 }}>
                  <AnalyzePanelComp fileData={selectedRow} fetchDataCallBack={fetchDataCallBack} resetDataFallBack={fallBack} analyzeLoading={analyzeLoading} analyzeEndError={analyzeEndError} openViewPanel={openViewPanel} deselectCallback={deselectCallback} scrollToTop={scrollToTop}/>
                </Box>
              }
          </Stack>
        </Box>
      </div>
    )
  }

  return (
    <Navigate to={'/login'} />
  )
}

export default FilesAndAnalyzePage