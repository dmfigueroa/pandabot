import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
const db: BunSQLiteDatabase = drizzle(sqlite);

export const access = sqliteTable("access", {
  id: integer("id").primaryKey(),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  expires_in: integer("expires_in"),
});

export default db;
