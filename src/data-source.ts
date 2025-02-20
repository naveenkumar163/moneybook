import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config"; // Load .env file

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["src/models/*.ts"], 
  migrations: ["src/migrations/*.ts"],
  synchronize: true, // Use migrations instead
  ssl: { rejectUnauthorized: false }, // ✅ Ensure SSL for AWS RDS
});
