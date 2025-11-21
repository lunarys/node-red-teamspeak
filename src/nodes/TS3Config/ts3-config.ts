import { TeamSpeak, QueryProtocol } from "ts3-nodejs-library";

const nodeInit = (RED: any) => {
  function TS3Config(this: any, config: any) {
    RED.nodes.createNode(this, config);

    const host: string = config.host;
    const nickname: string = config.nickname;
    this.name = config.name;

    let client: TeamSpeak | null = null;
    let connectPromise: Promise<TeamSpeak> | null = null;
    let shouldDisconnect = false;

    this.getConnection = async (): Promise<TeamSpeak> => {
      if (client) {
        return client;
      }

      if (connectPromise) {
        return connectPromise;
      }

      try {
        connectPromise = TeamSpeak.connect({
          host,
          protocol: QueryProtocol.RAW,
          queryport: 10011,
          serverport: 9987,
          username: this.credentials.username,
          password: this.credentials.password,
          nickname
        });

        client = await connectPromise;

        if (client === null) {
          throw new Error("Failed to connect to Teamspeak");
        }

        client.on("close", async () => {
          if (!shouldDisconnect) {
            if (client !== null) {
              await client.reconnect(-1, 1000);
            } else {
              this.emit("error");
            }
          } else {
            this.emit("disconnect");
          }
        });

        this.emit("connected");
        return client;
      } catch (err) {
        this.emit("error");
        throw err;
      }
    };

    this.on("close", async () => {
      shouldDisconnect = true;
      await client?.quit();
    });
  }

  RED.nodes.registerType("TS3Config", TS3Config, {
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    }
  });
};

module.exports = nodeInit;
