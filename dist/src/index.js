"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_1 = require("./routes/router");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// View engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files setup - ensure the directory exists and handle errors gracefully
const publicPath = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(publicPath, {
    // Don't fail if the directory doesn't exist
    fallthrough: true,
    // Don't show directory listings
    index: false,
}));
// Routes
app.use('/api', router_1.routes);
// 404 handler - must come after routes but before error handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
// Error handling middleware - must be last
app.use((err, req, res) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map