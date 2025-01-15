import { Router, Request, Response } from 'express';
import multer from 'multer';
import { logger } from '../../utilities/logger';
import {
  AllowedFormat,
  QueryParams,
  ResizeOptions,
} from '../../types/formatTypes';
import { imageProcessor } from '../../services/imageProcessor';
import { cache } from '../../utilities/cache';

const resize = Router();

// Use memory storage instead of disk storage for Vercel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      cb(new Error('Invalid file type'));
      return;
    }
    cb(null, true);
  },
});

// Image processing endpoint
resize.post(
  '/resize',
  upload.single('image'),
  logger,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      console.log('Processing upload:', file?.originalname);

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const {
        width,
        height,
        format = 'jpg',
      } = req.body as unknown as QueryParams;

      if (!width || !height) {
        res.status(400).json({
          error: 'Missing dimensions',
          required: ['width', 'height'],
        });
        return;
      }

      const resizeOptions: ResizeOptions = {
        width: Number(width),
        height: Number(height),
        format: format as AllowedFormat,
      };

      const processedImageBuffer = await imageProcessor(
        file.buffer,
        resizeOptions
      );
      const timestamp = Date.now();
      const cacheKey = `${timestamp}-${width}x${height}.${format}`;

      // Store in cache
      cache.set(cacheKey, {
        buffer: processedImageBuffer,
        contentType: `image/${format}`,
        timestamp,
      });

      // Render the result page with the correct API path
      res.render('result', {
        imageId: cacheKey,
        width,
        height,
        format,
        apiBasePath: '/api', // Pass this to the template
      });
    } catch (error) {
      console.error('Processing error:', error);
      res.status(500).json({
        error: 'Processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Serve processed images
resize.get(
  '/processed/:imageId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { imageId } = req.params;
      console.log('Serving image:', imageId);

      const cachedImage = cache.get(imageId) as
        | {
            buffer: Buffer;
            contentType: string;
            timestamp: number;
          }
        | undefined;

      if (!cachedImage) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.set('Content-Type', cachedImage.contentType);
      res.set('Cache-Control', 'public, max-age=3600');
      res.send(cachedImage.buffer);
    } catch (error) {
      console.error('Serve error:', error);
      res.status(500).json({
        error: 'Failed to serve image',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export { resize };
