import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { ApiResponse } from '../types/index';

export const validateRequest = (
  schema: ZodSchema
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
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

export const validateQuery = (
  schema: ZodSchema
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          error: 'Query validation error',
          message: error.errors
            .map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`)
            .join(', '),
        };
        res.status(400).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          error: 'Query validation failed',
        };
        res.status(400).json(response);
      }
    }
  };
};
