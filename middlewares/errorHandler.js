const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  if (req.accepts('html')) {
    res.render('error', { message: err.message || 'Internal Server Error', status: err.status || 500 });
  } else {
    res.json({ message: err.message || 'Internal Server Error' });
  }
}

module.exports = errorHandler;