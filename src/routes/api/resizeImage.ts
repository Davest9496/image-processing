import { Router, Request, Response, Express } from 'express';
import multer from 'multer';
import { logger } from '../../utilities/logger';
import path from 'path';
import {
  AllowedFormat,
  QueryParams,
  ResizeOptions,
} from '../../types/formatTypes';
import { imageProcessor } from '../../services/imageProcessor';
import { cache } from '../../utilities/cache';

const resize = Router();

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      cb(
        new Error(
          'Invalid file type. Supported formats: JPG, PNG, GIF, WebP, AVIF'
        )
      );
      return;
    }
    cb(null, true);
  },
});

resize.post(
  '/resize',
  logger,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Handle file upload
      const uploadResult = await new Promise<Express.Multer.File | undefined>(
        (resolve, reject) => {
          upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
              if (err.code === 'LIMIT_FILE_SIZE') {
                reject(
                  new Error(
                    `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
                  )
                );
              } else {
                reject(new Error(`Upload error: ${err.message}`));
              }
            } else if (err) {
              reject(err);
            } else {
              resolve(req.file);
            }
          });
        }
      );

      if (!uploadResult) {
        res.render('result', {
          error: {
            message: 'No file uploaded',
            details: 'Please select an image file',
          },
          imageId: '',
          width: '',
          height: '',
          format: '',
          apiBasePath: '/api',
        });
        return;
      }

      const {
        width,
        height,
        format = 'jpg',
      } = req.body as unknown as QueryParams;

      if (!width || !height) {
        res.render('result', {
          error: {
            message: 'Missing dimensions',
            details: 'Both width and height are required',
          },
          imageId: '',
          width: '',
          height: '',
          format: '',
          apiBasePath: '/api',
        });
        return;
      }

      // Get original filename without extension
      const originalFilename = path.parse(uploadResult.originalname).name;

      // Create new filename in the desired format
      const newFilename = `${originalFilename}-${width}x${height}.${format}`;

      const resizeOptions: ResizeOptions = {
        width: Number(width),
        height: Number(height),
        format: format as AllowedFormat,
      };

      const processedImageBuffer = await imageProcessor(
        uploadResult.buffer,
        resizeOptions
      );

      if (processedImageBuffer.length > MAX_FILE_SIZE) {
        res.render('result', {
          error: {
            message: 'Processed image too large',
            details: 'Try reducing dimensions or using a different format',
          },
          imageId: '',
          width: '',
          height: '',
          format: '',
          apiBasePath: '/api',
        });
        return;
      }

      // Store in cache with the new filename as the key
      cache.set(newFilename, {
        buffer: processedImageBuffer,
        contentType: `image/${format}`,
        timestamp: Date.now(),
      });

      // Render success result with the new filename
      res.render('result', {
        imageId: newFilename,
        width,
        height,
        format,
        error: null,
        apiBasePath: '/api',
      });
    } catch (error) {
      console.error('Processing error:', error);
      res.render('result', {
        error: {
          message: 'Image processing failed',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        imageId: '',
        width: '',
        height: '',
        format: '',
        apiBasePath: '/api',
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
      const cachedImage = cache.get(imageId) as
        | {
            buffer: Buffer;
            contentType: string;
            timestamp: number;
          }
        | undefined;

      if (!cachedImage) {
        res.status(404).json({
          error: 'Image not found',
          details: 'The requested image is no longer available',
        });
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
