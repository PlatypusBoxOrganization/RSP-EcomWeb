const errorHandler = (err, req, res, next) => {
  // Log all errors for debugging
  console.error('\n===== ERROR HANDLER =====');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Error:', err);
  
  // Always log the full error in development
  if (process.env.NODE_ENV !== 'production' || err.status !== 404) {
    console.error('Error Stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Request Headers:', req.headers);
    console.error('Request Body:', req.body);
    console.error('Request Query:', req.query);
    console.error('Request Params:', req.params);
  }
  
  // Log database connection status if this is a database error
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    console.error('MongoDB Connection State:', mongoose.connection.readyState);
  }
  
  // Default to 500 (Internal Server Error) if status code not set
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle specific error types
  let message = err.message || 'Something went wrong';
  let errorDetails = null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    message = 'Validation failed';
    errorDetails = Object.values(err.errors).map(e => e.message);
    statusCode = 400; // Bad Request
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401; // Unauthorized
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    errorDetails = 'This value already exists in the system';
    statusCode = 400; // Bad Request
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400; // Bad Request
  }

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    ...(errorDetails && { errors: errorDetails })
  };

  res.status(statusCode).json(response);
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404; // Add status property to identify 404 errors
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
