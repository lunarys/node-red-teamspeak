import { TeamSpeak, QueryProtocol } from "ts3-nodejs-library";
import { NodeAPI, Node, NodeDef, NodeInitializer } from 'node-red';

interface Ts3ConfigConfig extends NodeDef {
  host: string;
  nickname: string;
  name: string;
}

interface Ts3ConfigNodeInstance extends Node {
  credentials: {
    username: string;
    password: string;
  };
  getConnection: () => Promise<TeamSpeak>;
}

class ConnectionManager {
  private client: TeamSpeak | null = null;
  private connectPromise: Promise<TeamSpeak> | null = null;
  private shouldDisconnect = false;

  constructor(
    private node: Ts3ConfigNodeInstance,
    private config: Ts3ConfigConfig
  ) {}

  async getConnection(): Promise<TeamSpeak> {
    if (this.client) {
      return this.client;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    try {
      this.connectPromise = TeamSpeak.connect({
        host: this.config.host,
        protocol: QueryProtocol.RAW,
        queryport: 10011,
        serverport: 9987,
        username: this.node.credentials.username,
        password: this.node.credentials.password,
        nickname: this.config.nickname
      });

      this.client = await this.connectPromise;

      if (this.client === null) {
        throw new Error("Failed to connect to Teamspeak");
      }

      this.client.on("error", (err: Error) => {
        this.node.error(`TeamSpeak client error: ${err.message}`);
        this.node.emit("error", err.message);
      });

      this.client.on("close", async () => {
        if (!this.shouldDisconnect) {
          if (this.client !== null) {
            await this.client.reconnect(-1, 1000);
          } else {
            this.node.emit("error", "Connection lost");
          }
        } else {
          this.node.emit("disconnect");
        }
      });

      this.node.emit("connected");
      return this.client;
    } catch (err) {
      this.connectPromise = null;
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.node.error(`Connection failed: ${errorMsg}`);
      this.node.emit("error", errorMsg);
      throw err;
    }
  }

  async close(): Promise<void> {
    this.shouldDisconnect = true;
    await this.client?.quit();
  }
}

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
