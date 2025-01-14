import { Router } from 'express';
import { resize } from './api/resizeImage';

const routes = Router();

routes.get('/', (_req, res) => {
  res.render('index');
});

routes.use('/images', resize);

export { routes };
