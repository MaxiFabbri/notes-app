import { Sequelize } from 'sequelize';

// One shared Sequelize instance; models will use this same connection.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,
  }
);

async function dbConnect() {
  for (const variable of ['DB_NAME', 'DB_USER', 'DB_PASSWORD']) {
    if (!process.env[variable]) {
      const error = new Error(`Missing ${variable} in the root .env file`);
      error.code = 'MISSING_DB_CONFIG';
      throw error;
    }
  }

  // Verify credentials and database access without creating or modifying tables.
  await sequelize.authenticate();
  console.log('PostgreSQL connection established');
}

export { sequelize };
export default dbConnect;
