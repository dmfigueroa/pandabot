/**
 * @typedef {import("zod").ZodType } ZodType
 * @typedef {import("zod").z} z
 */

import { readFile } from "node:fs/promises";

/**
 * This method loads a file, parse it to a JSON and validates it with the provided schema.
 * @template {ZodType} T
 * @param {string} path The path of the file
 * @param {T} schema The schema to validate the json file
 * @returns {Promise<ReturnType<T["parse"]>>} The validated object
 */
export default async function (path, schema) {
  const data = await readFile(path, "utf8");
  const jsonData = JSON.parse(data.toString());
  return schema.parse(jsonData);
}
