"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageProcessor_1 = require("../../src/services/imageProcessor");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const resizeImage_1 = require("../../src/routes/api/resizeImage");
const supertest_1 = __importDefault(require("supertest"));
require("jasmine");
const assert_1 = require("assert");
describe('Image Processing System', () => {
    // Define paths using project structure
    const testInputDir = path_1.default.join(__dirname, '../../src/images/full');
    const testOutputDir = path_1.default.join(__dirname, '../../src/images/thumb');
    const testImagePath = path_1.default.join(testInputDir, 'fjord.jpg');
    let app;
    beforeAll(async () => {
        // Set up Express app for route testing
        app = (0, express_1.default)();
        app.use('/api/images', resizeImage_1.resize);
        // Create directories if they don't exist
        await fs_1.promises.mkdir(testInputDir, { recursive: true });
        await fs_1.promises.mkdir(testOutputDir, { recursive: true });
    });
    beforeEach(async () => {
        // Clean thumb directory before each test
        try {
            const files = await fs_1.promises.readdir(testOutputDir);
            for (const file of files) {
                await fs_1.promises.unlink(path_1.default.join(testOutputDir, file));
            }
        }
        catch {
            // Ignore if directory doesn't exist
        }
    });
    describe('imageProcessor', () => {
        it('should successfully process an existing image', async () => {
            const options = {
                width: 300,
                height: 300,
                format: 'jpg',
            };
            const outputPath = path_1.default.join(testOutputDir, 'fjord-300x300.jpg');
            await (0, imageProcessor_1.imageProcessor)(testImagePath, outputPath, options);
            // Verify output exists
            const fileExists = await fs_1.promises
                .access(outputPath)
                .then(() => true)
                .catch(() => false);
            expect(fileExists).toBe(true);
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
                (0, assert_1.fail)('Expected an error to be thrown');
            }
            catch (error) {
                if (error instanceof Error) {
                    expect(error.message).toBe('File not found: Could not upload image');
                }
                else {
                    (0, assert_1.fail)('Expected an Error to be thrown');
                }
            }
        });
        describe('Upload Route', () => {
            it('should successfully upload and process an image', (done) => {
                (0, supertest_1.default)(app)
                    .post('/upload')
                    .attach('image', testImagePath)
                    .field('width', '300')
                    .field('height', '300')
                    .field('format', 'jpg')
                    .expect(200)
                    .end((err, res) => {
                    if (err)
                        return done();
                    expect(res.header['content-type']).toMatch(/image/);
                    done();
                });
            });
            it('should reject upload without required parameters', (done) => {
                (0, supertest_1.default)(app)
                    .post('/upload')
                    .attach('image', testImagePath)
                    .expect(400)
                    .end((err, res) => {
                    if (err)
                        return done();
                    expect(res.body.error).toBe('Missing required parameters');
                    expect(res.body.required).toContain('width');
                    expect(res.body.required).toContain('height');
                    done();
                });
            });
            it('should handle invalid dimensions', (done) => {
                (0, supertest_1.default)(app)
                    .post('/upload')
                    .attach('image', testImagePath)
                    .field('width', '-300')
                    .field('height', '300')
                    .field('format', 'jpg')
                    .expect(400)
                    .end((err, res) => {
                    if (err)
                        return done();
                    expect(res.body.error).toBe('Invalid width or height');
                    done();
                });
            });
            it('should handle missing image file', (done) => {
                (0, supertest_1.default)(app)
                    .post('/upload')
                    .field('width', '300')
                    .field('height', '300')
                    .field('format', 'jpg')
                    .expect(400)
                    .end((err, res) => {
                    if (err)
                        return done();
                    expect(res.body.error).toBe('File not uploaded');
                    done();
                });
            });
        });
    });
});
