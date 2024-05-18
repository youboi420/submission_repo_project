# Network analyzer - by yair elad © 2024

- the project is to create a helpful tool to automate and shorten the investigation of a network 
PCAP file record. that includes general info, tcp exceptions, DDOS detections, MITM detection, and more.

## Run the system
clone the repository and then follow these step's
- for windows user's please use this tool using [wsl](https://learn.microsoft.com/en-us/windows/wsl/install) because it uses some linux lib's. or consider using [ubuntu](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview) normally
## installation
- inside your ubuntu machine navigate to the repo cloned location the type the following command
```sh
cd submission_repo_project
bash autoinstall.sh
```
after the installment procedure is finished, you need to manually set the mysql connection. (only because it's local) then. it's all done and you can run the system
- for setting up MySQL if you didn't do so according to the book
```sh
# setting up the user for local db connection to the system
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
CREATE SCHEMA project_schm
```
- for setting up an admin user if you didn't do so according to the book (can be done only after the system has been ran and a user was created & requires a system reload.)
```sh
# setting up the first ever admin user
sudo mysql -u root -p
# enter root in the prompt.
USE project_schm;
update users set isadmin = 1 where id = (system-manager-user-id);
exit
```

- starting the system with the following command
```sh
# based on the idea that your in the project's main directory
bash run.sh
```

- stopping the system with the following command
```sh
# based on the idea that your in the project's main directory, preferably in another terminal
bash stop.sh
```