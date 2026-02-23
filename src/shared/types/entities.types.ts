/**
 * Entity Types
 * Types for data models and entities used across the application
 */

/** Shared interfaces for the Note entity */
export interface INote {
    _id: string;
    title: string;
    description: string;
}
