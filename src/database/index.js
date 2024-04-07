import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

export const access = sqliteTable("access", {
  id: integer("id").primaryKey(),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  expires_in: integer("expires_in"),
});

export default db;
