// Collects all routes and exports them to index file
import { Router } from 'express';
import { resize } from './api/resizeImage';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hello, TypeScript from Routes!');
});

routes.use('/resize', resize);
// More routes can be added here --

export { routes };
