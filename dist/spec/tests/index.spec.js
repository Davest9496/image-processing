"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const router_1 = require("../../src/routes/router");
const logger_1 = require("../../src/utilities/logger");
describe('Express server', () => {
    let app;
    // Set up a server instance before each test
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(logger_1.logger);
        app.use('/api', router_1.routes);
    });
    // API endpoint/Routes is working
    describe('API Endpoints', () => {
        it('should respond to /api and return 200', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api')
                .expect('Content-Type', /text\/html/)
                .expect(200);
            expect(response.text).toBe('Hello, TypeScript from Routes!');
        });
        it('should return 400 if query parameters are missing', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/images')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toEqual({
                error: 'Missing required query parameters',
                required: ['width', 'height', 'filename'],
            });
        });
    });
});
