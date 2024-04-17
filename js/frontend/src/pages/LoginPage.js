import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import UserIcon from '@mui/icons-material/Person'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LoginPageStyle from '../Style/LoginPage.module.css'

import KeyIcon from '@mui/icons-material/VpnKey'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import SignupIcon from '@mui/icons-material/PersonAdd';
import { notify, NOTIFY_TYPES } from '../services/notify_service'
import * as user_service from '../services/user_service'
import { hashPassword } from '../services/hashPassword'
import { Navigate, useNavigate } from 'react-router-dom'
import * as utils_service from '../services/utils_service'
import { IconButton, InputAdornment } from '@mui/material'


const defaultTheme = createTheme()
const ANALYZE_PAGE = '/analyzeandfiles'

export default function LoginPage({ isValidUser }) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [password_value, setPassword] = React.useState('')
  const [usernameError, setUsernameError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  let navigate = useNavigate();

  const handleUsernameChange = (event) => {
    const value = event.target.value
    setUsername(value)
    setUsernameError(isUsernameValid(value) ? '' : 'Invalid username')
  }

  const handlePasswordChange = (event) => {
    const value = event.target.value
    setPassword(value)
    setPasswordError(isPasswordValid(value) ? '' : 'Invalid password')
  }

  const isUsernameValid = (username) => /^[a-zA-Z][a-zA-Z0-9]{0,250}$/.test(username)
  const isPasswordValid = (password) => password.length >= 6 && /^.{0,250}$/.test(password)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isUsernameValid(username)) {
      setUsernameError('Invalid username')
      return
    }
    if (!isPasswordValid(password_value)) {
      setPasswordError('Invalid password')
      return
    }
    const hashed_pass = await hashPassword(password_value)
    const user = {
      un: username,
      password: hashed_pass,
    }
    try {
      const res = await user_service.login(user.un, user.password)
      if (res.data.valid === true) {
        navigate(ANALYZE_PAGE);
        utils_service.refreshPage()
        notify(`conncted going to "/home"`, NOTIFY_TYPES.success)
      } else {
        notify("Incorrect user name or password", NOTIFY_TYPES.error)
        setPasswordError("Incorrect password")
      }
    } catch (error) {
      if (error.message === user_service.DB_ERROR_CODES.nouser) {
        notify("user not found", NOTIFY_TYPES.error)
        setUsernameError("Username not found")
      }
      else notify("server error", NOTIFY_TYPES.error)
    }
  }
  // window.onload = () => {
  //   verifyCookieOnLoad()
  // }

  React.useEffect(() => {
    document.title = "Login page"
  }, []);

  if (!isValidUser)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh' }} >
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs" style={{ justifyContent: 'center' }} className={LoginPageStyle.body}>
            <CssBaseline />
            <Box sx={{ margin: -10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: "blur(10000px)", borderRadius: "4%", borderStyle: 'dashed', borderColor: "white" }}>
              <Avatar sx={{ m: 2, bgcolor: '#1976d2' }}>
                <UserIcon />
              </Avatar>
              <Typography component="h1" variant="h5" color={"white"}>
                Login to your account
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, px: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      value={username}
                      onChange={handleUsernameChange}
                      error={!!usernameError}
                      helperText={<Typography sx={{fontSize: "14px", fontWeight: "bold"}}>{usernameError}</Typography>}
                      InputLabelProps={{ style: { 
                        color: "black", 
                        fontSize: "18px"
                      }}}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><UserIcon sx={{ color: "black" }}/></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      value={password_value}
                      onChange={handlePasswordChange}
                      error={!!passwordError}
                      helperText={<Typography sx={{fontSize: "14px", fontWeight: "bold"}}>{passwordError}</Typography>}
                      InputLabelProps={{ style: { color: "black", fontSize: "18px" } }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><KeyIcon sx={{ color: "black" }}/></InputAdornment>,
                        endAdornment: (
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityIcon sx={{ color: "black" }}/> : <VisibilityOffIcon sx={{ color: "black" }}/>}
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
                  Login
                  </Typography>
                  <SignupIcon sx={{ color: "white", fontSize: "22px", marginBottom: "3px", ml: "10px" }}/>
                </Button>
                <Grid container justifyContent="center">
                  <Grid item style={{ padding: '10px' }}>
                    <Link href="/signup"  variant="body1" style={{ color: '#314852', paddingBottom: '10px'}}>
                    Don't have an account? - Sign up here
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    )
  return (
    <Navigate to={ANALYZE_PAGE}/>
  )
}