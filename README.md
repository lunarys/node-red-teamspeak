Node-RED nodes to interact with Teamspeaks query. Basicly it is a wrapper for [TS3-NodeJS-Library](https://github.com/multivit4min/TS3-NodeJS-Library). 
It includes 3 nodes:
- TS3 config (stores connection information)
- TS3 call (Call any function on the query)
- TS3 event (Listen to any ts3 event)

To pass parameters to the "call" node simply put it as the `msg.payload` as an array. You can lookup the functions at the TS3-NodeJS-Library [documentation](https://multivit4min.github.io/TS3-NodeJS-Library/classes/teamspeak.teamspeak-2.html). 

# Install
`npm i node-red-contrib-teamspeak --save` or via the Node-RED ui.
