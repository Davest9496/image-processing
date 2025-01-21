import express from 'express';
import path from 'path';
import { routes } from './routes/router';

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files setup - ensure the directory exists and handle errors gracefully
const publicPath = path.join(__dirname, 'public');
app.use(
  express.static(publicPath, {
    // Don't fail if the directory doesn't exist
    fallthrough: true,
    // Don't show directory listings
    index: false,
  })
);

// Routes
app.use('/api', routes);

// 404 handler - must come after routes but before error handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware - must be last
app.use(
  (err: Error, req: express.Request, res: express.Response) => {
    console.error('Error:', err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
