// Logger implementation
// This middleware logs the method and URL of the request to the console
// before passing the request to the next middleware.

import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`A ${req.method} request was made to ${req.url}`);

  next(); // Call the next middleware
};
