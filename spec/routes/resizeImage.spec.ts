import request from 'supertest';
import app from '../../src/index';
import sharp from 'sharp';

describe('Resize Route', () => {
  // Create a small test image buffer for uploads
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    testImageBuffer = await sharp({
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
      const response = await request(app)
        .post('/api/images/resize')
        .attach('image', testImageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        })
        .field('width', '300')
        .field('height', '200')
        .field('format', 'jpg');

      expect(response.status).toBe(200);
      // Check for html response
      expect(response.type).toMatch(/html/);
    });

    it('should reject upload without required parameters', async () => {
      const response = await request(app)
        .post('/api/images/resize')
        .attach('image', testImageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        });

      expect(response.status).toBe(200); // will return 200 because it renders error view
      expect(response.text).toContain('Missing dimensions');
    });

    it('should handle invalid dimensions', async () => {
      const response = await request(app)
        .post('/api/images/resize')
        .attach('image', testImageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        })
        .field('width', '-300')
        .field('height', '200');

      expect(response.status).toBe(200); 
      expect(response.text).toContain('Expected positive integer for width');
    });

    it('should handle missing image file', async () => {
      const response = await request(app)
        .post('/api/images/resize')
        .field('width', '300')
        .field('height', '200');

      expect(response.status).toBe(200);
      expect(response.text).toContain('No file uploaded');
    });

    // More dimension validation tests
    it('should handle zero dimensions', async () => {
      const response = await request(app)
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
      const response = await request(app)
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
      const response = await request(app).get(
        '/api/images/processed/nonexistent.jpg'
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Image not found');
    });
  });
});
