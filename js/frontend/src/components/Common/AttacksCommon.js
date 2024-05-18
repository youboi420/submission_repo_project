import { DataGrid } from '@mui/x-data-grid'
import AnalyzePanelViewStyle from '../../Style/AnalyzePanelViewStyle.module.css'
import { Stack, Tooltip, Typography, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const DDOStableColumns = [
  { field: 'attacker_ip', headerName: "Attacker's IP", flex: 1, align: 'center', headerAlign: 'center' },
  { field: 'src_port', headerName: 'Source/Attack port', flex: 1, align: 'center', headerAlign: 'center' },
  { field: 'dest_port', headerName: 'Destination/The attacked port', flex: 1, align: 'center', headerAlign: 'center' },
];

const MITMtableColumns = [
  { field: 'ip', headerName: "victim's IP", flex: 1, align: 'center', headerAlign: 'center' },
]

const DDOSVictExplain = <div>
  victim - the ip address of the host which is being attacked.
</div>

const DDOSAtkrsExplain = <div>
  list of attackers - the list of ip address which have communicated and tried to take out the service and were flagged as mallicoius.
</div>

const MITMAtkrxplain = <div>
  attacker - the mac address of the host which is posioning reponse's.
</div>

const MITMVictsExplain = <div>
  list of victim's - the list of ip address which have spoofed by the bad actor and were flagged as contiged/attacked.
</div>

const DDOSAttackDataTable = (singleMode, attackersDataArray, attackID, victimObj) => {
  return (
    <div style={{ flex: 1, borderStyle: "solid", borderRadius: "12px" }} >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }} >
        <h1 className={AnalyzePanelViewStyle.data_title} >{"DDOS Attack: " + (attackID + 1)}</h1>
        <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }}>
          <Tooltip title={<Typography fontSize={16}>{DDOSVictExplain}</Typography>} style={{ cursor: "zoom-in" }} >
            <Stack direction="row">
              <div>
                Victim: {victimObj.victim}
              </div>
              <InfoIcon sx={{ ml: "5px", mb: "-4px" }} />
            </Stack>
          </Tooltip>
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
        <Tooltip title={<Typography fontSize={16}>{DDOSAtkrsExplain}</Typography>} style={{ cursor: "zoom-in" }} >
          <h3>
            Attacker's list
            <InfoIcon sx={{ mr: "5px", mb: "-4px" }} />
          </h3>
        </Tooltip>
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
        <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: "-2px" }}>
          <Tooltip title={<Typography fontSize={16}>{MITMAtkrxplain}</Typography>} style={{ cursor: "zoom-in" }} >
            <Stack direction="row">
              <div>
                Attacker: {attckerObj.attacker}
              </div>
              <InfoIcon sx={{ ml: "5px", mb: "2px" }} />
            </Stack>
          </Tooltip>
        </h2>
        <Tooltip title={<Typography fontSize={16}>{MITMVictsExplain}</Typography>} style={{ cursor: "zoom-in" }} >
          <h3>
            Victim's list
            <InfoIcon sx={{ mr: "5px", mb: "-4px" }} />
          </h3>
        </Tooltip>
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