"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
RED.nodes.registerType("TS3Call", {
    category: "function",
    color: "#a6bbcf",
    defaults: {
        name: { value: "" },
        configid: { type: "TS3Config", value: "" },
        selection: { value: "version" }
    },
    inputs: 1,
    outputs: 1,
    label: function () {
        return this.name || "TS3 " + this.selection;
    }
});
