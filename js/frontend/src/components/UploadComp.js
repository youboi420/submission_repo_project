import React from 'react';
import { Box, Button, CircularProgress, Input, Stack, Tooltip, Typography } from '@mui/material';
import PicktFileIcon from '@mui/icons-material/AttachFile';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NoFileIcon from '@mui/icons-material/DoNotTouch';
import InfoIcon from '@mui/icons-material/Info';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { useDropzone } from 'react-dropzone';

import { NOTIFY_TYPES, notify } from '../services/notify_service';
import FilesPageStyle from '../Style/FilesPage.module.css'
import BinaryLoader from '../components/Loaders/BinaryLoader'
import * as websocket_service from '../services/websocket_service';
import * as files_service from '../services/files_service'
import * as analyze_service from '../services/analyze_service'

const MAX_FILE_SIZE_MB = 16
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const demo_folder = "demo_files/"
const demo_files = [`${demo_folder}demo_attacks.pcap`, `${demo_folder}demo_onlytcp.pcap`, `${demo_folder}demo_zero.pcap`]

const UploadComp = ({ userAnalyzeDataCallback: userDataCallback, fallBack, Files }) => {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const PADDING_C = 25;

  const fileNotSelected = (
    <div style={{ display: 'flex', alignItems: 'center', color: 'white', justifyContent: 'center', textAlign: 'center', fontSize: "28px" }}>
      <span>Drag & Drop or Click to Select File!</span>
      <PicktFileIcon style={{ marginLeft: '5px', color: 'lightgrey' }} />
    </div>
  );

  const fileSelected = (
    <div style={{ display: 'flex', alignItems: 'center', color: 'white', justifyContent: 'center', textAlign: 'center', fontSize: "28px" }}>
      <span>Picked: {file?.name}</span>
      <CheckIcon style={{ marginLeft: '5px', color: '#77DD76' }} />
    </div>
  );

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        notify(`File size exceeds size limit`, NOTIFY_TYPES.error);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      const fileExtension = selectedFile.name.split('.').pop();
      if (fileExtension.toLowerCase() !== 'pcap') {
        notify('Please select a .pcap file', NOTIFY_TYPES.error);
        setFile(null);
        document.getElementById('fileInput').value = null;
      } else {
        if ((selectedFile.name.includes("(") || selectedFile.name.includes(")")) || (selectedFile.name.includes("[") || selectedFile.name.includes("]")) || (selectedFile.name.includes("{") || selectedFile.name.includes("}"))) {
          notify("Picked files name is invalid please rename it or choose another file.", NOTIFY_TYPES.error)
          setFile(null);
        }
      }
    }
  };

  const addDemo = async (id) => {
    setLoading(true);
    try {
      const response = await analyze_service.demoFile(id)
      if (response) {
        websocket_service.update(websocket_service.signal_codes.FILEUP, "demo file added " + id)
        websocket_service.update(websocket_service.signal_codes.FILEANZ, "demo file analyzed " + id)
        notify("Demo file added successfully, go ahead and check the report", NOTIFY_TYPES.success);
        userDataCallback()
      }
    } catch (error) {
      notify("Failed to add demo file", NOTIFY_TYPES.error);
    }
    finally {
      setLoading(false)
    }
  }

  const checkDemoDisabledButton = (file_id) => {
    for (let index = 0; index < Files.length; index++) {
      const element = Files[index];
      if (element.path === demo_files[file_id]) {
        return true
      }
    }
    return false
  }

  const handleUpload = async (event) => {
    // if (!file) {
    //   notify("No file selected", NOTIFY_TYPES.short_error);
    //   return;
    // }
    event.preventDefault()

    try {
      setLoading(true);
      const formData = new FormData()
      formData.append('file', file);
      const response = await files_service.upload(formData)
      if (response?.status === 200) {
        websocket_service.update(websocket_service.signal_codes.FILEUP, file)
        notify("File uploaded successfully", NOTIFY_TYPES.success);
      } else if (response?.status === 409) {
        notify("File already uploaded", NOTIFY_TYPES.warn);
        setFile(null)
      } else {
        notify("Failed to upload file", NOTIFY_TYPES.error);
      }
      setFile(null);
      userDataCallback()
    } catch (error) {
      if (String(error?.response?.data).indexOf("-duplicate") !== -1) {
        notify("File already uploaded", NOTIFY_TYPES.warn);
        setFile(null)
      } else {
        if (error?.response?.status === 400) {
          notify("bad file format/name uploaded. please upload a valid file.", NOTIFY_TYPES.error);
          setFile(null)
        } else {
          notify("Error uploading file", NOTIFY_TYPES.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile.size > MAX_FILE_SIZE) {
      notify(`File size exceeds size limit`, NOTIFY_TYPES.error);
      return;
    }
    setFile(droppedFile);
    const fileExtension = droppedFile.name.split('.').pop();
    if (fileExtension.toLowerCase() !== 'pcap') {
      notify('Please select a .pcap file', NOTIFY_TYPES.error);
      setFile(null);
    } else {
      if ((droppedFile.name.includes("(") || droppedFile.name.includes(")")) || (droppedFile.name.includes("[") || droppedFile.name.includes("]")) || (droppedFile.name.includes("{") || droppedFile.name.includes("}"))) {
        notify("Picked files name is invalid please rename it or choose another file.", NOTIFY_TYPES.error)
        setFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop }); // Use useDropzone hook
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', borderRadius: "7px" }}>
        <div {...getRootProps()}>
          {
            !(checkDemoDisabledButton(0) && checkDemoDisabledButton(1) && checkDemoDisabledButton(2)) && 
            !loading &&
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: "absolute", marginTop: "calc(0.7%)", marginLeft: "calc(-23%)" }}>
              <div className={FilesPageStyle.file_info}  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: "absolute", marginTop: "calc(25%)", marginLeft: "calc(-170%)" }}>
                <Tooltip style={{cursor: "help"}} title={<Typography fontSize={16}>Demo files - Here you can pick a few demo files that will be automatically analyzed and ready for you to check what a real report look's like if you don't have a prepared pcap file </Typography>}>
                  <InfoIcon sx={{ fontSize: "32px", marginLeft: "calc(-10%)", marginBottom: "calc(-8%)", marginRight: "calc(4%)" }} />
                  Demo files
                </Tooltip>
              </div>
              <Stack spacing={2}>
                <Button sx={{ textTransform: "none" }} color='primary' variant='contained' disabled={checkDemoDisabledButton(0)} onClick={() => addDemo(0)}>
                  Add demo Attacks file
                </Button>

                <Button sx={{ textTransform: "none" }} color='primary' variant='contained' disabled={checkDemoDisabledButton(1)} onClick={() => addDemo(1)}>
                  Add demo Only TCP file
                </Button>

                <Button sx={{ textTransform: "none" }} color='primary' variant='contained' disabled={checkDemoDisabledButton(2)} onClick={() => addDemo(2)}>
                  Add demo Zero Window file
                </Button>
              </Stack>
            </div>
          }
          {isDragActive ? (
            <div className={FilesPageStyle.dragActiveOverlay}>
              <h1>Drop your pcap file here <OpenInBrowserIcon sx={{ mb: "-18px", fontSize: "64px" }} /> </h1>
            </div>
          ) : null}
          {/* {loading && <CircularProgress style={{ marginTop: '30px' }} />} */}
          {loading && <BinaryLoader />}
          {
            !loading && 
            <label htmlFor="fileInput">
              <Input type='file' name='file' color='primary' inputProps={{ accept: '.pcap' }} onChange={handleFileChange} id="fileInput" style={{ position: 'absolute', top: 0, left: 0, opacity: 0, zIndex: -1 }} />
              <div style={{ color: 'white', backgroundColor: '#1976d2', borderColor: 'transparent', borderRadius: '8px', borderStyle: 'solid', paddingTop: PADDING_C, paddingBottom: PADDING_C, paddingRight: PADDING_C, paddingLeft: PADDING_C, cursor: 'pointer', fontFamily: 'inherit', fontSize: '1px', boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.25)', width: "600px" }}>
                {file?.name === undefined ? fileNotSelected : fileSelected}
              </div>
            </label>
          
          }
          {!loading && (
            <Button size='large' disabled={!file} sx={{ width: "100%", mt: "calc(3%)", textTransform: 'none' }} style={{ textDecoration: 'none', color: 'white' }} onClick={handleUpload} color='primary' variant='contained' endIcon={file ? 
              <div style={{ marginBottom: "-10px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="none" stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="14;0"></animate></path><path fill="currentColor" d="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"><animate attributeName="d" calcMode="linear" dur="1.5s" keyTimes="0;0.7;1" repeatCount="indefinite" values="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5;M12 15 h2 v-3 h2.5 L12 7.5M12 15 h-2 v-3 h-2.5 L12 7.5;M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"></animate></path></g></svg>
              </div>
                :
              <div style={{ marginBottom: "-10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><mask id="lineMdUploadOffLoop0"><g fill="none" stroke="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="14;0"></animate></path><path fill="grey" d="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"><animate attributeName="d" calcMode="linear" dur="1.5s" keyTimes="0;0.7;1" repeatCount="indefinite" values="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5;M12 15 h2 v-3 h2.5 L12 7.5M12 15 h-2 v-3 h-2.5 L12 7.5;M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"></animate></path><g stroke-dasharray="26" stroke-dashoffset="26" transform="rotate(45 13 12)"><path stroke="#000" d="M0 11h24"></path><path d="M0 13h22"><animate attributeName="d" dur="6s" repeatCount="indefinite" values="M0 13h22;M2 13h22;M0 13h22"></animate></path><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="26;0"></animate></g></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#lineMdUploadOffLoop0)"></rect></svg>
              </div>
              }>
              <Typography className={FilesPageStyle.info_panel} style={{ fontSize: "24px", marginTop: 8, color: !file ? 'black' : 'white' }} >Upload</Typography>
            </Button>
          )}
        </div>
      </Box>
    </div>
  );
};

export default UploadComp;