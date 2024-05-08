import { Typography } from '@mui/material'
import React from 'react'
import ContactBtnStyles from '../Style/ContactBtn.module.css'

function ContactBtn() {
  return (
    <div>
      <Typography>
        Network Analyzer - Coded by &nbsp;
        <a href="/contact" >
        <button className={ContactBtnStyles.btn} sx={{ color: "black", textTransform: "none" }} > 
        Yair Elad © {new Date().getFullYear()}
        </button>
        </a>
      </Typography>
    </div>
  )
}

export default ContactBtn