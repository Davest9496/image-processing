"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const imageProcessor_1 = require("../../src/services/imageProcessor");
const assert_1 = require("assert");
describe('Image Processing Service', () => {
    let testImageBuffer;
    beforeAll(async () => {
        // Create a simple 100x100 red square image for testing
        testImageBuffer = await (0, sharp_1.default)({
            create: {
                width: 100,
                height: 100,
                channels: 3,
                background: { r: 255, g: 0, b: 0 },
            },
        })
            .jpeg()
            .toBuffer();
    });
    it('should process an image successfully', async () => {
        const options = {
            width: 300,
            height: 300,
            format: 'jpeg',
        };
        const result = await (0, imageProcessor_1.imageProcessor)(testImageBuffer, { ...options, format: options.format });
        const metadata = await (0, sharp_1.default)(result).metadata();
        expect(metadata.width).toBe(300);
        expect(metadata.height).toBe(300);
    });
    it('should handle WebP format conversion', async () => {
        const options = {
            width: 300,
            height: 300,
            format: 'webp',
        };
        const result = await (0, imageProcessor_1.imageProcessor)(testImageBuffer, { ...options, format: options.format });
        const metadata = await (0, sharp_1.default)(result).metadata();
        expect(metadata.format).toBe('webp');
    });
    it('should maintain aspect ratio if only width is specified', async () => {
        const options = {
            width: 300,
            format: 'jpg',
        };
        const result = await (0, imageProcessor_1.imageProcessor)(testImageBuffer, { ...options, format: options.format });
        const originalMetadata = await (0, sharp_1.default)(testImageBuffer).metadata();
        const originalAspectRatio = originalMetadata.width / originalMetadata.height;
        const metadata = await (0, sharp_1.default)(result).metadata();
        if (metadata.width && metadata.height) {
            const newAspectRatio = metadata.width / metadata.height;
            expect(Math.abs(originalAspectRatio - newAspectRatio)).toBeLessThan(0.01);
        }
        else {
            (0, assert_1.fail)('Metadata width or height is undefined');
        }
    });
    it('should handle large size reductions', async () => {
        const options = {
            width: 50,
            height: 50,
            format: 'jpg',
        };
        const result = await (0, imageProcessor_1.imageProcessor)(testImageBuffer, { ...options, format: options.format });
        const metadata = await (0, sharp_1.default)(result).metadata();
        expect(metadata.width).toBe(50);
        expect(metadata.height).toBe(50);
    });
});
//# sourceMappingURL=imageProcessor.spec.js.map