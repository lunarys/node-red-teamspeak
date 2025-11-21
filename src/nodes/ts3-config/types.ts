import { TeamSpeak } from "ts3-nodejs-library";
import { Node, NodeDef } from 'node-red';

export interface Ts3ConfigConfig extends NodeDef {
  host: string;
  nickname: string;
  name: string;
}

export interface Ts3ConfigNodeInstance extends Node {
  credentials: {
    username: string;
    password: string;
  };
  getConnection: () => Promise<TeamSpeak>;
}
