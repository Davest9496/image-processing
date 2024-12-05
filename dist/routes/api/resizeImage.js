"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../../utilities/logger");
const imageProcessor_1 = require("../../services/imageProcessor");
const path_1 = __importDefault(require("path"));
const resize = (0, express_1.Router)();
resize.get('/', logger_1.logger, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Parse and validate numeric parameters
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
        // Validate file format
        const validFormats = ['jpg', 'png', 'webp', 'avif', 'gif'];
        if (!validFormats.includes(format)) {
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
        const resizeOptions = {
            width: numWidth,
            height: numHeight,
            format: format,
        };
        yield (0, imageProcessor_1.imageProcessor)(inputPath, outputPath, resizeOptions);
        res.sendFile(outputPath);
    }
    catch (error) {
        console.error('Error resizing image:', error);
        res.status(500).json({
            error: 'Failed to resize image',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
exports.default = resize;
