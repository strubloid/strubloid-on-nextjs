/**
 * API Response Types
 * Standard types for API communication and responses
 */

/** Standard API JSON response */
export interface IApiResponse<T = unknown> {
    success: boolean;
    data?: T;
}

/** Generic form validation errors */
export interface IFormErrors {
    [key: string]: string;
}
