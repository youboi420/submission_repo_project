import React from 'react';
import "../Style/CircleInfo.css"
import { Dialog, DialogTitle, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import HomePageStyle from '../Style/HomePage.module.css'


const InfoCard = ({ src, title, description, target }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const openDialog = () => {
    setIsDialogOpen(true);
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
  }

  return (
    <div>
      <div className='card-link-circle' onClick={openDialog} target={target}>
        <div className='card-circle'>
          <img src={src} alt={title} />
          <div className="card_info-circle">
            <h3>{title}</h3>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onClose={closeDialog} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: "blur(0.6px)"}} PaperProps={{sx: {borderRadius: "20px"}}}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }} className={HomePageStyle.desc}>
          {title}
          <IconButton sx={{ ml: 'auto', mb: 0.5 }} onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Paper sx={{padding: 3, width: "500px", height: "500px"}}>
          {description}
        </Paper>
      </Dialog>
    </div>
  );
}

export default InfoCard;
