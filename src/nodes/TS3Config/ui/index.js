"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
RED.nodes.registerType("TS3Config", {
    category: "config",
    color: "#a6bbcf",
    defaults: {
        name: { value: "" },
        host: { value: "" },
        nickname: { value: "ServerQuery" }
    },
    credentials: {
        username: { type: "text" },
        password: { type: "password" }
    },
    label: function () {
        return this.name || "TS3 Config";
    }
});
