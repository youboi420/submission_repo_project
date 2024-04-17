import { Avatar, Box, Button, Container, Grid, TextField, Link, Typography, Alert, IconButton, InputAdornment } from '@mui/material'
import React from 'react'
import RegisterPageStyle from '../Style/LoginPage.module.css'
import UserIcon from '@mui/icons-material/Person'
import { NOTIFY_TYPES, notify } from '../services/notify_service'
import { hashPassword } from '../services/hashPassword'
import { Navigate, useNavigate } from 'react-router-dom'
import * as user_service from '../services/user_service'
import * as utils_service from '../services/utils_service'

import LoginIcon from '@mui/icons-material/Login'
import KeyIcon from '@mui/icons-material/VpnKey'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const ANALYZE_PAGE = '/analyzeandfiles'

function SignUpPage({ isValidUser }) {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [repeat_password, setRepeatPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false)
  const [usernameError, setUsernameError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [passwordErrorMiss, setPasswordErrorMiss] = React.useState('')
  const [formError, setFormError] = React.useState('')
  let navigate = useNavigate();
  const isUsernameValid = (username) => /^[a-zA-Z][a-zA-Z0-9]{0,250}$/.test(username)
  const isPasswordValid = (password) => password.length >= 6 && /^.{0,250}$/.test(password)
  const isPasswordMatch = (p1, p2) => p1 === p2


  const handleUsernameChange = (event) => {
    const value = event.target.value
    setUsername(value)
    setUsernameError(isUsernameValid(value) ? '' : 'Invalid username')
  }

  const handlePasswordChange = (event) => {
    const value = event.target.value
    setPassword(value)
    setPasswordError(isPasswordValid(value) ? '' : 'Invalid password')
    setPasswordErrorMiss(isPasswordMatch(value, repeat_password) ? '' : "Password's do not match")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const togglePasswordRepeatVisibility = () => {
    setShowPasswordRepeat(!showPasswordRepeat)
  }

  const handleRepPasswordChange = (event) => {
    const value = event.target.value
    setRepeatPassword(value)
    setPasswordErrorMiss(isPasswordMatch(value, password) ? '' : "Password's do not match")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (username === '' || password === '' || repeat_password === '') {
      setFormError("One or more fields are empty...")
      notify("One or more fields are empty...", NOTIFY_TYPES.error)
      return
    }

    if (!isPasswordMatch(password, repeat_password)) {
      setPasswordErrorMiss("Password's do not match - please try again")
      return
    }
    if (!isPasswordValid(password)) {
      setPasswordError('Invalid password')
      return
    }
    if (!isUsernameValid(username)) {
      setUsername('Invalid username')
      return
    }
    const hashed_pass = await hashPassword(password)

    try {
      const res = await user_service.signup(username, hashed_pass)
      if (res.data.valid === true) {
        navigate(ANALYZE_PAGE);
        utils_service.refreshPage()
      } else {
        
      }
    } catch (error) {
      console.error(error);
      if (error.message === user_service.DB_ERROR_CODES.dup) {
        setFormError("Username is taken")
        notify("USERNAME TAKEN", NOTIFY_TYPES.short_error)
      } else {
        notify("server error ", NOTIFY_TYPES.error)
      }
    }
  
  }

  React.useEffect(() => {
    document.title = "Signup page"
  }, []);
  
  if (!isValidUser)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh' }} className={RegisterPageStyle.body}>
        <Container component="main" maxWidth='sm' style={{ justifyContent: 'center' }} >
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: "blur(50px)", borderRadius: "4%", borderStyle: 'dashed' , borderColor: "white" }}>
              <Avatar sx={{ m: 2, bgcolor: '#1976d2' }}><UserIcon /></Avatar>
              <Typography component="h1" variant="h5" color={"white"}>
                Create your account
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, px: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='username'
                      label='Username'
                      type="text"
                      name='username'
                      autoComplete='username'
                      value={username}
                      onChange={handleUsernameChange}
                      error={!!usernameError}
                      helperText={<Typography sx={{fontSize: "16px", fontWeight: "bold"}}>{usernameError}</Typography>}
                      InputProps={{
                        style: { color: "black" },
                        startAdornment: <InputAdornment position="start"><UserIcon sx={{ color: "black" }}/></InputAdornment>,
                      }}
                      InputLabelProps={{ style: { color: "black", fontSize: "18px" } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='password'
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      name='Password'
                      autoComplete='password'
                      value={password}
                      onChange={handlePasswordChange}
                      error={!!passwordError}
                      helperText={<Typography sx={{fontSize: "16px", fontWeight: "bold"}}>{passwordError}</Typography>}
                      InputLabelProps={{ style: { color: "black", fontSize: "18px" } }}
                      InputProps={{
                        style: { color: "black" },
                        startAdornment: <InputAdornment position="start"><KeyIcon sx={{ color: "black" }}/></InputAdornment>,
                        endAdornment: (
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityIcon sx={{ color: "black" }}/> : <VisibilityOffIcon sx={{ color: "black" }}/>}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='rep_password'
                      label='Repeat password'
                      type={showPasswordRepeat ? 'text' : 'password'}
                      name='rep_Password'
                      autoComplete='password'
                      value={repeat_password}
                      onChange={handleRepPasswordChange}
                      error={!!passwordErrorMiss}
                      helperText={<Typography sx={{fontSize: "16px", fontWeight: "bold"}}>{passwordErrorMiss}</Typography>}
                      InputLabelProps={{ style: { color: "black", fontSize: "17px" } }}
                      InputProps={{
                        style: { color: "black" },
                        startAdornment: <InputAdornment position="start"><KeyIcon sx={{ color: "black" }}/></InputAdornment>,
                        endAdornment: (
                          <IconButton onClick={togglePasswordRepeatVisibility}>
                            {showPasswordRepeat ? <VisibilityIcon sx={{ color: "black" }}/> : <VisibilityOffIcon sx={{ color: "black" }}/>}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, textTransform: "none" }}
                >
                  <Typography sx={{ color: "white", fontSize: "22px" }} >
                  Sign Up
                  </Typography>
                  <LoginIcon sx={{ color: "white", fontSize: "22px", marginBottom: "3px", ml: "10px" }}/>
                </Button>
                <Grid container justifyContent="center">
                  <Grid item style={{ padding: '10px' }}>
                    <Link href="/login"  variant="body1" style={{ color: '#314852', paddingBottom: '10px'}}>
                      Already have an account? - Sign in here
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    )

  return (
    <Navigate to={ANALYZE_PAGE}/>
  )
}

export default SignUpPage