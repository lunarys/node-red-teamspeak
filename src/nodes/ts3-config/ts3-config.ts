import { ConnectionManager } from "./connection";
import { NodeAPI, NodeInitializer } from 'node-red';
import { Ts3ConfigNodeInstance, Ts3ConfigConfig } from "./types";

const nodeInit: NodeInitializer = (RED: NodeAPI) => {
  function TS3Config(this: Ts3ConfigNodeInstance, config: Ts3ConfigConfig) {
    RED.nodes.createNode(this, config);
    this.name = config.name;

    const connectionManager = new ConnectionManager(this, config);

    // to be called by other nodes
    this.getConnection = () => connectionManager.getConnection();

    this.on("close", async () => {
      await connectionManager.close();
    });
  }

  RED.nodes.registerType("ts3-config", TS3Config, {
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    }
  });
};

module.exports = nodeInit;
