/* npm lib's */
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { Server as SocketIO } from 'socket.io';

/* local module's and services*/
import * as db_service from './services/sql_services/db_service.js'
import * as users_service from './services/sql_services/users_service.js'
import * as reports_service from './services/sql_services/report_service.js'
import * as pcap_files_service from './services/sql_services/pcap_files_service.js'
import usersRouter from './routes/users.js'
import analyzeRoute from './routes/analyze.js'
import filesRoute from './routes/files.js'
import authRouter from './routes/auth.js'
import reportsRouter from './routes/reports.js'

dotenv.config()

/* config's and constants */
const port = process.env.PORT
const local_ip = process.env.LOCAL_IP_ADDRESS
const app = express()

const ws_signal_codes = {
  CONN: "connection",
  DISS: "disconnect",
  UPDATE: "user_update",
  SIGNUP: "user_signup",
  DELETE: "user_delete",
  PASSWORD: "user_password",
  FILEUP: "user_file_upload",
  FILEDEL: "user_file_delete",
  FILEANZ: "user_file_analyze",
}

const corsOptions = {
    origin: true,
    credentials: true,
  }
  
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())
  
  app.use('/analyze', analyzeRoute)
  app.use('/files', filesRoute)
  app.use('/auth', authRouter)
  app.use('/users', usersRouter)
  app.use('/reports', reportsRouter)
  
  const initialize_server = async () => {
    try {
      await db_service.connect_to_db()
      await users_service.create_users_table()
      await pcap_files_service.create_pcap_table()
      await reports_service.create_json_report_table()
      const server = app.listen(port, local_ip, () => {
        console.log(`Server is running on http://${local_ip}:${port}`)
    })
    const io = new SocketIO(server, {cors: {
      origin: true,
      credentials: true,
    }}); 
  
    io.on(ws_signal_codes.CONN, (socket) => {
      console.log(`(websocket)---------> a user connected ${socket.id}`);
      
      socket.on(ws_signal_codes.UPDATE, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.UPDATE}`);
        socket.broadcast.emit("update_panel", null);
      });

      socket.on(ws_signal_codes.SIGNUP, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.SIGNUP}`);
        socket.broadcast.emit("update_panel", null);
      });
      
      socket.on(ws_signal_codes.PASSWORD, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.PASSWORD}`);
        socket.broadcast.emit("update_panel", null);
      });

      socket.on(ws_signal_codes.FILEUP, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.FILEUP}`);
        socket.broadcast.emit("update_panel", null);
      });

      socket.on(ws_signal_codes.FILEDEL, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.FILEDEL}`);
        socket.broadcast.emit("update_panel", null);
      });

      socket.on(ws_signal_codes.FILEANZ, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.FILEANZ}`);
        socket.broadcast.emit("update_panel", null);
      });

      socket.on(ws_signal_codes.DELETE, (data) => {
        console.log(`(websocket)---------> ${socket.id} sent a ${ws_signal_codes.DELETE}`);
        socket.broadcast.emit("update_panel", null);
      });

      socket.on(ws_signal_codes.DISS, () => {
        console.log(`(websocket)---------> a user disconnected ${socket.id}`);
      })
    });

    app.get("/*", (req, res) => {
      console.log("(router)---------> path " + req.path + " is not available...");
      res.status(404).json({message: "path " + req.path + " is not available..."})
    })
  } catch (error) {
    console.error('Error initializing server:', error)
  }
}
initialize_server()