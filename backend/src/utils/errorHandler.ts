import { Response } from 'express';

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    if (code !== undefined) {
      this.code = code;
    }
    this.name = 'AppError';
  }
}

export const handleError = (
  res: Response,
  error: unknown,
  defaultMessage: string = 'Internal server error',
  defaultStatusCode: number = 500
): void => {
  let message: string;
  let statusCode: number;
  let code: string | undefined;

  if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
    code = error.code;
  } else if (error instanceof Error) {
    message = error.message;
    statusCode = defaultStatusCode;
  } else {
    message = defaultMessage;
    statusCode = defaultStatusCode;
  }

  const response = {
    success: false,
    error: message,
    ...(code && { code }),
  };

  res.status(statusCode).json(response);
};

export const createError = (message: string, statusCode: number, code?: string): AppError => {
  return new AppError(message, statusCode, code);
};

export const ErrorTypes = {
  NOT_FOUND: (resource: string) => createError(`${resource} not found`, 404, 'NOT_FOUND'),
  UNAUTHORIZED: (message: string = 'Unauthorized') => createError(message, 401, 'UNAUTHORIZED'),
  FORBIDDEN: (message: string = 'Forbidden') => createError(message, 403, 'FORBIDDEN'),
  VALIDATION_ERROR: (message: string) => createError(message, 400, 'VALIDATION_ERROR'),
  CONFLICT: (message: string) => createError(message, 409, 'CONFLICT'),
  INTERNAL_ERROR: (message: string = 'Internal server error') =>
    createError(message, 500, 'INTERNAL_ERROR'),
} as const;
