import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { ApiResponse } from '../types/index';

export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' = 'body'
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = source === 'body' ? req.body : req.query;
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          error: 'Validation error',
          message: error.errors
            .map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`)
            .join(', '),
        };
        res.status(400).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          error: 'Validation failed',
        };
        res.status(400).json(response);
      }
    }
  };
};
