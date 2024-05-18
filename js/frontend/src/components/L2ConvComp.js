import React from 'react';
import { Button, Box, Stack, Divider, IconButton, Typography } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { arpDataTable } from './Common/L2Common';
import AnalyzePanelViewStyle from '../Style/AnalyzePanelViewStyle.module.css'
import SaveAsIcon from '@mui/icons-material/Save'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const L2ConvComp = ({ convsDataArray, filename }) => {
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
      doc.save(`${filename}_arp_conversation_${conversation.conversationId + 1}.pdf`);
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
          <div style={{marginTop: "calc(12%)", }}>
            <h1 className={AnalyzePanelViewStyle.data_title} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{ marginBottom: "25px" }} xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 14 14"><path fill="#1976d2" fillRule="evenodd" d="M.28 1.962c0-.111.054-.283.294-.507c.24-.224.623-.455 1.147-.662C2.767.381 4.253.112 5.927.112c1.674 0 3.16.269 4.206.681c.525.207.907.438 1.147.662c.24.224.295.396.295.507c0 .111-.055.283-.295.506c-.24.225-.622.455-1.147.662c-1.045.413-2.532.682-4.206.682c-1.674 0-3.16-.27-4.206-.682c-.524-.207-.906-.437-1.147-.662c-.24-.223-.294-.395-.294-.506m11.422 1.76c-.323.22-.7.41-1.11.571c-1.225.483-2.874.769-4.665.769c-1.79 0-3.44-.286-4.664-.769a5.746 5.746 0 0 1-1.11-.57v2.584c.039.093.118.208.266.343c.248.226.642.458 1.183.666c1.076.414 2.605.683 4.325.683c.271 0 .537-.007.797-.02a4.657 4.657 0 0 1 4.978-1.919zM5.927 9.25l.195-.001a4.662 4.662 0 0 0-.196 1.34c0 .625.123 1.22.346 1.764c-.114.003-.23.005-.345.005c-3.19 0-5.774-1.11-5.774-2.475V7.999c.298.183.636.343 1 .483c1.252.482 2.94.767 4.774.767ZM10.588 14a3.412 3.412 0 1 0 0-6.824a3.412 3.412 0 0 0 0 6.824m-2.116-3.412c0-.345.28-.625.625-.625h2.982a.625.625 0 1 1 0 1.25H9.097a.625.625 0 0 1-.625-.625" clipRule="evenodd"></path></svg>
                Arp conversations didn't accrued
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
                      <Button sx={{ ml: 1, textTransform: 'none' }} edge="end" color="primary" variant='contained' onClick={() => exportToPDF(conversation)} aria-label="export to PDF" endIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"></path><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"></path><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"></path><path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"></path></svg>
                      } className='exportButton'>
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