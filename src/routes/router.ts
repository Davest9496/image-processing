import { Router } from 'express';
import { resize } from './api/resizeImage';

const routes = Router();

// Returns home route
routes.get('/', (_req, res) => {
  res.render('index');
});

// Returns resizeImage route
routes.use('/images', resize);

export { routes };
