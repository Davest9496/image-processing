//-- Collects all routes and exports them to index file--//
import { Router } from 'express';
import { resize } from './api/resizeImage';

const routes = Router();

// Route to index
routes.get('/', (_req, res) => {
  res.render('index');
});

routes.use('/images', resize);
// More routes can be added here --//

export { routes };
