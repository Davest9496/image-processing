import sharp from 'sharp';
import { ResizeOptions } from '../types/formatTypes';

export const imageProcessor = async (
  inputBuffer: Buffer,
  options: ResizeOptions
): Promise<Buffer> => {
  const { width, height, format } = options;
  try {
    // Call the Sharp function on the image recieved from resizeImage
    return await sharp(inputBuffer)
      .resize(width, height)
      .toFormat(format)
      .toBuffer();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process image: ${error.message}`);
    } else {
      throw new Error('Failed to process image: Unknown error');
    }
  }
};
