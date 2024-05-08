import React from 'react';
import { Button, Box, Stack, Divider, IconButton, Typography } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { arpDataTable } from './Common/L2Common';
import AnalyzePanelViewStyle from '../Style/AnalyzePanelViewStyle.module.css'
import SaveAsIcon from '@mui/icons-material/Save'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const L2ConvComp = ({ convsDataArray }) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const ITEMS_PER_PAGE = 10;
  
  const handlePrevPage = () => {
    setStartIndex(Math.max(startIndex - ITEMS_PER_PAGE, 0));
  };

  const handleNextPage = () => {
    setStartIndex(Math.min(startIndex + ITEMS_PER_PAGE, convsDataArray?.length));
  };

  const totalPages = Math.ceil(convsDataArray?.length / ITEMS_PER_PAGE);

  const exportToPDF = (conversation) => {
    const cap = document.querySelector(`.arp_conversation_${conversation.conversationId}`);
    const exportButton = cap.querySelector('.exportButton');
    exportButton.style.visibility = 'hidden';
    const scaleFactor = 1;
    html2canvas(cap, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('l', 'mm', 'a4');
      const compWidth = doc.internal.pageSize.getWidth();
      const compHeight = doc.internal.pageSize.getHeight();
      console.log(compWidth, compHeight);
      doc.text("Layer 2 - ARP Conversations", compWidth / 2, 10, { align: 'center' });
      doc.addImage(imgData, 'PNG', 0, 20, compWidth, compHeight / 2);
      doc.save(`arp_conversation_${conversation.conversationId + 1}.pdf`);
      exportButton.style.visibility = 'visible';
    });
  };


  return (
    <div style={{ flex: 1 }}>
      <h1 className={AnalyzePanelViewStyle.data_title}  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>Layer 2 - ARP Conversations</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {
          totalPages !== 0 &&
          <Stack direction="row" alignItems="center" >
            <IconButton onClick={handlePrevPage} disabled={startIndex === 0}>
              <FirstPageIcon />
            </IconButton>
            <Typography style={{textTransform: "none", marginTop: 5}}>
              Page: {Math.floor(startIndex / ITEMS_PER_PAGE) + 1} of {totalPages}
            </Typography>
            <IconButton onClick={handleNextPage} disabled={startIndex >= convsDataArray?.length - ITEMS_PER_PAGE}>
              <LastPageIcon />
            </IconButton>
          </Stack>
        }
        {
          totalPages === 0 &&
          <div style={{marginTop: "calc(18%)"}}>
            <h1 className={AnalyzePanelViewStyle.data_title}>
              Arp conversations didn't accour
            </h1>
          </div>
        }
      </div>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: "calc(3%)"}}>
        <Stack spacing={1} style={{ width: '70%', height: "calc(100% + 300vh)" }}>
          {
            convsDataArray.slice(startIndex, startIndex + ITEMS_PER_PAGE).map((conversation, index) => (
              <div className={`arp_conversation_${conversation.conversationId}`}>
                <div style={{ zIndex: 1000, position: "relative", left: "calc(83%)", marginBottom: "calc(7% - 120px)" }}>
                  {
                    totalPages !== 0 &&
                    <div>
                      <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={() => exportToPDF(conversation)} aria-label="export to PDF" endIcon={<SaveAsIcon sx={{ mb: "4px" }} />} className='exportButton'>
                        <Typography variant="div">Export conv {conversation.conversationId + 1} to PDF</Typography>
                      </Button>
                  </div>
                  }
                </div>
                <Box sx={{ paddingBottom: 1 }}>
                  {
                    arpDataTable(conversation)
                  }
                </Box>
                {
                  index !== convsDataArray?.slice(startIndex, startIndex + ITEMS_PER_PAGE).length - 1 && (
                  <Divider
                    orientation="horizontal"
                    sx={{ bgcolor: '#1976d2', borderBottomWidth: 8, marginRight: 10, marginLeft: 10 }}
                  />)
                }
              </div>
            ))
          }
        </Stack>
      </div>
    </div>
  );
};

export default L2ConvComp;