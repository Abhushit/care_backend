import pg from 'pg';
import dotenv from 'dotenv'

dotenv.config();

const Pool = pg.Pool;

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;


const pool = new Pool({
    connectionString: !isProduction ? `postgresql://postgres:${process.env.DB_PROD_PASSWORD}@containers-us-west-56.railway.app:7610/railway`  : connectionString
});

export default pool;