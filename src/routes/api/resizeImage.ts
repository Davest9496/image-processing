import { Router, Request, Response } from 'express';
import { logger } from '../../utilities/logger';
import { AllowedFormat, Options, QueryParams } from '../../types/formatTypes';
import { imageProcessor } from '../../services/imageProcessor';
import path from 'path';

const resize = Router();

resize.get('/', logger, async (req: Request, res: Response): Promise<void> => {
  try {
    const { width, height, fileName, format } = req.query as QueryParams;

    // Check if parameters are provided
    if (!width || !height || !fileName || !format) {
      res.status(400).json({
        error: 'Missing required query parameters',
        required: ['width', 'height', 'fileName', 'format'],
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

    // Validate format
    const validFormats: AllowedFormat[] = [
      'jpeg',
      'png',
      'webp',
      'avif',
      'gif',
    ];
    if (!validFormats.includes(format as AllowedFormat)) {
      res.status(400).json({
        error: 'Invalid format',
        allowedFormats: validFormats,
      });
      return;
    }

    const inputPath = path.join(
      __dirname,
      'images',
      'full',
      `${fileName}.jpeg`
    );
    const outputPath = path.join(
      __dirname,
      'images',
      'thumb',
      `${fileName}.${format}`
    );

    const resizeOptions: Options = {
      width: numWidth,
      height: numHeight,
      format: format as AllowedFormat,
    };

    await imageProcessor(inputPath, outputPath, resizeOptions);
    res.json({ message: 'Image resized', outputPath });
  res.sendFile(outputPath);
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).json({
      error: 'Failed to resize image',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { resize };
