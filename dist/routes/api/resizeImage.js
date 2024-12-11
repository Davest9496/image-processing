"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resize = void 0;
const express_1 = require("express");
const logger_1 = require("../../utilities/logger");
const imageProcessor_1 = require("../../services/imageProcessor");
const path_1 = __importDefault(require("path"));
const cache_1 = require("../../utilities/cache");
const resize = (0, express_1.Router)();
exports.resize = resize;
// Route handler that recieves the query parameters and pass to imageProcessor
resize.get('/', logger_1.logger, async (req, res) => {
    try {
        const { width, height, filename, format = 'jpg', } = req.query;
        // Debugging: Log the query parameters
        console.log('Query params:', req.query);
        // Check if parameters are provided
        if (!width || !height || !filename) {
            console.error('Check - Missing required query parameters:', {
                width,
                height,
                filename,
            });
            res.status(400).json({
                error: 'Missing required query parameters',
                required: ['width', 'height', 'filename'],
            });
            return;
        }
        // Parse as numbers and validate numeric parameters has
        // positive values
        const numWidth = Number(width);
        const numHeight = Number(height);
        if (isNaN(numWidth) ||
            isNaN(numHeight) ||
            numWidth <= 0 ||
            numHeight <= 0) {
            res.status(400).json({
                error: 'Invalid width or height',
                details: 'Width and height must be positive numbers',
            });
            return;
        }
        // Validate file format by checking against allowedFormat array
        const validFormats = ['jpg', 'png', 'webp', 'avif', 'gif'];
        if (!validFormats.includes(format)) {
            //--- Debugging: Log the invalid format ---//
            console.log(format);
            res.status(400).json({
                error: 'Invalid format',
                allowedFormats: validFormats,
            });
            return;
        }
        // Configure input and output paths
        const inputPath = path_1.default.join(__dirname, '../../../src/images/full', `${filename}.jpg`);
        const outputPath = path_1.default.join(__dirname, '../../../src/images/thumb', `${filename}-${numWidth}x${numHeight}.${format}`);
        // Check if the image is already in cache
        const cacheKey = `${filename}-${numWidth}x${numHeight}.${format}`;
        const cachedImage = cache_1.cache.get(cacheKey);
        // If image is found in cache, send the image
        if (cachedImage) {
            //--- Debugging: Log that image is found in cache ---//
            console.log('Image found in cache');
            res.sendFile(cachedImage);
            return;
        }
        const resizeOptions = {
            width: numWidth,
            height: numHeight,
            format: format,
        };
        await (0, imageProcessor_1.imageProcessor)(inputPath, outputPath, resizeOptions);
        // Store the image in cache
        cache_1.cache.set(cacheKey, outputPath);
        res.sendFile(outputPath);
    }
    catch (error) {
        console.error('Application ran into trouble resizing image:', error);
        res.status(500).json({
            error: 'Failed to resize image',
            //--- Debugging: Log the error message | Unknown if not known ---//
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
