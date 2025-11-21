import { TeamSpeak, QueryProtocol } from "ts3-nodejs-library";
import { Ts3ConfigNodeInstance, Ts3ConfigConfig } from "./types";

export class ConnectionManager {
  private client: TeamSpeak | null = null;
  private connectPromise: Promise<TeamSpeak> | null = null;
  private shouldDisconnect = false;
  private readonly reconnectDelay = 5000;

  constructor(
    private node: Ts3ConfigNodeInstance,
    private config: Ts3ConfigConfig
  ) { }

  private async handleReconnect(): Promise<TeamSpeak> {
    this.node.log(`Connection closed. Reconnecting with ${this.reconnectDelay}ms delay...`);

    if (this.client) {
      return this.client.reconnect(-1, this.reconnectDelay)
    } else {
      throw Error("Client is null during reconnect attempt.");
    }
  }

  async getConnection(): Promise<TeamSpeak> {
    if (this.client) {
      return this.client;
    }

    if (this.connectPromise == null) {
      this.connectPromise = this.getConnectionWithRetry();
    }

    return this.connectPromise;
  }

  private async getConnectionWithRetry(): Promise<TeamSpeak> {
    while (!this.shouldDisconnect && this.client == null) {
      try {
        let client = await TeamSpeak.connect({
          host: this.config.host,
          protocol: QueryProtocol.RAW,
          queryport: 10011,
          serverport: 9987,
          username: this.node.credentials.username,
          password: this.node.credentials.password,
          nickname: this.config.nickname
        });

        if (client === null) {
          throw new Error("Failed to connect to Teamspeak");
        }

        client.on("error", (err: Error) => {
          this.node.error(`TeamSpeak client error: ${err.message}`);
          this.node.emit("error", err.message);
        });

        client.on("close", async () => {
          if (!this.shouldDisconnect) {
            this.node.emit("error", "Connection lost");
            this.handleReconnect()
              .then(() => {
                this.node.log("Reconnected successfully");
                this.node.emit("connected");
              })
              .catch((err) => { this.node.error(`Reconnect failed: ${err.message}`); });
          } else {
            this.node.emit("disconnect");
          }
        });

        this.node.log("TeamSpeak client is connected");
        this.node.emit("connected");

        this.client = client;
        return client;

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        this.node.error(`Connection failed: '${errorMsg}'... Retrying in ${this.reconnectDelay}ms`);
        this.node.emit("error", errorMsg);

        await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
      }
    }

    return Promise.reject(new Error("Failed to establish connection"));
  }

  async close(): Promise<void> {
    this.shouldDisconnect = true;
    await this.client?.quit();
  }
}
