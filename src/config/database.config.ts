import * as dotenv from 'dotenv';
import { User } from '../models/user.entity';

dotenv.config();

export const PG_DB_CONFIG = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'your_db_user',
  password: process.env.DB_PASSWORD || 'your_db_password',
  database: process.env.DB_NAME || 'your_db_name',
  // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  ssl: { rejectUnauthorized: false }, // Force SSL
  entities: [User],
  synchronize: false,
};
