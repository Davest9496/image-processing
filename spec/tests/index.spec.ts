import request from 'supertest';
import express, { Application } from 'express';
import { routes } from '../../src/routes/router';
import { logger } from '../../src/utilities/logger';

describe('Express server', () => {
  let app: Application;

  // Set up a server instance before each test
  beforeEach(() => {
    app = express();
    app.use(logger);
    app.use('/api', routes);
  });

  // API endpoint/Routes is working
  describe('API Endpoints', () => {
    it('should respond to /api and return 200', async () => {
      const response: request.Response = await request(app)
        .get('/api')
        .expect('Content-Type', /text\/html/)
        .expect(200);

      expect(response.text).toBe('Hello, TypeScript from Routes!');
    });

    it('should return 400 if query parameters are missing', async () => {
      const response: request.Response = await request(app)
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



