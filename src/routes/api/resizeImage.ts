import { Router, Request, Response } from 'express';
import multer from 'multer';
import { logger } from '../../utilities/logger';
import {
  AllowedFormat,
  QueryParams,
  ResizeOptions,
} from '../../types/formatTypes';
import { imageProcessor } from '../../services/imageProcessor';
import path from 'path';
import { cache } from '../../utilities/cache';
import { promises as fs } from 'fs';

const resize = Router();

// Define upload path at the top level
const uploadPath = path.join(__dirname, '../../../uploads');

// Create upload directory if it doesn't exist
fs.mkdir(uploadPath, { recursive: true }).catch(console.error);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});

// Your existing route handler remains the same but with more detailed logging
resize.post(
  '/upload',
  upload.single('image'),
  logger,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      console.log('Uploaded file details:', file);

      if (!file) {
        res.status(400).json({
          error: 'File not uploaded',
        });
        return;
      }

      const {
        width,
        height,
        format = 'jpg',
      } = req.body as unknown as QueryParams;

      // Use original filename for user-friendly naming
      const originalFilename = path.parse(file.originalname).name;

      console.log('Processing request:', {
        originalFilename,
        width,
        height,
        format,
        inputPath: file.path,
      });

      // Check if parameters are provided
      if (!width || !height) {
        console.error('Missing required parameters:', { width, height });
        res.status(400).json({
          error: 'Missing required parameters',
          required: ['width', 'height'],
        });
        return;
      }

      // Configure input and output paths
      const inputPath = file.path;
      const outputPath = path.join(
        __dirname,
        '../../../src/images/thumb',
        `${originalFilename}-${width}x${height}.${format}`
      );

      const resizeOptions: ResizeOptions = {
        width: Number(width),
        height: Number(height),
        format: format as AllowedFormat,
      };

      await imageProcessor(inputPath, outputPath, resizeOptions);

      // Store the image in cache
      const cacheKey = `${originalFilename}-${width}x${height}.${format}`;
      cache.set(cacheKey, outputPath);
      //-- Debugging: Log the cache key--//
      console.log('Image stored in cache:', cacheKey);

      res.sendFile(outputPath);

      // Clean up uploaded file after processing
      fs.unlink(inputPath).catch((err) =>
        console.error('Error cleaning up uploaded file:', err)
      );
    } catch (error) {
      console.error('Image processing error:', error);
      res.status(500).json({
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export { resize };
