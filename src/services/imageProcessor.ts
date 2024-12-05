// A function that uses sharp to obtain user info
// as parameters and returns a promise with the
// processed image.
// import path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { Options } from '../types/formatTypes';
import path from 'path';


const imageProcessor = async (
  inputPath: string,
  outputPath: string,
  options: Options
): Promise<string> => {
  try {

    // Check if the input path exists, create outputPath if !exist
    await fs.access(inputPath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Check if the format is allowed
    if (!['jpeg', 'png', 'webp', 'avif', 'gif'].includes(options.format)) {
      throw new Error('Invalid format');
    }

    // Process image
    await sharp(inputPath)
      .resize(options.width, options.height)
      .toFormat(options.format)
      .toFile(outputPath);

    return outputPath
  }catch(error) {
    console.error('Image processing error: ', error);
    throw new Error(`Could not process Image: ${error}`);
  }
};

export { imageProcessor };

// new sharp('input.jpg')
