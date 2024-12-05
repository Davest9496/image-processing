import { Router } from 'express';
import { logger } from '../../utilities/logger';
import { imageProcessor } from '../../services/imageProcessor';
import { Request, Response } from 'express';
import path from 'path';

const resize = Router();

resize.get('/', logger, (req: Request, res: Response) => {
  async function resizeImage() {
    const { width, height, fileName, format } = req.query;

    try {
      const inputPath = path.join(__dirname, 'images', 'full', 'example.jpeg');
      const outputPath = path.join(
        __dirname,
        'images',
        'thumb',
        `${fileName}.${format}`
      );

      const processImage = await imageProcessor(inputPath, outputPath, {
        width: Number(width),
        height: Number(height),
        fileName: fileName as string,
        format: format as allowedFormat,
      });
    } catch (error) {
      console.error('Error resizing image: ', error);
      res.status(500).send('Error resizing image');
    }
  }

  // res.send('Resize image API');
});

export { resizeImage, processImage};
