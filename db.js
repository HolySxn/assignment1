const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'logins',
  password: '123',
  port: 5432,
});

module.exports = pool;

