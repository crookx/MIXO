import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  response: ApiResponse<T>
): void => {
  res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta']
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta })
  };
  sendResponse(res, statusCode, response);
};

export const sendError = (
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  error?: any
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error })
  };
  sendResponse(res, statusCode, response);
};