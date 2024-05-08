const os = require('os')
const fs = require('fs')

function get_local_ip() {
  const interfaces = os.networkInterfaces()
  for (const interface_name in interfaces) {
    const interfaceInfo = interfaces[interface_name]
    for (const iface of interfaceInfo) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

const local_ip = get_local_ip()
const REACT_PORT = 8080
const SER_PORT = 8081
const SQL_API_PATH = "/sql_api"
const SALT = '$2a$10$EJ46JvKZfl4omzio9k5Z9.'
const env_content = `############# ENV FILE #############
REACT_APP_LOCAL_IP_ADDRESS=${local_ip}
PORT=${REACT_PORT}
REACT_APP_SER_PORT=${SER_PORT}
REACT_APP_SQL_API_PATH=${SQL_API_PATH}
REACT_APP_STKY=6LdlesgpAAAAANWnA9MIHPvSkHwm_BQesqIlu8ig
REACT_APP_SSKY=6LdlesgpAAAAAANuTSREg8-0LQVatjYvrqyJvVV2
############# END ENV FILE #############`


console.log("rewriting .env")
fs.writeFileSync('.env', env_content)