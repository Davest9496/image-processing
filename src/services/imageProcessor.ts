import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { ResizeOptions } from '../types/formatTypes';
import { CustomError } from '../types/errorTypes';

export const imageProcessor = async (
  inputPath: string,
  outputPath: string,
  options: ResizeOptions
): Promise<void> => {
  const { width, height, format } = options;

  try {
    //-- Debugging: Log the input and output paths--//
    console.log('inputPath:', inputPath);
    console.log('outputPath:', outputPath);

    // Check if the input file exists
    await fs.access(inputPath);

    // Create the output directory if it doesn't exist
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Process the image
    await sharp(inputPath)
      .resize(width, height)
      .toFormat(format)
      .toFile(outputPath);
  } catch (error) {
    if (error instanceof Error) {
      const customError = error as CustomError;
      // Handle file not found error
      if (customError.code === 'ENOENT') {
        throw new Error('File not found: Could not upload image');
      }
      throw new Error(`Failed to process image: ${error.message}`);
    } else {
      throw new Error('Failed to process image: Unknown error');
    }
  }
};
