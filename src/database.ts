import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("sqlite.db");
const db: BetterSQLite3Database = drizzle(sqlite);

export const access = sqliteTable("access", {
  id: integer("id").primaryKey(),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  expires_in: integer("expires_in"),
});

export default db;
