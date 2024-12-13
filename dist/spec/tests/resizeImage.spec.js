"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const router_1 = require("../../src/routes/router");
const logger_1 = require("../../src/utilities/logger");
describe('Image Resizing API', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(logger_1.logger);
        app.use('/api', router_1.routes);
    });
    it('should handle image resizing with valid parameters', (done) => {
        (0, supertest_1.default)(app)
            .get('/api/images')
            .query({
            filename: 'fjord.jpg',
            width: '300',
            height: '300',
        })
            .expect(200)
            .end((err) => {
            if (err)
                return done();
            done();
        });
    });
    it('should reject invalid dimensions', (done) => {
        (0, supertest_1.default)(app)
            .get('/api/images')
            .query({
            filename: 'fjord.jpg',
            width: '-300',
            height: '300',
        })
            .expect(400)
            .end((err, res) => {
            if (err)
                return done();
            expect(res.body.error).toBe('Invalid width or height');
            done();
        });
    });
});
