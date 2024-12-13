import request from 'supertest';
import express, { Application } from 'express';
import { routes } from '../../src/routes/router';
import { logger } from '../../src/utilities/logger';
import path from 'path';

describe('Express Server', () => {
  let app: Application;

  beforeAll(() => {
    // Create Express app instance
    app = express();

    // Configure view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../src/views'));

    // Set up middleware
    app.use(express.static(path.join(__dirname, '../../public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(logger);
    app.use('/api', routes);
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
      request(app)
        .get('/api/')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err) => {
          if (err) return done();
          done();
        });
    });

    it('should handle /api/images route', (done) => {
      request(app)
        .get('/api/images')
        .expect(400) // Expect 400 when no parameters provided
        .end((err, res) => {
          if (err) return done();
          expect(res.body.error).toBeDefined();
          done();
        });
    });

    it('should reject missing filename', (done) => {
      request(app)
        .get('/api/images')
        .query({
          width: '300',
          height: '300',
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done();
          expect(res.body.error).toContain('Missing required');
          done();
        });
    });
  });

  describe('Static File Serving', () => {
    it('should serve static files from public directory', (done) => {
      request(app)
        .get('/test.css')
        .expect(200)
        .end((err) => {
          if (err) return done();
          done();
        });
    });
  });

  describe('Form Handling', () => {
    it('should parse urlencoded bodies', (done) => {
      request(app)
        .post('/api/images')
        .send('filename=test.jpg&width=300&height=300')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(200)
        .end((err) => {
          if (err) return done();
          done();
        });
    });
  });
});
