import { DataGrid } from '@mui/x-data-grid'
import AnalyzePanelViewStyle from '../Style/AnalyzePanelViewStyle.module.css'
import { Stack, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';



const DDOStableColumns = [
  { field: 'attacker_ip', headerName: "Attacker's IP", flex: 1, align: 'center', headerAlign: 'center' },
  { field: 'src_port', headerName: 'Source/Attack port', flex: 1, align: 'center', headerAlign: 'center' },
  { field: 'dest_port', headerName: 'Destination/The attacked port', flex: 1, align: 'center', headerAlign: 'center' },
];

const MITMtableColumns = [
  { field: 'ip', headerName: "victim's IP", flex: 1, align: 'center', headerAlign: 'center' },
]

const DDOSAttackDataTable = (singleMode, attackersDataArray, attackID, victimObj) => {
  return (
    <div style={{ flex: 1, borderStyle: "solid", borderRadius: "12px" }} >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }} >
        <h1 className={AnalyzePanelViewStyle.data_title} >{"DDOS Attack: " + (attackID + 1)}</h1>
        <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }}><Tooltip title={<Typography fontSize={16}>boilerplateyay</Typography>} style={{cursor: "zoom-in"}} >
          <Stack direction="row">
          <InfoIcon sx={{mr: "5px" }}/>
          <div>
            Victim: {victimObj.victim} 
          </div>
          </Stack>
          </Tooltip>
        </h2>
      </div>
      <DataGrid 
        sx={{ height: "52vh", borderStyle: "solid", borderColor: "transparent", borderRadius: "18px", borderWidth: "medium", fontSize: "16px", fontFamily: "monospace" }}
        rows={attackersDataArray}
        columns={DDOStableColumns}
      />
    </div>
  )
}

const MITMAttackDataTable = (singleMode, victimsDataArray, attackID, attckerObj) => {
  return (
    <div style={{ flex: 1, borderStyle: "solid", borderRadius: "12px" }} >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }} >
        <h1 className={AnalyzePanelViewStyle.data_title} >{"MITM Attack: " + (attackID + 1)}</h1>
        <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }}><Tooltip title={<Typography fontSize={16}> boilerplateyay</Typography>} style={{cursor: "zoom-in"}} >
          <Stack direction="row">
          <InfoIcon sx={{mr: "5px" }}/>
          <div>
            Attacker: {attckerObj.attacker} 
          </div>
          </Stack>
          </Tooltip>
        </h2>
      </div>
      <DataGrid
        sx={{ height: "52vh", borderStyle: "solid", borderColor: "transparent", borderRadius: "18px", borderWidth: "medium", fontSize: "16px", fontFamily: "monospace" }}
        rows={victimsDataArray}
        columns={MITMtableColumns}
      />
    </div>
  )
}

export { DDOSAttackDataTable, MITMAttackDataTable }