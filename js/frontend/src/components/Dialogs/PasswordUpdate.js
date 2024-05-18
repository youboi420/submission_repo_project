import React from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Stack, Select, MenuItem, FormControl, InputLabel, FormHelperText, Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditNote from '@mui/icons-material/EditNote'
import { updateUser } from '../../services/user_service'
import { hashPassword } from '../../services/hashPassword'

import * as websocket_service from '../../services/websocket_service';
import * as user_service from '../../services/user_service'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { NOTIFY_TYPES, notify } from '../../services/notify_service'


const PasswordUpdate = ({ isOpen = false, onClose, fetchDataAndSetRows, userObj, onSuccess, onFailed }) => {
  const [newPassword, setNewPassword] = React.useState('')
  const [currPassword, setCurrPassword] = React.useState('')
  const [showCurrPassword, setShowCurrPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [invalidCurrPassword, setInvalidCurrPassword] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState('')
  const [passwordErrorMatch, setPasswordErrorMatch] = React.useState('')
  // please break this into seperate sentences
  const passErrMSG = 'Minimum length 6 characters and 2 special characters'
  const passMatchMSG = "Password's match, please pick a new one"
  const isPasswordValid = (password) => {
    if (password.length < 6 || password.length > 254) return false
    const specialChars = /[^A-Za-z0-9]/g
    const specialCharCount = (password.match(specialChars) || []).length
    return specialCharCount >= 2
  };
  

  const isPasswordMatch = (p1, p2) => p1 !== p2

  const handleUpdate = async () => {
    try {
      if (isPasswordValid(currPassword) && isPasswordValid(newPassword)) {
        const newPassHashed = await hashPassword(newPassword)
        const currPassHashed = await hashPassword(currPassword)
        const update_response = await user_service.updatePassword(currPassHashed, newPassHashed)
        notify("Password updated successfully!", NOTIFY_TYPES.success)
        websocket_service.update(websocket_service.signal_codes.PASSWORD, "update_password")
        onClose()
      } else {
        if (! isPasswordValid(currPassword) ) setPasswordError(isPasswordValid(newPassword) ? '' : passErrMSG)
        if (! isPasswordValid(newPassword) ) setPasswordErrorMatch(isPasswordMatch(currPassword, newPassword) ? isPasswordValid(newPassword) ? '' : "New password's " + (passErrMSG).toLowerCase() : passMatchMSG)
      }
    } catch (error) {
      if ( error?.response?.status === 400) {
        setInvalidCurrPassword(true)
      } else {
        notify(error, NOTIFY_TYPES.error)
      }
    }
  }

  const handleClose = () => {
    onClose()
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleCurrPasswordVisibility = () => {
    setShowCurrPassword(!showCurrPassword)
  }
  
  React.useEffect(() => {
    if (isOpen) {
      if (userObj === undefined) {
        setNewPassword('')
      } else {
        setNewPassword('')
        setNewPassword(userObj.password)
      }
      setPasswordError('')
    }
  }, [isOpen, userObj])

  return (
    <div>

      <Dialog open={isOpen} onClose={handleClose} onAbort={handleClose} fullWidth maxWidth="sm" style={{ backdropFilter: "blur(1px)" }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
          Update your password
          <IconButton sx={{ ml: 'auto' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack>
            <TextField
              sx={{ marginBottom: 1, marginTop: 1 }}
              label="Current Password"
              value={currPassword}
              onChange={(e) => {
                setCurrPassword(e.target.value)
                setPasswordError(isPasswordValid(e.target.value) ? '' : passErrMSG)
              }}
              type={showCurrPassword ? 'text' : 'password'}
              error={!!passwordError} /* covert to boolean */
              helperText={passwordError}
              InputProps={{
                        style: { color: "black" },
                        endAdornment: (
                          <IconButton onClick={toggleCurrPasswordVisibility}>
                            {showCurrPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        ),
                      }}
            />
            <TextField
              sx={{ marginBottom: 1, marginTop: 1 }}
              label="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordErrorMatch(isPasswordMatch(e.target.value, currPassword) ? '' : passMatchMSG)
              }}
              type={showNewPassword ? 'text' : 'password'}
              error={!!passwordErrorMatch}
              helperText={passwordErrorMatch}
              InputProps={{
                style: { color: "black" },
                endAdornment: (
                  <IconButton onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
            />
          </Stack>
          {
            invalidCurrPassword &&
            <Alert severity="error" sx={{ marginTop: 0, marginBottom: -4 }}>
              The current password is incorrect, please retry.
            </Alert>
          }
          <Stack>
            <Button onClick={handleUpdate} color='info' variant='outlined' sx={{marginTop: 5}} startIcon={<EditNote />} >UPDATE</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PasswordUpdate