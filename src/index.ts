import express from 'express';
import path from 'path';
import { routes } from './routes/router';

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', routes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
