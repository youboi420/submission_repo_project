import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AnimatedInfoCardStyles from '../Style/AnimatedInfoCard.css'
import HomePageStyle from '../Style/HomePage.module.css'
import { Avatar, Dialog, DialogTitle, Grid, IconButton, Paper } from '@mui/material';

function AnimatedInfoCard({ src, title, description, target }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const openDialog = () => {
    setIsDialogOpen(true);
  }
  const closeDialog = () => {
    setIsDialogOpen(false);
  }
  return (
    <div>
      <div class="card" onClick={openDialog}>
        <div class="content">
          <Grid container >
            <Grid item md={6}>
              <p class="para">
                {title}
              </p>
            </Grid>
            <Grid item md={6}>
              <img className="image-container" style={{width: "150px", height: "100px", marginBottom: "calc(-10%)"}}  src={src} alt={title} />
            </Grid>
          </Grid>
        </div>
      </div>
      <Dialog open={isDialogOpen} onClose={closeDialog} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: "blur(0.6px)"}} PaperProps={{sx: {borderRadius: "16px", borderColor: "#519dc0", borderStyle: "solid", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}}>
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

export default AnimatedInfoCard