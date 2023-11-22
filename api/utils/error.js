export const errorHandler = (statusCode, message) => {

  if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode >= 600) {
    throw new Error('Invalid status code');
  }

  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
