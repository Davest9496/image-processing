import express from 'express';
import { routes } from './routes/router';
import { logger } from './utilities/logger';

const app = express();
const port = 3000;

app.use(logger);

// import and use routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
