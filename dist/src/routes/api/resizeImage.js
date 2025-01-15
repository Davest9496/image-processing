"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resize = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const logger_1 = require("../../utilities/logger");
const imageProcessor_1 = require("../../services/imageProcessor");
const cache_1 = require("../../utilities/cache");
const resize = (0, express_1.Router)();
exports.resize = resize;
// Use memory storage instead of disk storage for Vercel
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
            cb(new Error('Invalid file type'));
            return;
        }
        cb(null, true);
    },
});
// Image processing endpoint
resize.post('/resize', upload.single('image'), logger_1.logger, async (req, res) => {
    try {
        const file = req.file;
        console.log('Processing upload:', file?.originalname);
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const { width, height, format = 'jpg', } = req.body;
        if (!width || !height) {
            res.status(400).json({
                error: 'Missing dimensions',
                required: ['width', 'height'],
            });
            return;
        }
        const resizeOptions = {
            width: Number(width),
            height: Number(height),
            format: format,
        };
        const processedImageBuffer = await (0, imageProcessor_1.imageProcessor)(file.buffer, resizeOptions);
        const timestamp = Date.now();
        const cacheKey = `${timestamp}-${width}x${height}.${format}`;
        // Store in cache
        cache_1.cache.set(cacheKey, {
            buffer: processedImageBuffer,
            contentType: `image/${format}`,
            timestamp,
        });
        // Render the result page with the correct API path
        res.render('result', {
            imageId: cacheKey,
            width,
            height,
            format,
            apiBasePath: '/api', // Pass this to the template
        });
    }
    catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({
            error: 'Processing failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Serve processed images
resize.get('/processed/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        console.log('Serving image:', imageId);
        const cachedImage = cache_1.cache.get(imageId);
        if (!cachedImage) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }
        res.set('Content-Type', cachedImage.contentType);
        res.set('Cache-Control', 'public, max-age=3600');
        res.send(cachedImage.buffer);
    }
    catch (error) {
        console.error('Serve error:', error);
        res.status(500).json({
            error: 'Failed to serve image',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
//# sourceMappingURL=resizeImage.js.map