function startupErrorMessage(error) {
  // Connection errors may be wrapped by Sequelize or by Node's AggregateError.
  const cause = error.original || error.cause || error;
  const codes = [error.code, cause.code, ...(cause.errors || []).map(item => item.code)];

  if (codes.includes('MISSING_DB_CONFIG')) return error.message;
  if (codes.includes('ECONNREFUSED')) {
    return 'Could not connect to PostgreSQL. Check that the service is running and DB_HOST/DB_PORT are correct.';
  }
  if (codes.some(code => ['ENOTFOUND', 'EAI_AGAIN'].includes(code))) {
    return 'PostgreSQL host could not be resolved. Check DB_HOST.';
  }
  if (codes.includes('ETIMEDOUT') || error.name === 'SequelizeConnectionTimedOutError') {
    return 'PostgreSQL connection timed out. Check the server, network and DB_HOST/DB_PORT.';
  }
  if (codes.includes('28P01')) {
    return 'PostgreSQL authentication failed. Check DB_USER and DB_PASSWORD.';
  }
  if (codes.includes('28000')) {
    return 'PostgreSQL rejected the connection. Check the user and server authentication configuration.';
  }
  if (codes.includes('3D000')) {
    return 'PostgreSQL database does not exist. Check DB_NAME and run the database setup script.';
  }
  if (codes.includes('EADDRINUSE')) {
    return 'The backend port is already in use. Stop the other server or change PORT.';
  }
  return 'Server startup failed. Check the database connection and server configuration.';
}

export default startupErrorMessage;
