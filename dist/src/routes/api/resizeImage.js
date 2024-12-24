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
const path_1 = __importDefault(require("path"));
const cache_1 = require("../../utilities/cache");
const fs_1 = require("fs");
const resize = (0, express_1.Router)();
exports.resize = resize;
// Define upload path at the top level
const uploadPath = path_1.default.join(__dirname, '../../images/full');
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        // Only accept these image file format
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
            cb(null, false);
            return;
        }
        cb(null, true);
    },
});
// Route handler for image upload and processing
resize.post('/resize', upload.single('image'), logger_1.logger, async (req, res) => {
    try {
        const file = req.file;
        console.log('Uploaded file details:', file);
        if (!file) {
            res.status(400).json({
                error: 'File not uploaded',
            });
            return;
        }
        const { width, height, format = 'jpg', } = req.body;
        // Use original filename for user-friendly naming
        const originalFilename = path_1.default.parse(file.originalname).name;
        console.log('Processing request:', {
            originalFilename,
            width,
            height,
            format,
            inputPath: file.path,
        });
        // Check if parameters are provided
        if (!width || !height) {
            console.error('Missing required parameters:', { width, height });
            res.status(400).json({
                error: 'Missing required parameters',
                required: ['width', 'height'],
            });
            return;
        }
        // Configure input and output paths
        const inputPath = file.path;
        const outputPath = path_1.default.join(__dirname, '../../../src/images/thumb', `${originalFilename}-${width}x${height}.${format}`);
        const resizeOptions = {
            width: Number(width),
            height: Number(height),
            format: format,
        };
        await (0, imageProcessor_1.imageProcessor)(inputPath, outputPath, resizeOptions);
        // Store the image in cache
        const cacheKey = `${originalFilename}-${width}x${height}.${format}`;
        cache_1.cache.set(cacheKey, outputPath);
        //-- Debugging: Log the cache key--//
        console.log('Image stored in cache:', cacheKey);
        res.sendFile(outputPath);
        // Clean up uploaded file after processing
        fs_1.promises.unlink(inputPath).catch((err) => console.error('Error cleaning up uploaded file:', err));
    }
    catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({
            error: 'Failed to process image',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
