import { Pool } from 'pg';

const pool = new Pool({
  user: 'rentora',
  host: 'rentora-db.c16qu0i4mast.us-east-2.rds.amazonaws.com',
  database: 'rent',
  password: 'jH([1$HkW!SK?cTO?ousCo9roNO1',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Required for RDS SSL
  },
});

export default pool;
