# Installation instructions (Windows & Ubuntu)

## Operating System
We have tested the platform on Windows 10 and Ubuntu 18 but all of the software listed here is available in a large number of other distributions.

## Port Forwarding
Both on Windows and Ubuntu we have to allow traffic to ports 80 for the web user interface, 1880 for the node-red and 7474 for the Neo4J.

## Java
Most of the systems used are built on top of java engines so a Java distribution needs to be installed in the system before anything else. 
1. On **Ubuntu** machines a simple list of commands is enough to install the latest distribution of Java:
   * sudo add-apt-repository ppa:webupd8team/java
   * sudo apt-get update
   * sudo apt-get install -y oracle-java8-installer
   * sudo apt-get update
2. o	On Windows machines we have to download the appropriate installer from https://java.com/en/download and execute it

## Node.js
Before installing Node-Red, a Node.js installation is required. We have installed Node.js version v8.9.3.
1.  On **Ubuntu** machines we have to run the following commands:
   * sudo apt-get update   
   * sudo apt-get upgrade
   * sudo apt-get install node.js -y
   * sudo apt-get install npm -y
2. On **Windows** machines we can download the appropriate installer from https://nodejs.org/en/download and execute it.

## Node-Red
Node-RED is a powerful visual tool for wiring together hardware devices, APIs and web-services, create flows and connect distributed components into a common IoT application [https://nodered.org/].
1. Installing Node-Red: The easiest way to install Node-RED is to use the node package manager, npm, which comes with Node.js [https://nodered.org/docs/getting-started/installation]. Installing as a global module adds the command “node-red” to your system path:
    * For ubuntu: sudo npm install -g --unsafe-perm node-red
    * For Windows execute CMD with administrator rights and execute: •	npm install -g --unsafe-perm node-red
2. Version: We have installed Node-Red v0.17.5 
3. Running: after installing Node-Red as a global npm package, open a terminal and run the “node-red” command. You can then access the Node-RED editor by pointing your browser at: http://localhost:1880
4. After accessing the editor you have to left click on the menu button (three lines on the top right corner), then click on manage palette, switch to the install tab and search for the node-red-contrib-neo4j package and install it. This will add the node required by our flows ensuring the dependency.

## In order to achieve a higher throughput we have followed the clustering approach installing:
   * Version: Neo4j enterprise edition 3.2.3
   * On **Ubuntu** machines we must execute the following commands in order to install Neo4J:
       * wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add –
       * echo 'deb http://debian.neo4j.org/repo stable/' >/tmp/neo4j.list
       * sudo mv /tmp/neo4j.list /etc/apt/sources.list.d
       * sudo apt-get update
       * sudo apt-get install neo4j -y
       *	sudo service neo4j restart
   * On **Windows** we can follow the guide found at https://neo4j.com/docs/operations-manual/current/installation/windows 
   
## HAProxy
In the Neo4j High Availability architecture, the cluster is typically fronted by a load balancer. The implemented cluster comprised of one server node acting as master node and 5 slave virtual machine nodes.
* Running:
      * sudo service haproxy {start|stop|reload|restart|status}
      * config file located in /etx/haproxy
* Version: 1.8
* Operating System: Ubuntu 16.04 LTS
*	www.haproxy.org

## Front-End
We have developed a web front end, useful for end users of our application. It provides a Graphical User Interface
* Based on HTML, Javascript, Vue Javascript framework and other libraries
*	Running: it is deployed on our server (and cloud servers as well) and accessible in:
* In order to run it locally you have to:
     * Copy index.html, functions.js and style.css in the same folder
     * Edit functions.js switching the server address to the IP that runs the node-red service
     * Run the index.html file with any browser (tested on Chrome and Firefox)








