import { NodeAPI, Node, NodeDef, NodeInitializer } from 'node-red';
import { TeamSpeak } from "ts3-nodejs-library";

interface Ts3CallConfig extends NodeDef {
  configid: string;
  selection: string;
}

const nodeInit: NodeInitializer = (RED: NodeAPI) => {
  function Ts3Call(this: Node, config: Ts3CallConfig) {
    RED.nodes.createNode(this, config);

    const ts3Config = RED.nodes.getNode(config.configid) as any;

    // Status listeners for connection state
    ts3Config.addListener("connected", () => {
      this.status({ fill: "green", shape: "dot", text: "Connected" });
    });

    ts3Config.addListener("disconnect", () => {
      this.status({ fill: "grey", shape: "dot", text: "not connected" });
    });

    ts3Config.addListener("error", (errorMsg?: string) => {
      const text = errorMsg ? `Error: ${errorMsg}` : "Error";
      this.status({ fill: "red", shape: "dot", text });
    });

    this.on("input", async (msg: any, send: (msg: any) => void, done: (err?: Error) => void) => {
      try {
        const client = await ts3Config.getConnection();

        const member = client[config.selection];

        if (typeof member === "function") {
          let args: any[] = [];

          if (Array.isArray(msg.payload)) {
            args = msg.payload;
          } else {
            args = [msg.payload];
          }

          try {
            const result = await member.apply(client, args);
            msg.payload = JSON.parse(JSON.stringify(result));  // the library returns class instances, they behave badly/weirdly in Node-RED
          } catch (err) {
            this.error(`Failed to call ${config.selection}: ${err}`);
          }

          send(msg);
        } else {
          this.error(`Failed to call ${config.selection}. Not a function`);
        }
      } finally {
        done();
      }
    });
  }

  RED.nodes.registerType("ts3-call", Ts3Call);
};

module.exports = nodeInit;
