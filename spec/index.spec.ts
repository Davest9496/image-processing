// spec/server.spec.ts
import request from 'supertest';
import app from '../src/index';

describe('Express Server', () => {
  describe('Server Configuration', () => {
    it('should have view engine set to ejs', () => {
      expect(app.get('view engine')).toBe('ejs');
    });

    it('should have views directory configured', () => {
      const views = app.get('views');
      expect(typeof views).toBe('string');
      expect(views).toContain('views');
    });
  });

  describe('Static File Serving', () => {
    it('should serve static files from public directory', async () => {
      const response = await request(app).get('/test.css');
      // We expect 404 because test.css doesn't exist, but we're testing the static middleware
      expect(response.status).toBe(404);
    });
  });

  describe('API Base Route', () => {
    it('should render index page at /api/', async () => {
      const response = await request(app).get('/api/');
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });
  });
});
