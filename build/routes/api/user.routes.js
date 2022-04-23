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
var express_1 = require("express");
var user_model_1 = __importDefault(require("../../models/user.model"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var routes = (0, express_1.Router)();
routes.get('/', function (req, res) {
    res.json({ message: 'success' });
});
var jwt = require('jsonwebtoken');
var userModel = new user_model_1.default();
// sign up
routes.post('/signup', function (req, res) {
    try {
        console.log(req.body);
        var _a = req.body, email = _a.email, password = _a.password, user_name = _a.user_name, first_name = _a.first_name, last_name = _a.last_name;
        var userData = userModel.signUp({ email: email, password: password, user_name: user_name, first_name: first_name, last_name: last_name });
        var token = jwt.sign({ userData: userData }, process.env.SECRET_TOKEN);
        if (userData)
            return res.json({
                status: 'success',
                data: { user: userData, token: token }
            });
        throw new Error("Error");
    }
    catch (err) {
        console.log(err);
    }
});
// Login
routes.post('/login', function (req, res) {
    try {
        var _a = req.body, email = _a.email, password = _a.password;
        var userData = userModel.loginUser(email, password);
        var token = jwt.sign({ userData: userData }, process.env.SECRET_TOKEN);
        if (userData)
            return res.json({
                status: 'success',
                data: { user: userData, token: token }
            });
        throw new Error("Error  , ".concat(email, "not found "));
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = routes;
