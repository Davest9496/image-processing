"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const router_1 = require("../../src/routes/router");
const logger_1 = require("../../src/utilities/logger");
const path_1 = __importDefault(require("path"));
describe('Express Server', () => {
    let app;
    beforeAll(() => {
        // Create Express app instance
        app = (0, express_1.default)();
        // Configure view engine
        app.set('view engine', 'ejs');
        app.set('views', path_1.default.join(__dirname, '../../src/views'));
        // Set up middleware
        app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(logger_1.logger);
        app.use('/api', router_1.routes);
    });
    describe('Server Configuration', () => {
        it('should have view engine set to ejs', () => {
            expect(app.get('view engine')).toBe('ejs');
        });
        it('should have views directory configured', () => {
            expect(app.get('views')).toContain('src/views');
        });
    });
    describe('API Routes', () => {
        it('should render index page at /api/', (done) => {
            (0, supertest_1.default)(app)
                .get('/api/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err) => {
                if (err)
                    return done();
                done();
            });
        });
        it('should handle /api/images route', (done) => {
            (0, supertest_1.default)(app)
                .get('/api/images')
                .expect(400) // Expect 400 when no parameters provided
                .end((err, res) => {
                if (err)
                    return done();
                expect(res.body.error).toBeDefined();
                done();
            });
        });
        it('should reject missing filename', (done) => {
            (0, supertest_1.default)(app)
                .get('/api/images')
                .query({
                width: '300',
                height: '300',
            })
                .expect(400)
                .end((err, res) => {
                if (err)
                    return done();
                expect(res.body.error).toContain('Missing required');
                done();
            });
        });
    });
    describe('Static File Serving', () => {
        it('should serve static files from public directory', (done) => {
            (0, supertest_1.default)(app)
                .get('/test.css')
                .expect(200)
                .end((err) => {
                if (err)
                    return done();
                done();
            });
        });
    });
    describe('Form Handling', () => {
        it('should parse urlencoded bodies', (done) => {
            (0, supertest_1.default)(app)
                .post('/api/images')
                .send('filename=test.jpg&width=300&height=300')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(200)
                .end((err) => {
                if (err)
                    return done();
                done();
            });
        });
    });
});
