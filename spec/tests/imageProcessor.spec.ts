import { imageProcessor } from '../../src/services/imageProcessor';
import { promises as fs } from 'fs';
import path from 'path';
import { ResizeOptions } from '../../src/types/formatTypes';
import { fail } from 'assert';

describe('Image Processor', () => {
  const testInputDir = path.join(__dirname, '../../src/images/full');
  const testOutputDir = path.join(__dirname, '../../src/images/thumb');
  const testImagePath = path.join(testInputDir, 'fjord.jpg'); // Use an existing image

  // Clean up test output before each test
  beforeEach(async () => {
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  it('should successfully process an existing image', async () => {
    // Test setup
    const options: ResizeOptions = {
      width: 300,
      height: 300,
      format: 'jpg',
    };

    const outputPath = path.join(testOutputDir, 'fjord_300x300.jpg');

    // Execute test
    await imageProcessor(testImagePath, outputPath, options);

    // Verify output exists
    const outputExists = await fs
      .access(outputPath)
      .then(() => true)
      .catch(() => false);

    expect(outputExists).toBe(true);
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
      fail('Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          'File not found: Please ensure filename is correctly typed and in the "full" folder'
        );
      } else {
        fail('Unexpected error type');
      }
    }
  });
});
