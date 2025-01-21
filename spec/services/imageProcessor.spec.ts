import sharp from 'sharp';
import { imageProcessor } from '../../src/services/imageProcessor';
import { AllowedFormat } from '../../src/types/formatTypes';
import { fail } from 'assert';

describe('Image Processing Service', () => {
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    // Create a simple 100x100 red square image for testing
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

  it('should process an image successfully', async () => {
    const options = {
      width: 300,
      height: 300,
      format: 'jpeg',
    };

    const result = await imageProcessor(testImageBuffer, { ...options, format: options.format as AllowedFormat });

    const metadata = await sharp(result).metadata();
    expect(metadata.width).toBe(300);
    expect(metadata.height).toBe(300);
  });

  it('should handle WebP format conversion', async () => {
    const options = {
      width: 300,
      height: 300,
      format: 'webp',
    };

    const result = await imageProcessor(testImageBuffer, { ...options, format: options.format as AllowedFormat });

    const metadata = await sharp(result).metadata();
    expect(metadata.format).toBe('webp');
  });

  it('should maintain aspect ratio if only width is specified', async () => {
    const options = {
      width: 300,
      format: 'jpg',
    };

    const result = await imageProcessor(testImageBuffer, { ...options, format: options.format as AllowedFormat });

    const originalMetadata = await sharp(testImageBuffer).metadata();
    const originalAspectRatio = originalMetadata.width! / originalMetadata.height!;

    const metadata = await sharp(result).metadata();
    if (metadata.width && metadata.height) {
      const newAspectRatio = metadata.width / metadata.height;
      expect(Math.abs(originalAspectRatio - newAspectRatio)).toBeLessThan(0.01);
    } else {
      fail('Metadata width or height is undefined');
    }
  });

  it('should handle large size reductions', async () => {
    const options = {
      width: 50,
      height: 50,
      format: 'jpg',
    };

    const result = await imageProcessor(testImageBuffer, { ...options, format: options.format as AllowedFormat });

    const metadata = await sharp(result).metadata();
    expect(metadata.width).toBe(50);
    expect(metadata.height).toBe(50);
  });
});
