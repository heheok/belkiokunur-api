export const SuccessResponse = (
  payload,
  message = 'success',
  statusCode = 200
) => {
  return {
    statusCode: statusCode,
    message: message,
    payload: payload
  };
};

export const ErrorResponse = (errorMessage, statusCode = 500) => {
  return {
    statusCode: statusCode,
    error: errorMessage
  };
};
