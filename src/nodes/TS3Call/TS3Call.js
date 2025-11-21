"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var nodeInit = function (RED) {
    function Ts3Call(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        var ts3Config = RED.nodes.getNode(config.configid);
        // HACK: ts3Config.on("connected") would not work because i dont know how to use typescript
        ts3Config.addListener("connected", function () {
            _this.status({ fill: "green", shape: "dot", text: "Connected" });
        });
        ts3Config.addListener("disconnect", function () {
            _this.status({ fill: "grey", shape: "dot", text: "not conncted" });
        });
        ts3Config.addListener("error", function () {
            _this.status({ fill: "red", shape: "dot", text: "Error" });
        });
        this.on("input", function (msg, send, done) { return __awaiter(_this, void 0, void 0, function () {
            var client, member, args, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ts3Config.getConnection()];
                    case 1:
                        client = _b.sent();
                        member = client[config.selection];
                        if (!(typeof member === "function")) return [3 /*break*/, 6];
                        args = [];
                        if (Array.isArray(msg.payload)) {
                            args = msg.payload;
                        }
                        else {
                            args = [msg.payload];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        _a = msg;
                        return [4 /*yield*/, member.apply(client, args)];
                    case 3:
                        _a.payload = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        this.error("Failed to call " + config.selection + ": " + err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        send(msg);
                        return [3 /*break*/, 7];
                    case 6:
                        this.error("Failed to call " + config.selection + ". Not a function");
                        _b.label = 7;
                    case 7:
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    RED.nodes.registerType("TS3Call", Ts3Call);
};
module.exports = nodeInit;
