/* react-comps */
import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, LinearProgress, Stack } from '@mui/material'
import { Navigate } from 'react-router-dom'
import io from 'socket.io-client';

import AdminIcon from '@mui/icons-material/AdminPanelSettings';

import AnalyzePageStyle from '../Style/AnalyzePage.module.css';

/* my comps */
import * as user_service from '../services/user_service'
import { notify, NOTIFY_TYPES } from '../services/notify_service'
import UserUpdateDialog from '../components/Dialogs/UserUpdateDialog'
import UserCreateDialog from '../components/Dialogs/UserCreateDialog'
import GenereicDeleteDialog from '../components/Dialogs/GenereicDeleteDialog'
import DevicesLoader from '../components/Loaders/DevicesLoader';

const socket = io(user_service.SOCKETS_URL)


const UserManagePage = ({ isValidUser, userData }) => {
  const [time, setTime] = React.useState(30);
  const [gridLoading, setGridLoading] = React.useState(false);  
  const [rows, setRows] = React.useState([])
  const [selectedRow, setSelectedRow] = React.useState([])
  const [editData, setEditData] = React.useState({})
  const [editDialogOpen, setEditDialogOpen] = React.useState(false, false)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false, false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false, false)
  const [deleteId, setDeleteId] = React.useState(undefined)
  const [deleteName, setDeleteName] = React.useState(undefined)
  
  const handleDelete = async (userId) => {
    try {
      if (userId !== undefined) {
        await user_service.deleteUser(userId)
        socket.emit("user_update", userId)
        notify("successfully deleted user", NOTIFY_TYPES.success)
        await fetchDataAndSetRows()
      } else {
        notify("please select a user to delete", NOTIFY_TYPES.warn)
      }
    } catch (error) {
      notify("error deleting user", NOTIFY_TYPES.error)
    }
  }

  const handleEdit = (userId) => {
    const userToEdit = rows.find((user) => user.id === userId)
    if (userToEdit !== undefined) {
      setEditData(userToEdit)
      setEditDialogOpen(true)
    } else {
      notify("please select a user to edit", NOTIFY_TYPES.warn)
    }
  }

  const handleCreate = () => {
    setCreateDialogOpen(true)
  }

  const handleSelectionChange = (selectionModel) => {
    setSelectedRow(selectionModel.map((id) => parseInt(id)))
  }

  const fetchDataAndSetRows = async () => {
    setGridLoading(true);
    try {
      const userData = await user_service.getAllUsers()
      setRows(() => {
        return userData.map(
          (obj) => ({ ...obj, delete: "d", edit: "e" })
        )
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
    setGridLoading(false);
  }

  React.useEffect(() => {
    document.title = "Admin page"
    if (userData.isadmin) {
      fetchDataAndSetRows()
      socket.on("update_panel", (data) => {
        fetchDataAndSetRows()
      })
    }
  }, []);

  const handleDeleteClicked = (userId) => {
    setDeleteId(userId);
    setDeleteName(rows.find((user) => user.id === userId).username);
    if (userId) {
      setDeleteDialogOpen(true);
    } else {
      notify("Please select a user to delete", NOTIFY_TYPES.warn);
    }
  };
  
  
  const columns = [
    { field: 'id', headerName: 'UID', headerAlign: 'center', align: 'center', width: 150 },
    { field: 'username', headerName: 'Username', headerAlign: 'center', align: 'center', width: 300 },
    {
      // ask gepeto to make it flex box
      field: 'isadmin', headerName: 'Admin', headerAlign: 'center', align: 'center', width: 150, renderCell: (params) => {
        return <Box sx={{ boxShadow: 4 }} className={AnalyzePageStyle.files_grid} style={{ fontWeight: 'lighter', fontFamily: "monospace", fontSize: "16px",borderRadius: '4px', width: "60%",  color: "white" , backgroundColor: params.value === 1 ? "#2e7d32" : "#d32f2f", textAlign: 'center' }}> {params.value === 1 ? <div>Yes</div> : <div>No</div>} </Box>
      }
    },
    { field: 'file_count', headerName: 'Files', headerAlign: 'center', align: 'center', width: 250 },
    { field: 'analyzed_file_count', headerName: 'Analyzed', headerAlign: 'center', align: 'center', width: 200 },
    { field: 'edit', headerName: "Edit user", headerAlign: 'right', align: 'right', width: 250, renderCell: (params) => {
      return (
        <div>
          <Button onClick={() => { handleEdit(params.row.id) }} color='primary' variant='contained'  sx={{textTransform: "none"}} >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: "15px", marginRight: "15px" }}>
              <span style={{fontSize: "16px", fontFamily: "monospace"}} >Edit</span>
              <div style={{ marginLeft: '10px', marginBottom: "-8px" }} >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="2.75" r="2.25"></circle><path d="M3.5 12.5h-3V11A4.51 4.51 0 0 1 7 7m6.5 1.5l-4.71 4.71l-2.13.29l.3-2.13l4.7-4.71L13.5 8.5z"></path></g></svg>
              </div>
            </div>
          </Button>
        </div>
      )
    }
  },
    { field: 'delete', headerName: "Delete user", headerAlign: 'center', align: 'center', width: 210, renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => { handleDeleteClicked(params.row.id) }} color='error' variant='contained' sx={{textTransform: "none"}} >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{fontSize: "16px", fontFamily: "monospace"}} >Delete</span>
                <div style={{ marginLeft: '10px', marginBottom: "-8px" }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="2.75" r="2.25"></circle><path d="M5 12.5H.5V11a4.5 4.5 0 0 1 6.73-3.91m6.27 2.17L9.26 13.5m0-4.24l4.24 4.24"></path></g></svg>
                </div>
              </div>
            </Button>
          </div>
        )
      }
    }
  ]

  if (isValidUser && userData.isadmin)
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
          <Box className={AnalyzePageStyle.files_grid} sx={{ mt: "20px", mx: "10px", width: '80%' ,height: "88vh", display: 'flex', flexDirection: 'column', textAlign: 'center', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(200, 200, 200, 0.4))', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
            <Box sx={{ fontSize: "22px", marginBottom: 'calc(-2%)', justifyContent: 'center', textAlign: 'center', paddingTop: 0.5 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}> <h1>Welcome Admin - {userData.username}</h1> <AdminIcon style={{ marginLeft: '5px', fontSize: "52px" }} /> </Box>
            <div style={{ justifyContent: 'flex-end', textAlign: 'right', alignItems: "flex-end", marginRight: "calc(1%)"}}>
            <Button onClick={handleCreate} color='success' variant='contained' sx={{marginBottom: '10px',}} >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                <span style={{padding: 4, textTransform: "none"}}>Create User</span>
                <div style={{ marginLeft: '10px', marginBottom: "-8px" }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 5.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m1.5 7h-6v-.542a4.51 4.51 0 0 1 6.5-4m3.5-.458v6m-3-3h6"></path></svg>
                </div>
              </div>
            </Button>
            </div>
            <Box sx={{ flex: 1, overflow: 'hidden', zIndex: '-100' }}>
              {
                // gridLoading && <LinearProgress size={75} />
                gridLoading && <DevicesLoader />
              }
              {
                !gridLoading &&
                <DataGrid rows={rows} columns={columns} onRowDoubleClick={(row) => { setEditData(row.row); setEditDialogOpen(true); }} onRowSelectionModelChange={handleSelectionChange} style={{ backdropFilter: "blur(0px)", fontFamily: "monospace", fontSize: "20px" ,fontWeight: "bold", overflow: 'hidden', borderColor: 'transparent', borderRadius: '12px'}} />
              }
            </Box>
          </Box>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
        </div>
        {
          editDialogOpen &&
          <UserUpdateDialog isOpen={editDialogOpen} fetchDataAndSetRows={fetchDataAndSetRows} onClose={() => { setEditDialogOpen(false); setSelectedRow({}) }} userObj={editData} onSuccess={() => { notify("UPDATE USER: Success", NOTIFY_TYPES.success); socket.emit("user_update") }} onFailed={() => { notify("UPDATE USER: Failed", NOTIFY_TYPES.error) }} />
        }

        {
          createDialogOpen &&
          <UserCreateDialog isOpen={createDialogOpen} fetchDataAndSetRows={fetchDataAndSetRows} onClose={() => { setCreateDialogOpen(false); setSelectedRow({}) }} onSuccess={() => { notify("CREATE: Success", NOTIFY_TYPES.success); socket.emit("user_update") }} onFailed={() => { notify("CREATE: Failed", NOTIFY_TYPES.error) }} />
        }

        {
          deleteDialogOpen &&
          <GenereicDeleteDialog isOpen={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false); setSelectedRow({}) }} callBackFunction={() => handleDelete(deleteId)} deletionType={"user : " + deleteName} />
        }

      </div>
    )

  else if (isValidUser) {
    return (
      <div>
        <h1>Your'e not an admin sorry...</h1>
      </div>
    )
  }

  return (
    <Navigate to={'/login'} />
  );
}

export default UserManagePage