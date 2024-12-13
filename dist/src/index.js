"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const logger_1 = require("./utilities/logger");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// set view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// middleware for form data
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.logger);
// import and use routes
app.use('/api', router_1.routes);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
