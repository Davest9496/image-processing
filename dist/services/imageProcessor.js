"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageProcessor = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const imageProcessor = async (inputPath, outputPath, options) => {
    const { width, height, format } = options;
    try {
        // Debugging: Log the input and output paths
        console.log('inputPath:', inputPath);
        console.log('outputPath:', outputPath);
        // Check if the input file exists
        await fs_1.promises.access(inputPath);
        // Create the output directory if it doesn't exist
        await fs_1.promises.mkdir(path_1.default.dirname(outputPath), { recursive: true });
        // Process the image
        await (0, sharp_1.default)(inputPath)
            .resize(width, height)
            .toFormat(format)
            .toFile(outputPath);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to process image: ${error.message}`);
        }
        else {
            throw new Error('Failed to process image: Unknown error');
        }
    }
};
exports.imageProcessor = imageProcessor;
