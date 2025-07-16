import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export interface ValidationSchemas {
  query?: ZodSchema;
  body?: ZodSchema;
  params?: ZodSchema;
}

export const validateMultiple = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};
