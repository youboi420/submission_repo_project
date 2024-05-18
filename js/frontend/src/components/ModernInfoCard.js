import React from 'react'
import ModernInfoCardStyles from '../Style/ModernInfoCard.module.css'
import HomePageStyle from '../Style/HomePage.module.css'

import { Dialog, DialogTitle, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'


function ModernInfoCard({ src, title, description, target }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const openDialog = () => {
    setIsDialogOpen(true);
  }
  const closeDialog = () => {
    setIsDialogOpen(false);
  }
  return (
    <div>
      <div className={ModernInfoCardStyles.card} onClick={openDialog}>
        <div className={ModernInfoCardStyles.card_details}>
          <img src={src} alt={title} className={ModernInfoCardStyles.card_image} />
          <p className={ModernInfoCardStyles.text_title}>{title}</p>
        </div>
        <a className={ModernInfoCardStyles.card_button} onClick={target}>More info</a>
      </div>
      <Dialog open={isDialogOpen} onClose={closeDialog} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: "blur(0.6px)"}} PaperProps={{sx: {borderRadius: "16px", borderColor: "blue", borderStyle: "solid", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }} className={HomePageStyle.desc}>
          {title}
          <IconButton sx={{ ml: 'auto', mb: 0.5 }} onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Paper sx={{ padding: 3, width: "500px", height: "500px" }}>
          {description}
        </Paper>
      </Dialog>
    </div>
  )
}

export default ModernInfoCard