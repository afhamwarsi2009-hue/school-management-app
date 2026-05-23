function errorHandler(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message;

  if (error.code === 'EREQUEST' && [2601, 2627].includes(error.number)) {
    status = 409;
    message = 'A record with the same unique value already exists';
  }

  if (error.message === 'Not allowed by CORS') {
    status = 403;
  }

  if (status === 500) {
    console.error(error);
  }
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : message
  });
}

module.exports = { errorHandler };
