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
exports.paths = exports.installDriver = void 0;
var Fs = require("fs");
var _ = require("lodash");
var util_1 = require("util");
var url_1 = require("url");
var got_1 = require("got");
var path_1 = require("path");
var stream_1 = require("stream");
var extract = require("extract-zip");
var browser_1 = require("./browser");
var os_1 = require("./os");
var cdnUrl = process.env.EDGEDRIVER_CDNURL || 'https://msedgedriver.azureedge.net';
var mainDir = path_1.resolve(__dirname, '..');
var outFile = 'msedgedriver.zip';
var driverFolder = 'bin';
var edgePathFile = 'paths.json';
var pipelineAsync = util_1.promisify(stream_1.pipeline);
var isStringHasValue = function (value) {
    return _.isString(value) && value.length > 0;
};
var getBrowser = function (edgeBinaryPath, edgeDriverVersion) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!os_1.isSupportedPlatform()) return [3 /*break*/, 4];
                if (!(edgeBinaryPath &&
                    edgeDriverVersion &&
                    isStringHasValue(edgeBinaryPath) &&
                    isStringHasValue(edgeDriverVersion))) return [3 /*break*/, 1];
                return [2 /*return*/, { path: edgeBinaryPath, version: edgeDriverVersion }];
            case 1: return [4 /*yield*/, browser_1.getBrowserData(edgeBinaryPath)];
            case 2:
                data = _a.sent();
                if (data) {
                    if (data.version) {
                        process.stdout.write("Microsoft Edge installed. Version: " + data.version + "\n");
                    }
                    else {
                        process.stdout.write("Microsoft Edge installed. Version is not recognized, using LATEST\n");
                        data.version = 'LATEST';
                    }
                    // override driver version if it is provided
                    if (edgeDriverVersion && isStringHasValue(edgeDriverVersion)) {
                        process.stdout.write("Custom driver version defined: " + edgeDriverVersion + "\n");
                        data.version = edgeDriverVersion;
                    }
                    return [2 /*return*/, data];
                }
                else {
                    // failed to fetch binary data
                    process.stdout.write("Using defaults: edgeBinaryPath=" + edgeBinaryPath + " & edgeDriverVersion=" + edgeDriverVersion + "\n");
                    return [2 /*return*/, {
                            path: typeof edgeBinaryPath !== 'undefined' ? edgeBinaryPath : '',
                            version: typeof edgeDriverVersion !== 'undefined' ? edgeDriverVersion : 'LATEST',
                        }];
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                process.stdout.write("MS does not provide driver for " + os_1.getOS() + " platform\n");
                process.exit(1);
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var downloadDriver = function (version) { return __awaiter(void 0, void 0, void 0, function () {
    var useExactEdgeDriverVersion, versionMatcher, response, downloadUrl, tempDownloadedFile, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                useExactEdgeDriverVersion = process.env.npm_config_use_exact_edgedriver_version || process.env.USE_EXACT_EDGE_DRIVER_VERSION;
                if (!!useExactEdgeDriverVersion) return [3 /*break*/, 2];
                versionMatcher = version === 'LATEST' ? 'LATEST_STABLE' : "LATEST_RELEASE_" + version.split('.')[0];
                return [4 /*yield*/, got_1.default.get(cdnUrl + "/" + versionMatcher)];
            case 1:
                response = _a.sent();
                version = response.body.replace(/[^\d.]/g, '');
                _a.label = 2;
            case 2:
                process.stdout.write("Downloading MS Edge Driver " + version + "...\n");
                downloadUrl = cdnUrl + "/" + version + "/edgedriver_" + os_1.getOS() + ".zip";
                tempDownloadedFile = path_1.resolve(mainDir, outFile);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, pipelineAsync(got_1.default.stream(new url_1.URL(downloadUrl)), Fs.createWriteStream(tempDownloadedFile))];
            case 4:
                _a.sent();
                return [2 /*return*/, true];
            case 5:
                err_1 = _a.sent();
                process.stdout.write(err_1 + ": " + downloadUrl + "\n");
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    });
}); };
var getBinary = function (downloaded) { return __awaiter(void 0, void 0, void 0, function () {
    var downloadedFile, extractPath, extracted, fileName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!downloaded) {
                    process.stdout.write("Driver was not downloaded\n");
                    process.exit(1);
                }
                process.stdout.write('Extracting driver binary... \n');
                downloadedFile = path_1.resolve(mainDir, outFile);
                extractPath = path_1.resolve(mainDir, driverFolder);
                Fs.mkdirSync(extractPath, { recursive: true });
                return [4 /*yield*/, extract(path_1.resolve(downloadedFile), { dir: extractPath })];
            case 1:
                _a.sent();
                process.stdout.write('Done. \n');
                // delete zip file
                Fs.unlinkSync(downloadedFile);
                extracted = Fs.readdirSync(extractPath);
                fileName = extracted.filter(function (name) { return name.toLowerCase().includes('msedgedriver'); })[0];
                return [2 /*return*/, path_1.resolve(extractPath, fileName)];
        }
    });
}); };
var findDriverInPath = function () {
    var driverPath = path_1.resolve(mainDir, driverFolder, os_1.isWin() ? 'msedgedriver.exe' : 'msedgedriver');
    return Fs.existsSync(driverPath) ? driverPath : null;
};
exports.installDriver = function () { return __awaiter(void 0, void 0, void 0, function () {
    var edgeBinaryPath, edgeDriverPath, edgeDriverVersion, forceDownload, binaryData, driverPath, isDowloaded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                edgeBinaryPath = process.env.npm_config_edge_binary_path || process.env.EDGE_BINARY_PATH;
                edgeDriverPath = process.env.npm_config_edgedriver_path || process.env.EDGEDRIVER_PATH;
                if (!(edgeBinaryPath && edgeDriverPath && isStringHasValue(edgeBinaryPath) && isStringHasValue(edgeDriverPath))) return [3 /*break*/, 1];
                return [2 /*return*/, { browserPath: edgeBinaryPath, driverPath: edgeDriverPath }];
            case 1:
                edgeDriverVersion = process.env.npm_config_edgedriver_version || process.env.EDGEDRIVER_VERSION;
                forceDownload = process.env.npm_config_edgedriver_force_download || process.env.EDGEDRIVER_FORCE_DOWNLOAD;
                return [4 /*yield*/, getBrowser(edgeBinaryPath, edgeDriverVersion)];
            case 2:
                binaryData = _a.sent();
                if (!binaryData) return [3 /*break*/, 6];
                driverPath = findDriverInPath();
                if (!(forceDownload || !driverPath)) return [3 /*break*/, 5];
                return [4 /*yield*/, downloadDriver(binaryData.version)];
            case 3:
                isDowloaded = _a.sent();
                return [4 /*yield*/, getBinary(isDowloaded)];
            case 4:
                driverPath = _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, { browserPath: binaryData.path, driverPath: driverPath }];
            case 6:
                process.stdout.write("Error getting browser data");
                process.exit(1);
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.paths = function () {
    if (Fs.existsSync(edgePathFile)) {
        var rawdata = Fs.readFileSync(edgePathFile);
        return JSON.parse(rawdata.toString());
    }
    else {
        var edgeBinaryPath = process.env.npm_config_edge_binary_path || process.env.EDGE_BINARY_PATH;
        var edgeDriverPath = process.env.npm_config_edgedriver_path || process.env.EDGEDRIVER_PATH;
        return { browserPath: edgeBinaryPath, driverPath: edgeDriverPath };
    }
};