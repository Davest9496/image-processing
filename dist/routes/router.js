"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
// Collects all routes and exports them to index file
const express_1 = require("express");
const resizeImage_1 = __importDefault(require("./api/resizeImage"));
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.get('/', (req, res) => {
    res.send('Hello, TypeScript from Routes!');
});
routes.use('/images', resizeImage_1.default);
