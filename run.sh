#!bin/bash
##################################################
# this is a automated script to run the system   #
# auth - yair elad           				     #
##################################################
set -e

cd js
bash js_conf_env.sh
cd backend
node server.js &
cd ..
cd frontend
npm start &