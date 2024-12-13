import express from 'express';
import { routes } from './routes/router';
import { logger } from './utilities/logger';
import path from 'path';

const app = express();
const port = 3000;

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// middleware for form data
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// import and use routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
