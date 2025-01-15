"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const resizeImage_1 = require("./api/resizeImage");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.get('/', (_req, res) => {
    res.render('index');
});
routes.use('/images', resizeImage_1.resize);
//# sourceMappingURL=router.js.map