"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageProcessor = void 0;
const sharp_1 = __importDefault(require("sharp"));
const imageProcessor = async (inputBuffer, options) => {
    const { width, height, format } = options;
    try {
        return await (0, sharp_1.default)(inputBuffer)
            .resize(width, height)
            .toFormat(format)
            .toBuffer();
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
//# sourceMappingURL=imageProcessor.js.map