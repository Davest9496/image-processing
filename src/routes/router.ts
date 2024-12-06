//-- Collects all routes and exports them to index file--//
import { Router } from 'express';
import { resize } from './api/resizeImage';

const routes = Router();

// Route to test if the server is running
//-- Does nothing in this program currently --//
routes.get('/', (req, res) => {
  res.send('Hello, TypeScript from Routes!');
});

routes.use('/images', resize);
// More routes can be added here --//

export { routes };
