import React from 'react';
import { Button, Box, Stack, Divider, IconButton, Typography, LinearProgress } from '@mui/material';
import { hostsDataTable, L4_DATA_TYPES } from './Common/L4Common';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import AnalyzePanelViewStyle from '../Style/AnalyzePanelViewStyle.module.css'
import SaveAsIcon from '@mui/icons-material/Save'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const L4ConvPanel = ({ convsDataArray, singleMode, proType }) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const [capStatus, setCapStatus] = React.useState(false)
  const ITEMS_PER_PAGE = proType === L4_DATA_TYPES.TCP ? (!singleMode ? 3 : 5) : (!singleMode ? 5 : 10);
  const handlePrevPage = () => {
    setStartIndex(Math.max(startIndex - ITEMS_PER_PAGE, 0));
  };

  const handleNextPage = () => {
    setStartIndex(Math.min(startIndex + ITEMS_PER_PAGE, convsDataArray?.length));
  };

  const totalPages = Math.ceil(convsDataArray?.length / ITEMS_PER_PAGE);
  
  React.useEffect(() => {
    setStartIndex(0)
  }, [convsDataArray?.length])

  const exportToPDF = (conversation, type) => {
    const cap = document.querySelector(`.${type}_conversation_${conversation.conversationId}`);
    const exportButton = cap.querySelector('.exportButton');
    exportButton.style.visibility = 'hidden';
    const scaleFactor = !singleMode ? 2 : 1;
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF(!singleMode ? 'p' : 'l', 'mm', 'a4');
      const compWidth = doc.internal.pageSize.getWidth();
      const compHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, compWidth, compHeight);
      doc.save(`${type}_conversation_${conversation.conversationId}.pdf`);
      exportButton.style.visibility = 'visible';
    });
  };
  

  return (
    <div style={{ flex: 1,}}>
      {!singleMode && <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: -5, marginBottom: 5 }} className={AnalyzePanelViewStyle.data_title}>{proType}</h1>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {
          totalPages !== 0 &&
          <Stack direction="row" alignItems="center" style={{ marginBottom: 10 }}>
            <IconButton onClick={handlePrevPage} disabled={startIndex === 0}>
              <FirstPageIcon />
            </IconButton>
            <Typography style={{ textTransform: "none", marginTop: 5 }}>
              Page: {Math.floor(startIndex / ITEMS_PER_PAGE) + 1} of {totalPages}
            </Typography>
            <IconButton onClick={handleNextPage} disabled={startIndex >= convsDataArray?.length - ITEMS_PER_PAGE}>
              <LastPageIcon />
            </IconButton>
          </Stack>
        }
        {
          totalPages === 0 &&
          <div>
            <h1 className={AnalyzePanelViewStyle.data_title}>
              {proType} conversations didn't accour
            </h1>
          </div>
        }
      </div>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: "calc(8%)" }}>
        <Stack spacing={1} style={{ width: '95%' }}>
          {convsDataArray?.slice(startIndex, startIndex + ITEMS_PER_PAGE)?.map((conversation, index) => (
            <div key={conversation.conversationId + index + proType} class={`${proType}_conversation_${conversation.conversationId}`}>
              <Box sx={{ paddingBottom: 1 }}>
                <div style={{ zIndex: 1000, position: "relative", left: !singleMode ? "calc(37.5%)" : "calc(63.8%)", marginBottom: !singleMode ? "calc(7% - 94px)" : "calc(7% - 150px)" }}>
                  <div>
                      <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={() => exportToPDF(conversation, proType)} aria-label="export to PDF" endIcon={<SaveAsIcon sx={{ mb: "4px" }} />} className='exportButton'>
                        <Typography variant="div">Export conv {conversation.conversationId + 1} to PDF</Typography>
                      </Button>
                  </div>
                </div>
                {hostsDataTable(singleMode, conversation, proType)}
              </Box>
              {
                index !== convsDataArray?.slice(startIndex, startIndex + ITEMS_PER_PAGE).length - 1 && (
                <Divider
                  orientation="horizontal"
                  sx={{ bgcolor: '#1976d2', borderBottomWidth: 8, marginRight: 10, marginLeft: 10 }}
                />)
              }
            </div>
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default L4ConvPanel;
