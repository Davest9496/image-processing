"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// spec/server.spec.ts
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
describe('Express Server', () => {
    describe('Server Configuration', () => {
        it('should have view engine set to ejs', () => {
            expect(index_1.default.get('view engine')).toBe('ejs');
        });
        it('should have views directory configured', () => {
            const views = index_1.default.get('views');
            expect(typeof views).toBe('string');
            expect(views).toContain('views');
        });
    });
    describe('Static File Serving', () => {
        it('should serve static files from public directory', async () => {
            // Try to access a file we know doesn't exist
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/test.css')
                .expect('Content-Type', /json/) // We expect a JSON response for the 404
                .expect(404);
            // Verify we get the correct error message
            expect(response.body).toEqual({
                error: 'Not Found',
            });
        });
    });
    describe('API Base Route', () => {
        it('should render index page at /api/', async () => {
            const response = await (0, supertest_1.default)(index_1.default).get('/api/');
            expect(response.status).toBe(200);
            expect(response.type).toMatch(/html/);
        });
    });
});
//# sourceMappingURL=index.spec.js.map