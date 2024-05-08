import React from 'react';
import { Button, Box, Stack, Divider, IconButton, Typography, Grid } from '@mui/material';
import { MITMAttackDataTable } from '../Common/AttacksCommon';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

import SaveAsIcon from '@mui/icons-material/Save'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const MITMViewComp = ({ attacskDataArray, singleMode }) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const ITEMS_PER_PAGE = 3;

  const handlePrevPage = () => {
    setStartIndex(Math.max(startIndex - ITEMS_PER_PAGE, 0));
  };

  const handleNextPage = () => {
    setStartIndex(Math.min(startIndex + ITEMS_PER_PAGE, attacskDataArray?.length));
  };

  const totalPages = Math.ceil(attacskDataArray?.length / ITEMS_PER_PAGE);

  const exportToPDF = () => {
    const cap = document.querySelector('.mitm_report')
    const scaleFactor = 1
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const doc = new jsPDF('l', 'mm', 'a4')
      const compWidth = doc.internal.pageSize.getWidth()
      const compHeight = doc.internal.pageSize.getHeight()
      doc.addImage(imgData, 'PNG', 0, 0, compWidth, compHeight)
      doc.save(`MITM-Report.pdf`)
    })
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ zIndex: 1000, position: "fixed", justifyContent: "center", top: "calc(20%)", left: "calc(6%)" }}>
        <Button
          sx={{ ml: 1, textTransform: 'none' }}
          edge="end"
          color="primary"
          variant='contained'
          onClick={exportToPDF}
          aria-label="export to PDF"
          endIcon={<SaveAsIcon sx={{ mb: "4px" }} />}
        >
          <Typography variant="h6">Export MITM&nbsp; report to PDF</Typography>
        </Button>
      </div>
      <div className='mitm_report'>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <Grid container xs={20} spacing={15} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Grid item md={4} >
            <DDOSStatsChartComp singleMode={singleMode} attacks={attacskDataArray?.attackers} height={"500px"} width={"300px"}/>
            </Grid>
            <Grid item md={4} >
              <DDOSStatsChartComp singleMode={singleMode} attacks={attacskDataArray?.attackers} />
            </Grid>
            <Grid item md={4} >
            <DDOSStatsChartComp singleMode={singleMode} attacks={attacskDataArray?.attackers} />
            </Grid>
          </Grid> */}
            {
              totalPages !== 0 &&
              <Stack direction="row" alignItems="center" style={{ marginBottom: 10 }}>
                <IconButton onClick={handlePrevPage} disabled={startIndex === 0}>
                  <FirstPageIcon />
                </IconButton>
                <Typography style={{ textTransform: "none", marginTop: 5 }}>
                  Page: {Math.floor(startIndex / ITEMS_PER_PAGE) + 1} of {totalPages}
                </Typography>
                <IconButton onClick={handleNextPage} disabled={startIndex >= attacskDataArray?.length - ITEMS_PER_PAGE}>
                  <LastPageIcon />
                </IconButton>
              </Stack>
            }
          </Stack>
        </div>
        <div style={{ height: '70vh' }}>
          <Stack spacing={1} style={{ width: singleMode ? '1300px' : '600px' }}>
            {
              attacskDataArray?.slice() &&
              attacskDataArray?.slice(startIndex, startIndex + ITEMS_PER_PAGE)?.map((attack, index) => (
                <div key={index}>
                  <Box>
                    {MITMAttackDataTable(singleMode, attack?.victims.map((victim, victimIndex) => ({ ...victim, id: victimIndex })), index, { attacker: attack?.attacker })}
                  </Box>
                  {
                    index !== attacskDataArray?.slice(startIndex, startIndex + ITEMS_PER_PAGE).length - 1 && (
                      <Divider orientation="horizontal" sx={{ bgcolor: '#1976d2', borderBottomWidth: 15, marginRight: 10, marginLeft: 10 }} />
                    )
                  }
                </div>
              ))
            }
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default MITMViewComp;