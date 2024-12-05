"use strict";
// Logger implementation
// This middleware logs the method and URL of the request to the console
// before passing the request to the next middleware.
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (req, res, next) => {
    console.log(`A ${req.method} request was made to ${req.url}`);
    next(); // Call the next middleware
};
exports.logger = logger;
