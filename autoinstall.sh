#!bin/bash
##################################################
# this is a automated script to install all the  #
# dependecies of the c backend                   #
# auth - yair elad           				     #
##################################################
set -e
sudo apt install -y gcc
sudo apt install -y libjson-c-dev
sudo apt install -y libpcap-dev
sudo apt install -y mysql
sudo apt install -y make
sudo apt install -y npm
sudo npm install -y -g n
sudo n latest