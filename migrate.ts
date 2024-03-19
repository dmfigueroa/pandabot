import Database from "bun:sqlite";
import { drizzle, BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database("sqlite.db");
const db: BunSQLiteDatabase = drizzle(sqlite);

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: "./migrations" });
