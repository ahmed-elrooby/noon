const glocalErrorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message, status: err.statusCode });
  next();
};

export { glocalErrorHandler };
