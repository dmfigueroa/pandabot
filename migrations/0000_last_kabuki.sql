CREATE TABLE `access` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_in` integer
);
