"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageProcessor_1 = require("../../src/services/imageProcessor");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const assert_1 = require("assert");
describe('Image Processor', () => {
    const testInputDir = path_1.default.join(__dirname, '../../src/images/full');
    const testOutputDir = path_1.default.join(__dirname, '../../src/images/thumb');
    const testImagePath = path_1.default.join(testInputDir, 'fjord.jpg'); // Use an existing image
    // Clean up test output before each test
    beforeEach(async () => {
        try {
            await fs_1.promises.rm(testOutputDir, { recursive: true, force: true });
        }
        catch {
            // Ignore if directory doesn't exist
        }
    });
    it('should successfully process an existing image', async () => {
        // Test setup
        const options = {
            width: 300,
            height: 300,
            format: 'jpg',
        };
        const outputPath = path_1.default.join(testOutputDir, 'fjord_300x300.jpg');
        // Execute test
        await (0, imageProcessor_1.imageProcessor)(testImagePath, outputPath, options);
        // Verify output exists
        const outputExists = await fs_1.promises
            .access(outputPath)
            .then(() => true)
            .catch(() => false);
        expect(outputExists).toBe(true);
    });
    it('should throw error for non-existent input file', async () => {
        const options = {
            width: 300,
            height: 300,
            format: 'jpg',
        };
        const nonExistentPath = path_1.default.join(testInputDir, 'nonexistent.jpg');
        const outputPath = path_1.default.join(testOutputDir, 'output.jpg');
        try {
            await (0, imageProcessor_1.imageProcessor)(nonExistentPath, outputPath, options);
            (0, assert_1.fail)('Expected error was not thrown');
        }
        catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe('File not found: Please ensure filename is correctly typed and in the "full" folder');
            }
            else {
                (0, assert_1.fail)('Unexpected error type');
            }
        }
    });
});
