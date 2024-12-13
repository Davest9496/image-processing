import { imageProcessor } from '../../src/services/imageProcessor';
import { promises as fs } from 'fs';
import path from 'path';
import { ResizeOptions } from '../../src/types/formatTypes';
import express, { Application } from 'express';
import { resize } from '../../src/routes/api/resizeImage';
import request from 'supertest';
import 'jasmine';
import { fail } from 'assert';

describe('Image Processing System', () => {
  // Define paths using project structure
  const testInputDir = path.join(__dirname, '../../src/images/full');
  const testOutputDir = path.join(__dirname, '../../src/images/thumb');
  const testImagePath = path.join(testInputDir, 'fjord.jpg');
  let app: Application;

  beforeAll(async () => {
    // Set up Express app for route testing
    app = express();
    app.use('/api/images', resize);

    // Create directories if they don't exist
    await fs.mkdir(testInputDir, { recursive: true });
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  beforeEach(async () => {
    // Clean thumb directory before each test
    try {
      const files = await fs.readdir(testOutputDir);
      for (const file of files) {
        await fs.unlink(path.join(testOutputDir, file));
      }
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  describe('imageProcessor', () => {
    it('should successfully process an existing image', async () => {
      const options: ResizeOptions = {
        width: 300,
        height: 300,
        format: 'jpg',
      };

      const outputPath = path.join(testOutputDir, 'fjord-300x300.jpg');

      await imageProcessor(testImagePath, outputPath, options);

      // Verify output exists
      const fileExists = await fs
        .access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should throw error for non-existent input file', async () => {
      const options: ResizeOptions = {
        width: 300,
        height: 300,
        format: 'jpg',
      };

      const nonExistentPath = path.join(testInputDir, 'nonexistent.jpg');
      const outputPath = path.join(testOutputDir, 'output.jpg');

      try {
        await imageProcessor(nonExistentPath, outputPath, options);
        fail('Expected an error to be thrown');
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).toBe('File not found: Could not upload image');
        } else {
          fail('Expected an Error to be thrown');
        }
      }
  });

  describe('Upload Route', () => {
    it('should successfully upload and process an image', (done) => {
      request(app)
        .post('/upload')
        .attach('image', testImagePath)
        .field('width', '300')
        .field('height', '300')
        .field('format', 'jpg')
        .expect(200)
        .end((err, res) => {
          if (err) return done();
          expect(res.header['content-type']).toMatch(/image/);
          done();
        });
    });

    it('should reject upload without required parameters', (done) => {
      request(app)
        .post('/upload')
        .attach('image', testImagePath)
        .expect(400)
        .end((err, res) => {
          if (err) return done();
          expect(res.body.error).toBe('Missing required parameters');
          expect(res.body.required).toContain('width');
          expect(res.body.required).toContain('height');
          done();
        });
    });

    it('should handle invalid dimensions', (done) => {
      request(app)
        .post('/upload')
        .attach('image', testImagePath)
        .field('width', '-300')
        .field('height', '300')
        .field('format', 'jpg')
        .expect(400)
        .end((err, res) => {
          if (err) return done();
          expect(res.body.error).toBe('Invalid width or height');
          done();
        });
    });

    it('should handle missing image file', (done) => {
      request(app)
        .post('/upload')
        .field('width', '300')
        .field('height', '300')
        .field('format', 'jpg')
        .expect(400)
        .end((err, res) => {
          if (err) return done();
          expect(res.body.error).toBe('File not uploaded');
          done();
        });
    });
  });
});
});
