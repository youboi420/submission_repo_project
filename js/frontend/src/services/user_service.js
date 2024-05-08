import axios from 'axios'
/* 
  3,4,6
  עצמיים ודטרמננטים ירד
  טרנספומציות נשאר
  ---
  סייבר נשאר הכל
  ---
  רשתות תקשורת 5,8,10,12,13,16
  17,שיטות שידור
*/

axios.defaults.withCredentials = true;

const sql_api_path = '/sql_api'
const LOCAL_IP = process.env.REACT_APP_LOCAL_IP_ADDRESS
const SER_PORT = process.env.REACT_APP_SER_PORT
const BASE_URL = `http://${LOCAL_IP}:${SER_PORT}`
const USERS_URL = `${BASE_URL}/users`
const AUTH_URL = `${BASE_URL}/auth`
const USERS_URL_PROFILE = `${AUTH_URL}/profile`
const USERS_URL_VERIFY = `${AUTH_URL}/verify`
const USERS_URL_LOGIN = `${AUTH_URL}/login`
const USERS_URL_LOGOUT = `${AUTH_URL}/clear-cookie`
const USERS_URL_DEL = `${USERS_URL}/delete_account` 
const USERS_URL_DEL_FILES = `${USERS_URL}/delete_files` 
const USERS_UPDATE_PASS = `${USERS_URL}/update_pass`
export const SOCKETS_URL = `${BASE_URL}`
/* AUTH_URL */
export const DB_ERROR_CODES =
{
  nouser: "user not exists",
  dup: "duplicate username"
}
/* USERS_URL_EXEC */

export const getUserData = async () => {
  try {
    const response = await axios.get(`${USERS_URL_PROFILE}`)
    return response.data
  } catch (error) {
    return {valid: false}
  }
}
export const clearCookie = async () => {
  try {
    const response = await axios.get(`${USERS_URL_LOGOUT}`)
    return response
  } catch (error) {
    return {valid: false}
  }
}

export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.put(`${USERS_UPDATE_PASS}`, {
      oldpassword: oldPassword,
      newpassword: newPassword,
    })
    if (response.status === 200) {
    } else {
      console.error('Failed to update password:', response.data)
      throw new Error('Failed to update password')
    }
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}

export const deleteAccount = async () => {
  try {
    const response = await axios.delete(`${USERS_URL_DEL}`)
    return {valid: true, ...response}
  } catch (error) {
    return {valid: false}
  }
}

export const deleteAllFiles = async () => {
  try {
    const response = await axios.delete(`${USERS_URL_DEL_FILES}`)
    return {valid: true, ...response}
  } catch (error) {
    return {valid: false}
  }
}
// delete_files
export const verifyUserCookie = async () => {
  try {
    const response = await axios.get(`${USERS_URL_VERIFY}`)
    return response.data
  } catch (error) {
    return {valid: false}
  }
}

export const getJsonData = async () => {
  return await axios.get(`${BASE_URL}/files/json_data`)
}

export const createUser = async (newUsername, newPassword, newIsAdmin) => {
  try {
    const response = await axios.post(`${USERS_URL}${sql_api_path}/user`, {
      un: newUsername,
      password: newPassword,
      isadmin: newIsAdmin
    })
    if (response.status === 200) {
    } else {
      throw new Error('Failed to create user')
    }
  } catch (error) {
    if (error?.response) {
      if (error?.response?.status === 409) {
        throw new Error(DB_ERROR_CODES.dup)
      }
      else throw new Error('Failed to create user')
    }
    throw error
  }
}

export const updateUser = async (userId, newUsername, newPassword, newIsAdmin) => {
  try {
    const response = await axios.put(`${USERS_URL}${sql_api_path}/user/${userId}`, {
      un: newUsername,
      password: newPassword,
      isadmin: newIsAdmin,
    })
    if (response.status === 200) {
    } else {
      console.error('Failed to update user:', response.data)
      throw new Error('Failed to update user')
    }
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${USERS_URL}${sql_api_path}/all_users`)
    return response.data
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${USERS_URL}${sql_api_path}/user/${userId}`)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
export const login = async (un, password) => {
  try {
    const res = await axios.post(`${USERS_URL_LOGIN}`, {un: un, password: password})
    return res
  } catch (error) {
    if (error?.response) {
      if (error?.response?.status === 404) {
        throw new Error(DB_ERROR_CODES.nouser)
      }
      else throw new Error('Failed to create user')
    }
    throw error
  }
}

export const signup = async (un, password) => {
  try {
    const res = await axios.post(`${AUTH_URL}/signup`, {un: un, password: password})
    return res
  } catch (error) {
    if (error?.response) {
      if (error?.response?.status === 409) {
        throw new Error(DB_ERROR_CODES.dup)
      }
      else throw new Error('Failed to create user')
    }
    throw error
  }
}