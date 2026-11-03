function notFound(req, res) {
  return res.status(404).json({ error: 'Route not found' });
}

// Express recognizes error middleware by its four parameters.
function handleError(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }

  // Keep parser errors in JSON without exposing internal details or input data.
  if (Number.isInteger(error.status) && error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ error: 'Invalid request' });
  }
  console.error('Unexpected request error:', error.name);
  return res.status(500).json({ error: 'Internal server error' });
}

export { notFound, handleError };
