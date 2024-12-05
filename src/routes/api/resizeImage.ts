import { Router, Request, Response } from 'express';
import { logger } from '../../utilities/logger';
import { AllowedFormat, QueryParams, ResizeOptions } from '../../types/formatTypes';
import { imageProcessor } from '../../services/imageProcessor';
import path from 'path';

const resize = Router();

resize.get('/', logger, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      width,
      height,
      filename,
      format = 'jpg',
    } = req.query as unknown as QueryParams;

    // Debugging: Log the query parameters
    console.log('Query params:', req.query);

    // Check if parameters are provided
    if (!width || !height || !filename) {
      console.error('Check - Missing required query parameters:', {
        width,
        height,
        filename,
      });
      res.status(400).json({
        error: 'Missing required query parameters',
        required: ['width', 'height', 'filename'],
      });
      return;
    }

    // Parse and validate numeric parameters
    const numWidth = Number(width);
    const numHeight = Number(height);
    if (
      isNaN(numWidth) ||
      isNaN(numHeight) ||
      numWidth <= 0 ||
      numHeight <= 0
    ) {
      res.status(400).json({
        error: 'Invalid width or height',
        details: 'Width and height must be positive numbers',
      });
      return;
    }

    // Validate file format
    const validFormats: AllowedFormat[] = [
      'jpg',
      'png',
      'webp',
      'avif',
      'gif',
    ];
    if (!validFormats.includes(format as AllowedFormat)) {
      console.log(format);
      res.status(400).json({
        error: 'Invalid format',
        allowedFormats: validFormats,
      });
      return;
    }

    // Configure input and output paths
    const inputPath = path.join(
      __dirname,
      '../../../src/images/full',
      `${filename}.jpg`
    );
    const outputPath = path.join(
      __dirname,
      '../../../src/images/thumb',
      `${filename}-${numWidth}x${numHeight}.${format}`
    );

    const resizeOptions: ResizeOptions = {
      width: numWidth,
      height: numHeight,
      format: format as AllowedFormat,
    };

    await imageProcessor(inputPath, outputPath, resizeOptions);
    res.sendFile(outputPath);
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).json({
      error: 'Failed to resize image',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default resize;
