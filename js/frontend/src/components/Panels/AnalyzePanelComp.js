import { Button, ButtonGroup, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import React from 'react';

import AnalyzeIcon from '@mui/icons-material/TravelExplore';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import GenereicDeleteDialog from '../Dialogs/GenereicDeleteDialog';
import GraphIcon from '@mui/icons-material/InsertChartOutlined';
import SearchIcon from '@mui/icons-material/ManageSearch';
import SwitchIcon from '@mui/icons-material/DnsOutlined';
import TerminalIcon from '@mui/icons-material/Terminal';
import DDOSIcon from '@mui/icons-material/Groups';
import MITMIcon from '@mui/icons-material/RemoveModerator';
import LeftIcon from '@mui/icons-material/West';
import AnalyzePageStyle from '../../Style/AnalyzePage.module.css';

import { NOTIFY_TYPES, notify } from '../../services/notify_service';
import * as analyze_service from '../../services/analyze_service'
import * as file_service from '../../services/files_service'
import * as websocket_service from '../../services/websocket_service'
import AnalyzePanelGISView from '../Views/AnalyzePanelGISView';
import AnalyzePanelL4View from '../Views/AnalyzePanelL4View';
import AnalyzePanelL2View from '../Views/AnalyzePanelL2View';
import GraphL4Comp from '../Charts/GraphL4Comp';
import GraphL2Comp from '../Charts/GraphL2Comp';
import GraphAttacks from '../Charts/GraphAttacks';

import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import TrashIcon from '@mui/icons-material/DeleteForever';
import RadarLoader from '../Loaders/RadarLoaderComp';
import SwitchControl from '../Common/SwitchControl';

const sleep = (milliseconds) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

export const attack_modes_dict = {
  BOTH: "both",
  DDOS: "DDOS",
  MITM: "MITM"
}

const SLEEP_CONST = 350
const AnalyzePanelComp = ({ fileData, fetchDataCallBack, resetDataFallBack, deselectCallback ,analyzeLoading, analyzeEndError, openViewPanel, scrollToTop }) => {
  const [analyzeL4Mode, setAnalyzeL4Mode] = React.useState("both");
  const [analyzeAttacksMode, setAnalyzeAttacksMode] = React.useState(attack_modes_dict.BOTH);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [DDOSJsonData, setDDOSJsonData] = React.useState({})
  const [MITMJsonData, setMITMJsonData] = React.useState({})
  
  const [isAnalyzeGISViewOpen, setIsAnalyzeGISViewOpen] = React.useState(false)
  const [isAnalyzeL4ViewOpen, setIsAnalyzeL4ViewOpen] = React.useState(false)
  const [isAnalyzeL2ViewOpen, setIsAnalyzeL2ViewOpen] = React.useState(false)
  const [isGraphL4ViewOpen, setIsGraphL4ViewOpen] = React.useState(false)
  const [isGraphL2ViewOpen, setIsGraphL2ViewOpen] = React.useState(false)
  const [isGraphAttacksViewOpen, setIsGraphAttacksViewOpen] = React.useState(false)

  const [jsonData, setJsonData] = React.useState({})
  
  const [gisFetchingStatus, setGISFetchingStatus] = React.useState(false)
  const [l4FetchingStatus, setL4FetchingStatus] = React.useState(false)
  const [l2FetchingStatus, setL2FetchingStatus] = React.useState(false)
  const [attacksFetchingStatus, setAttacksFetchingStatus] = React.useState(false)
  const [showHelpers, setShowHelpers] = React.useState(true)

  const [mainAnalyze, setMainAnalyze] = React.useState(true)
  
  const REPORT_L4 = "L4 Report"
  const REPORT_L2 = "L2 Report"
  const GRAPH_L4 = "Visual L4"
  const GRAPH_L2 = "Visual L2"
  const ATTACKS = "Attacks Report"
  const button_spacing = 3

  const handleL4ModeSelectClicked = (event) => {
    setAnalyzeL4Mode(event.target.value);
  };

  const handleAttacksSelectClicked = (event) => {
    setAnalyzeAttacksMode(event.target.value)
  }

  const handleL4AnalyzeClicked = async () => {
    if (fileData.file_id !== undefined) {
      if (fileData.analyzed !== 1) {
        notify(`FILE: ${fileData.filename} is not analyzed`, NOTIFY_TYPES.warn)
      } else {
        /* fetch data */
        setIsAnalyzeL4ViewOpen(true)
        setL4FetchingStatus(false)
        try {
          const serverJsonData = await analyze_service.getL4JsonData(fileData.file_id)
          if (serverJsonData === undefined ) {
            setIsAnalyzeL4ViewOpen(false)
            notify("Server failed.", NOTIFY_TYPES.error)
            return
          }
          setJsonData(serverJsonData)
          await sleep(SLEEP_CONST)
          setL4FetchingStatus(true)
        } catch (error) {
          if (error?.response?.status === 404) {
            notify("Layer 4 file doesn't exist", NOTIFY_TYPES.error)
            setIsAnalyzeL4ViewOpen(false)
            setL4FetchingStatus(false)
          } else {
            console.error(error);
            notify("Server failed", NOTIFY_TYPES.error)
            setL4FetchingStatus(false)
            setIsAnalyzeL4ViewOpen(false)
          }
        }

      }
    } else {
      notify("no file is selected...", NOTIFY_TYPES.short_error);
    }
  };

  const handleL2AnalyzeClicked = async () => {
    if (fileData.file_id !== undefined) {
      if (fileData.analyzed !== 1) {
        notify(`FILE: ${fileData.filename} is not analyzed`, NOTIFY_TYPES.warn)
      } else {
        try {
          const serverJsonData = await analyze_service.getL2JsonData(fileData.file_id)
          if (serverJsonData === undefined) {
            setIsAnalyzeL2ViewOpen(false)
            notify("Server failed.", NOTIFY_TYPES.error)
            return
          }
          setL2FetchingStatus(false)
          setIsAnalyzeL2ViewOpen(true)
          await sleep(SLEEP_CONST)
          setJsonData(serverJsonData)
          setL2FetchingStatus(true)
        } catch (error) {
          if (error?.response?.status === 404) {
            notify("Layer 2 file doesn't exist", NOTIFY_TYPES.error)
            setIsAnalyzeL2ViewOpen(false)
            setL2FetchingStatus(false)
          } else {
            console.error(error);
            notify("Server failed", NOTIFY_TYPES.error)
            setL2FetchingStatus(false)
            setIsAnalyzeL2ViewOpen(false)
          }
        }
        
      }
    } else {
      notify("no file is selected...", NOTIFY_TYPES.short_error);
    }
  }

  const handleGraph1Clicked = async () => {
    if (fileData.file_id !== undefined) {
      if (fileData.analyzed !== 1) {
        notify(`FILE: ${fileData.filename} is not analyzed`, NOTIFY_TYPES.warn)
      } else {
        setL4FetchingStatus(false)
        setIsGraphL4ViewOpen(true)
        try {
          const serverJsonData = await analyze_service.getL4JsonData(fileData.file_id)
          await sleep(SLEEP_CONST)
          setJsonData(serverJsonData)
          setL4FetchingStatus(true)
        } catch (error) {
          if (error?.response?.status === 404) {
            notify("Layer 4 file doesn't exist", NOTIFY_TYPES.error)
            setIsGraphL4ViewOpen(false)
            setL4FetchingStatus(false)
          } else {
            console.error(error);
            notify("Server failed", NOTIFY_TYPES.error)
            setL4FetchingStatus(false)
            setIsGraphL4ViewOpen(false)
          }
        }

      }
    } else {
      notify("no file is selected...", NOTIFY_TYPES.short_error);
    }
  }

  const handleGraph2Clicked = async () => {
    if (fileData.file_id !== undefined) {
      if (fileData.analyzed !== 1) {
        notify(`FILE: ${fileData.filename} is not analyzed`, NOTIFY_TYPES.warn)
      } else {
        setIsGraphL2ViewOpen(true)
        setL2FetchingStatus(false)
        await sleep(SLEEP_CONST)
        try {
          const serverJsonData = await analyze_service.getL2JsonData(fileData.file_id)
          if (serverJsonData === undefined ) {
            setIsGraphL2ViewOpen(false)
            notify("Server failed.", NOTIFY_TYPES.error)
            return
          }
          setJsonData(serverJsonData)
          setL2FetchingStatus(true)
        } catch (error) {
          if (error?.response?.status === 404) {
            notify("Layer 2 file doesn't exist", NOTIFY_TYPES.error)
            setL2FetchingStatus(true)
            setIsGraphL2ViewOpen(false)
          } else {
            console.error(error);
            notify("Server failed", NOTIFY_TYPES.error)
            setL2FetchingStatus(false)
            setIsGraphL2ViewOpen(false)
          }
        }
      }
    } else {
      notify("no file is selected...", NOTIFY_TYPES.short_error);
    }
  }

  const handleAttackClicked = async () => {
    setAttacksFetchingStatus(false)
    if (fileData.file_id !== undefined) {
      if (fileData.analyzed !== 1) {
        notify(`FILE: ${fileData.filename} is not analyzed`, NOTIFY_TYPES.warn)
      } else {
        setIsGraphAttacksViewOpen(true)
        if (analyzeAttacksMode === attack_modes_dict.BOTH || analyzeAttacksMode === attack_modes_dict.DDOS) {
          try {
            const responseDDOSJsonData = await analyze_service.getDDOSJsonData(fileData.file_id)
            if (responseDDOSJsonData) {
              setDDOSJsonData(responseDDOSJsonData)
            } else {
            }
          } catch (error) {
            if (error?.response?.status !== 404) {
              notify("DDOS Fetch failed.", NOTIFY_TYPES.short_error)
            } else {
              // notify("Got nothing in " + attack_modes_dict.DDOS, NOTIFY_TYPES.info)
            }
          }
        }
        if (analyzeAttacksMode === attack_modes_dict.BOTH || analyzeAttacksMode === attack_modes_dict.MITM) {
          try {
            const responseMITMJsonData = await analyze_service.getMITMJsonData(fileData.file_id)
            if (responseMITMJsonData) {
              setMITMJsonData(responseMITMJsonData)
            } else {
            }
          } catch (error) {
            if (error?.response?.status !== 404) {
              notify("MITM Fetch failed.", NOTIFY_TYPES.short_error)
            } else {
              // notify("Got nothing in " + attack_modes_dict.MITM, NOTIFY_TYPES.info)
            }
          }
        }
        await sleep(SLEEP_CONST * 3)
        setAttacksFetchingStatus(true)
      }
    } else {
      notify("no file is selected...", NOTIFY_TYPES.short_error);
    }
  }
  const handleDeletePressed = async () => {
    const file_id = fileData.file_id
    if (file_id !== undefined) {
      try {
        await file_service.delete_file(file_id)
        notify("File deleted", NOTIFY_TYPES.success)
        fetchDataCallBack()
        websocket_service.update(websocket_service.signal_codes.FILEDEL, "deleted_file" + file_id)
      } catch (error) {
        notify("couldn't delete the file this time", NOTIFY_TYPES.error)
      }
    } else {
      notify("undefined", NOTIFY_TYPES.error)
    }
    resetDataFallBack()
  }

  const handleMainAnalyzeClicked = async () => {
    setMainAnalyze(false)
    const file_id = fileData.file_id
    try {
      if (file_id !== undefined) {
        if (fileData.analyzed !== 1) {
          await analyze_service.analyze(file_id)
          notify(`FILE: ${fileData.filename} is now analyzed!`, NOTIFY_TYPES.success);
          websocket_service.update(websocket_service.signal_codes.FILEANZ, "file_analyzed" + file_id)
          fetchDataCallBack()
        } else {
          notify(`FILE: ${fileData.filename} ALREADY ANALYZED!`, NOTIFY_TYPES.info);
          return
        }
      } else {
        notify("no file is selected...", NOTIFY_TYPES.short_error);
      }
    } catch (error) {
      notify("server error...", NOTIFY_TYPES.error)
      analyzeEndError()
    }
    await sleep(3000)
    setMainAnalyze(true)
  }

  const handleGeneralInfo = async () => {
    // fetch the json data of file data.file_id and open the analyze panel view.
    setGISFetchingStatus(false)
    setIsAnalyzeGISViewOpen(true)

    const serverJsonData = await analyze_service.getGISJsonData(fileData.file_id)
  
    if (serverJsonData === undefined ) {
      setIsAnalyzeGISViewOpen(false)
      notify("Server failed.", NOTIFY_TYPES.error)
      return
    }
    await sleep(SLEEP_CONST)
    setJsonData(serverJsonData)
    setGISFetchingStatus(true)
  }

  React.useEffect(() => {
    setDDOSJsonData({})
    setMITMJsonData({})
  }, [fileData])

  const onHelperToggle = ( flag ) => {
    setShowHelpers(flag)
  }

  return (
    <div className={AnalyzePageStyle.file_info} style={{height: "85vh"}}>
      <div style={{ position: 'relative', textAlign: 'center', marginTop: 'calc(1%)' }}>
        <div style={{ fontSize: '34px', color: fileData.filename === undefined ? 'transparent' : 'black', marginBottom: '1.8%' }}>{fileData.filename === undefined ? 'Pick a file from your uploaded files' : 'File name: ' + fileData.filename}</div>
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-35%)', marginLeft: "calc(8%)" }}>
          <div style={{ display: 'inline-block', textAlign: 'center', fontSize: '34px' }}>Show helper's</div>
          <div style={{ display: 'inline-block', marginRight: '1.5%' }}>
            <SwitchControl id="helperCheckbox" onToggle={onHelperToggle} />
          </div>
        </div>
      </div>
      {
        showHelpers &&
        <div style={{position: "absolute", top: "16%", left: "5.5%",  }}>
          <div className={AnalyzePageStyle.cards}>
            <div className={`${AnalyzePageStyle.card} ${AnalyzePageStyle.first}`}>
              <p className={AnalyzePageStyle.second_text}>L - a short for Layer meaning that L2 is OSI Layer 2, L4 is OSI Layer 4.</p>
            </div>
            <div className={`${AnalyzePageStyle.card} ${AnalyzePageStyle.second}`}>
              <p className={AnalyzePageStyle.second_text}>
                Visual - a graphical / visual report on selected OSI layer. will show you size of packet's to time graphs. distribution of protocol types and request's and much more.
              </p>
            </div>
            <div className={`${AnalyzePageStyle.card} ${AnalyzePageStyle.third}`}>
              <p className={AnalyzePageStyle.second_text}>
                Type - in L4 / Layer is to chose your protocol analysis on report.
                <br/>Choose either TCP / UDP or Both (default).
                <br/>In attacks report it's either DDOS attack / MITM attack, or Both.
              </p>
            </div>
            <div className={`${AnalyzePageStyle.card} ${AnalyzePageStyle.forth}`}>
              <p className={AnalyzePageStyle.second_text}>
                * Note that in every part of the report you can click export to pdf and download a corresponding pdf selected part, to work offline.
              </p>
            </div>
            <div className={`${AnalyzePageStyle.card} ${AnalyzePageStyle.fifth}`}>
              <p className={AnalyzePageStyle.second_text}>
              * Note, your'e still in the same page. you can either scroll up to select another file. or click the back to top button at the bottom right of the page.
              </p>
            </div>
          </div>
        </div>
      }
      {
        jsonData &&
        <AnalyzePanelGISView isOpen={isAnalyzeGISViewOpen} onCloseCallBack={() => {setIsAnalyzeGISViewOpen(false)}} fileData={fileData} jsonData={jsonData} fetchingStatus={gisFetchingStatus} />
      }
      {
        jsonData &&
        <AnalyzePanelL4View  isOpen={isAnalyzeL4ViewOpen}  onCloseCallBack={() => {setIsAnalyzeL4ViewOpen(false)}}  fileData={fileData} jsonData={jsonData} fetchingStatus={l4FetchingStatus} l4Mode={analyzeL4Mode} />
      }
      {
        jsonData &&
        <AnalyzePanelL2View  isOpen={isAnalyzeL2ViewOpen}  onCloseCallBack={() => {setIsAnalyzeL2ViewOpen(false)}}  fileData={fileData} jsonData={jsonData} fetchingStatus={l2FetchingStatus}/>
      }
      {
        jsonData &&
        <GraphL4Comp isOpen={isGraphL4ViewOpen} onCloseCallBack={() => {setIsGraphL4ViewOpen(false)}} fileData={fileData} l4Mode={analyzeL4Mode} jsonData={jsonData} conv_count={jsonData?.conv_count} fetchingStatus={l4FetchingStatus}/>
      }
      {
        jsonData &&
        <GraphL2Comp isOpen={isGraphL2ViewOpen} onCloseCallBack={() => {setIsGraphL2ViewOpen(false)}} fileData={fileData} jsonData={jsonData} conv_count={jsonData?.L2_coversations?.length} fetchingStatus={l2FetchingStatus}/>
      }
      {
        jsonData &&
        <GraphAttacks isOpen={isGraphAttacksViewOpen} onCloseCallBack={() => {setIsGraphAttacksViewOpen(false)}} fileData={fileData} DDOSJsonData={DDOSJsonData} MITMJsonData={MITMJsonData} fetchingStatus={attacksFetchingStatus} attackMode={analyzeAttacksMode} />
      }
      {/* <div>
        <div style={{textAlign: 'center', fontSize: "34px", color: fileData.filename === undefined ? "transparent" : "black", marginTop: "calc(-1%)"}} ></div>
        <div style={{textAlign: 'center', fontSize: "34px", color: fileData.filename === undefined ? "transparent" : "black", marginTop: "calc(1.8%)", marginBottom: "calc(3.4%)"}} >{(fileData.filename === undefined ? "pick a file from your uploaded files" : "File name: " + fileData.filename)}</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, margin: "calc(-1.5%)", marginTop: "calc(-3%)", marginRight: "calc(0.6%)"}}>
        <div style={{textAlign: 'center', fontSize: "34px"}}>
          Show helper's
        </div>
        <div style={{marginLeft: "calc(1.5%)", marginBottom: "calc(-0.5%"}}>
          <SwitchControl id="helperCheckbox" onToggle={onHelperToggle} />
        </div>
      </div>
      </div> */}
      
      {
        mainAnalyze &&
        <Stack sx={{ p: 2, mt: 6 }} spacing={button_spacing}>
          <Stack alignItems="center" justifyContent={'center'}>
            <Button disabled={fileData.analyzed !== 1 ? false : true} color='primary' variant='contained' size='large' onClick={handleMainAnalyzeClicked} sx={{ width: '500px' }}> {fileData.owner_id === undefined ? <LeftIcon style={{ paddingBottom: 5, marginRight: '5px', fontSize: '64px' }} /> : null} <h3 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '20px', fontFamily: 'inherit' }}> {fileData.file_id === undefined ? "Select a file" : "Analyze"} {fileData.owner_id === undefined ? null : <AnalyzeIcon style={{ paddingBottom: 5, marginLeft: '5px' }} />} </h3> </Button>
          </Stack>

          <Stack alignItems="center" justifyContent={'center'}>
            <Button disabled={fileData.analyzed !== 1 ? true : false} color='primary' variant='contained' size='large' onClick={handleGeneralInfo} sx={{ width: '500px' }}> <h3 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '20px', fontFamily: 'inherit' }}> General Info <InfoIcon style={{ paddingBottom: 5, marginLeft: '5px' }} /> </h3> </Button>
          </Stack>

          <Stack spacing={1} direction={'row'} alignItems="center" justifyContent={'center'}>
            <Stack spacing={button_spacing} direction={'column'} alignItems="center" justifyContent={'center'} >
              <Stack spacing={1} direction={'row'} width={300} >
                <FormControl color='secondary' >
                  <InputLabel sx={{ color: "black" }}>Type</InputLabel>
                  <Select disabled={fileData.analyzed !== 1 ? true : false} label="analyze L4" fullWidth={false} value={analyzeL4Mode} onChange={handleL4ModeSelectClicked} >
                    <MenuItem value={analyze_service.l4MODES.BOTH}> {analyze_service.l4MODES.BOTH} </MenuItem>
                    <MenuItem value={analyze_service.l4MODES.TCP} > {analyze_service.l4MODES.TCP} </MenuItem>
                    <MenuItem value={analyze_service.l4MODES.UDP} > {analyze_service.l4MODES.UDP} </MenuItem>
                  </Select>
                </FormControl>
                <Stack spacing={button_spacing} orientation="vertical">
                  <Button disabled={fileData.analyzed !== 1 ? true : false} color='primary' variant='contained' size='large' onClick={handleL4AnalyzeClicked}>
                    <h3 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '16px', fontFamily: 'inherit' }} > {analyzeL4Mode === analyze_service.l4MODES.TCP ? `${REPORT_L4} ${analyze_service.l4MODES.TCP}` : analyzeL4Mode === analyze_service.l4MODES.UDP ? `${REPORT_L4} ${analyze_service.l4MODES.UDP}` : `${REPORT_L4} Both`} <SearchIcon style={{ paddingBottom: 7, marginLeft: '5px', fontSize: '22px' }} /> </h3>
                  </Button>
                  <Button disabled={fileData.analyzed !== 1 ? true : false} color='primary' variant='contained' size='large' onClick={handleL2AnalyzeClicked}>
                    <h1 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '18px', fontFamily: 'inherit' }} > {REPORT_L2} <SwitchIcon style={{ paddingBottom: 4, marginLeft: '5px', fontSize: '22px' }} />  </h1>
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={button_spacing} direction={'column'} alignItems="center" justifyContent={'center'} sx={{ pr: 11 }}>
              <Stack  spacing={button_spacing}orientation="vertical">
                <Button disabled={fileData.analyzed !== 1 ? true : false} color='primary' variant='contained' size='large' onClick={handleGraph1Clicked}>
                  <h3 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '16px', fontFamily: 'inherit' }} >{GRAPH_L4} Both 
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 5.47L12 12L7.62 7.62L3 11V8.52L7.83 5l4.38 4.38L21 3zM21 15h-4.7l-4.17 3.34L6 12.41l-3 2.13V17l2.8-2l6.2 6l5-4h4z"></path></svg>
                  </h3>
                </Button>
                <Button disabled={fileData.analyzed !== 1 ? true : false} color='primary' variant='contained' size='large' onClick={handleGraph2Clicked}>
                  <h3 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '16px', fontFamily: 'inherit' }} > {GRAPH_L2} 
                    <svg style={{ marginLeft: '5px', marginBottom: "4px" }} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.222 4.601a9.499 9.499 0 0 1 1.395-.771c1.372-.615 2.058-.922 2.97-.33c.913.59.913 1.56.913 3.5v1.5c0 1.886 0 2.828.586 3.414c.586.586 1.528.586 3.414.586H17c1.94 0 2.91 0 3.5.912c.592.913.285 1.599-.33 2.97a9.498 9.498 0 0 1-10.523 5.435A9.5 9.5 0 0 1 6.222 4.601"></path><path fill="currentColor" d="M21.446 7.069a8.026 8.026 0 0 0-4.515-4.515C15.389 1.947 14 3.344 14 5v4a1 1 0 0 0 1 1h4c1.657 0 3.053-1.39 2.446-2.931"></path></svg>
                  </h3>
                </Button>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={button_spacing + 5} direction={'row'} alignItems="center" justifyContent={'center'} sx={{ pr: 10 }}>
            <Stack spacing={2} direction={'row'} alignItems="center" justifyContent={'center'} >
              <FormControl color='secondary'>
                <InputLabel sx={{ color: "black" }}>Type</InputLabel>
                <Select disabled={fileData.analyzed !== 1 ? true : false} label="analyze" fullWidth={false} value={analyzeAttacksMode} onChange={handleAttacksSelectClicked} >
                  <MenuItem value="both">Both</MenuItem>
                  <MenuItem value={attack_modes_dict.DDOS} >DDOS </MenuItem>
                  <MenuItem value={attack_modes_dict.MITM} >MITM </MenuItem>
                </Select>
              </FormControl>
              <Button disabled={fileData.analyzed !== 1 ? true : false} color='primary' variant='contained' size='large' onClick={handleAttackClicked}>
                <h3 style={{ textTransform: 'none', display: 'flex', alignItems: 'center', fontSize: '20px', fontFamily: 'inherit' }} > {analyzeAttacksMode === "DDOS" ? `${ATTACKS} - DDOS` : analyzeAttacksMode === "MITM" ? `${ATTACKS} - MITM` : `${ATTACKS} - Both`} {analyzeAttacksMode === "DDOS" ? <DDOSIcon style={{ paddingBottom: 5, marginLeft: '5px' }} /> : analyzeAttacksMode === "MITM" ? <MITMIcon style={{ paddingBottom: 8, marginLeft: '5px' }} /> : <TerminalIcon style={{ paddingBottom: 5, marginLeft: '5px' }} />}</h3>
              </Button>
            </Stack>
            
          </Stack>
          {
            fileData.file_id &&
            <Stack alignItems="center" justifyContent={'center'} direction={'row'} spacing={10}>
              <Button color='error' variant='contained' sx={{width: "10%"}} onClick={() => { if (fileData.file_id) setDeleteDialogOpen(true); else notify("Please select a file", NOTIFY_TYPES.warn) }} >
                <h2 style={{ textTransform: "none" }}>Delete file</h2>
                <TrashIcon sx={{ marginLeft: "4px", fontSize: '32px', marginBottom: "4px" }} />
              </Button>
              {/* <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: "grey" }} color='secondary' variant='contained' onClick={() => { deselectCallback() }}>
                <div>
                  <h3>DESELECT FILE</h3>
                </div>
              </Button> */}
            </Stack>
          }
          <div style={{ marginTop: "-3px", marginBottom: "-35px", display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'center' }}>
            <Button variant='contained' color='primary' onClick={scrollToTop} >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', textTransform: "none" }}>
                <h3>Back to top</h3>
                <KeyboardDoubleArrowUpIcon sx={{ marginLeft: "4px", fontSize: '34px', marginBottom: "2px" }} />
              </div>
            </Button>
          </div>
        </Stack>
      }
      {
        !mainAnalyze &&
        <div style={{ flexDirection: "column", display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
            <h3>Analyzing file</h3>
            <RadarLoader size={"200px"} style={{marginTop: "calc(9%)"}} />
        </div>
      }
      {
          deleteDialogOpen && 
          <GenereicDeleteDialog isOpen={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false) }} callBackFunction={handleDeletePressed} deletionType={"file: " + fileData.filename} />
      }
    </div>
  );
}

export default AnalyzePanelComp;