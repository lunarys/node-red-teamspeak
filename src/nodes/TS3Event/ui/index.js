"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
RED.nodes.registerType("TS3Event", {
    category: "function",
    color: "#a6bbcf",
    defaults: {
        name: { value: "" },
        configid: { type: "TS3Config", value: "" },
        selection: { value: "" }
    },
    inputs: 0,
    outputs: 1,
    label: function () {
        return this.name || "TS3 " + this.selection;
    }
});
