"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// spec/routes/resize.spec.ts
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../src/index"));
const sharp_1 = __importDefault(require("sharp"));
describe('Resize Route', () => {
    // Create a small test image buffer for uploads
    let testImageBuffer;
    beforeAll(async () => {
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
    describe('POST /api/images/resize', () => {
        it('should handle successful image upload and processing', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/images/resize')
                .attach('image', testImageBuffer, {
                filename: 'test.jpg',
                contentType: 'image/jpeg',
            })
                .field('width', '300')
                .field('height', '200')
                .field('format', 'jpg');
            expect(response.status).toBe(200);
            // We're rendering a view, so check for HTML response
            expect(response.type).toMatch(/html/);
        });
        it('should reject upload without required parameters', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/images/resize')
                .attach('image', testImageBuffer, {
                filename: 'test.jpg',
                contentType: 'image/jpeg',
            });
            expect(response.status).toBe(200); // Returns 200 because it renders error view
            expect(response.text).toContain('Missing dimensions');
        });
        it('should handle invalid dimensions', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/images/resize')
                .attach('image', testImageBuffer, {
                filename: 'test.jpg',
                contentType: 'image/jpeg',
            })
                .field('width', '-300')
                .field('height', '200');
            expect(response.status).toBe(200); // Returns 200 because it renders error view
            // Check for the actual error message from Sharp about negative width
            expect(response.text).toContain('Expected positive integer for width');
        });
        it('should handle missing image file', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/images/resize')
                .field('width', '300')
                .field('height', '200');
            expect(response.status).toBe(200); // Returns 200 because it renders error view
            expect(response.text).toContain('No file uploaded');
        });
        // Adding more comprehensive dimension validation tests
        it('should handle zero dimensions', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/images/resize')
                .attach('image', testImageBuffer, {
                filename: 'test.jpg',
                contentType: 'image/jpeg',
            })
                .field('width', '0')
                .field('height', '200');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Expected positive integer');
        });
        it('should handle non-numeric dimensions', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/images/resize')
                .attach('image', testImageBuffer, {
                filename: 'test.jpg',
                contentType: 'image/jpeg',
            })
                .field('width', 'invalid')
                .field('height', '200');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Failed to process image');
        });
    });
    describe('GET /api/images/processed/:imageId', () => {
        it('should handle missing cached image', async () => {
            const response = await (0, supertest_1.default)(index_1.default).get('/api/images/processed/nonexistent.jpg');
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Image not found');
        });
    });
});
//# sourceMappingURL=resizeImage.spec.js.map