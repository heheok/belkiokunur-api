export const SuccessResponse = (
  payload,
  message = 'success',
  statusCode = 200
) => {
  return {
    status: statusCode,
    message: message,
    data: payload
  };
};

export const ErrorResponse = (errorMessage, statusCode = 500) => {
  return {
    status: statusCode,
    error: errorMessage
  };
};
