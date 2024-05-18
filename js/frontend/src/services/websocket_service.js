import { SOCKETS_URL } from './user_service';

import io from 'socket.io-client';
const socket = io(SOCKETS_URL)

const signal_codes = {
  UPDATE: "user_update",
  SIGNUP: "user_signup",
  DELETE: "user_delete",
  PASSWORD: "user_password",
  FILEUP: "user_file_upload",
  FILEDEL: "user_file_delete",
  FILEANZ: "user_file_analyze",
}

const update = (code, value) => { socket.emit(code, value) }
export { update, signal_codes }