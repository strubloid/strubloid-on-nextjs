/**
 * Database Barrel Export
 * Centralized export point for database connection and models
 */

export { default, default as dbConnect } from "./connection";
export { Contact } from "./models";
export type { IContactDocument } from "./models";
