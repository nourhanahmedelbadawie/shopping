"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var dotenv = __importStar(require("dotenv"));
var error_middleWare_1 = __importDefault(require("./middleWare/error.middleWare"));
var database_1 = __importDefault(require("./database"));
var routes_1 = __importDefault(require("./routes"));
dotenv.config();
var PORT = process.env.PORT || 3000;
// create an instance server
var app = (0, express_1.default)();
// HTTP request logger middleware
app.use((0, morgan_1.default)('short'));
app.use(express_1.default.json()); // for application/json
// add routing for / path
app.get('/', function (req, res) {
    res.json({
        message: 'Hello World 🌍'
    });
});
database_1.default.connect().then(function (client) {
    return client.query('SELECT NOW()').then(function (res) {
        client.release();
        console.log(res.rows);
    });
});
// routes
app.use('/base', routes_1.default);
//Handel Error
app.use(function (_req, res) {
    res.status(404).json({ message: 'Error occure please check you request' });
});
// start express server
app.listen(PORT, function () {
    console.log("Server is starting at prot:".concat(PORT));
});
app.use(error_middleWare_1.default);
exports.default = app;
