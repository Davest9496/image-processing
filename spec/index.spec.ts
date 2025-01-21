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
     // Try to access a file we know doesn't exist
     const response = await request(app)
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
      const response = await request(app).get('/api/');
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });
  });
});
