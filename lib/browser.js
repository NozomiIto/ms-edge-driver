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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowserData = void 0;
var child_process_1 = require("child_process");
var util_1 = require("util");
var path_1 = require("path");
var os_1 = require("./os");
var execAsync = util_1.promisify(child_process_1.exec);
var DEFAULT_EDGE_BINARY_PATH = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
var DEFAULT_EDGE_HKEY = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\Clients\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}';
var getRegistryKey = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var regedit = require('regedit');
                regedit.list(key, function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve(result[key]);
                    }
                });
            })];
    });
}); };
var getBrowserBinaryOnWin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, edgeBinaryHKey, key, path, version, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = 'msedge.exe';
                edgeBinaryHKey = process.env.EDGE_HKEY || DEFAULT_EDGE_HKEY;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getRegistryKey(edgeBinaryHKey)];
            case 2:
                key = _a.sent();
                path = key.values.location.value;
                version = key.values.pv.value;
                return [2 /*return*/, { path: path_1.join(path, fileName), version: version }];
            case 3:
                err_1 = _a.sent();
                process.stdout.write("MS Edge browser is not found in registry: " + err_1.stderr + " \n");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getBrowserBinaryOnMac = function (edgeBinaryPath) { return __awaiter(void 0, void 0, void 0, function () {
    var binaryPath, stdout, found, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                binaryPath = typeof edgeBinaryPath === 'string' && edgeBinaryPath.length > 0 ? edgeBinaryPath : DEFAULT_EDGE_BINARY_PATH;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, execAsync("\"" + binaryPath + "\" --version")];
            case 2:
                stdout = (_a.sent()).stdout;
                found = stdout.toString().match(/\d{1,}.\d{1,}.\d{1,}.\d{1,}/g);
                if (found) {
                    return [2 /*return*/, { path: binaryPath, version: found[0] }];
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                process.stdout.write("MS Edge browser is not found in Applications: " + err_2.stderr + " \n");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getBrowserData = function (edgeBinaryPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (os_1.isWin() ? getBrowserBinaryOnWin() : getBrowserBinaryOnMac(edgeBinaryPath))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };