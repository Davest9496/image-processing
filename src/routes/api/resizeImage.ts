// API route that gets and resize images

import { Router } from 'express';
import { logger } from '../../utilities/logger';


const resize = Router();

resize.get('/', logger, (req, res) => {
  res.send('Resize image API');
});

export { resize };
