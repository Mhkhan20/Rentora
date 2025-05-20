import { Pool } from 'pg';


const pool = new Pool ({ 
    user: 'rentora',
    host: 'localhost',
    database: 'rentora_dev',
    password :'supersecure',
    port: 5432,
});

export default pool;