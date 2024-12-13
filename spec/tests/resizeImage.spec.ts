import request from 'supertest';
import express, { Application } from 'express';
import { routes } from '../../src/routes/router';
import { logger } from '../../src/utilities/logger';

describe('Image Resizing API', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(logger);
    app.use('/api', routes);
  });

  it('should handle image resizing with valid parameters', (done) => {
    request(app)
      .get('/api/images')
      .query({
        filename: 'fjord.jpg',
        width: '300',
        height: '300',
      })
      .expect(200)
      .end((err) => {
        if (err) return done();
        done();
      });
  });

  it('should reject invalid dimensions', (done) => {
    request(app)
      .get('/api/images')
      .query({
        filename: 'fjord.jpg',
        width: '-300',
        height: '300',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done();
        expect(res.body.error).toBe('Invalid width or height');
        done();
      });
  });
});
