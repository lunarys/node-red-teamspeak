import { NodeAPI, Node, NodeDef, NodeInitializer } from 'node-red';

interface Ts3EventConfig extends NodeDef {
  configid: string;
  selection: string;
}

const nodeInit: NodeInitializer = (RED: NodeAPI) => {
  function Ts3Event(this: Node, config: Ts3EventConfig) {
    RED.nodes.createNode(this, config);

    const ts3Config = RED.nodes.getNode(config.configid) as any;

    // Status listeners for connection state
    ts3Config.addListener("connected", () => {
      this.status({ fill: "green", shape: "dot", text: "Connected" });
    });

    ts3Config.addListener("disconnect", () => {
      this.status({ fill: "grey", shape: "dot", text: "not connected" });
    });

    ts3Config.addListener("error", () => {
      this.status({ fill: "red", shape: "dot", text: "Error" });
    });

    (async () => {
      const client = await ts3Config.getConnection();

      client.addListener(config.selection, (event: any) => {
        const msg = {
          payload: event,
        };
        this.send(msg);
      });
    })();
  }

  RED.nodes.registerType("ts3-event", Ts3Event);
};

module.exports = nodeInit;
