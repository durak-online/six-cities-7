import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(StatusCodes.FORBIDDEN, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(StatusCodes.CONFLICT, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

