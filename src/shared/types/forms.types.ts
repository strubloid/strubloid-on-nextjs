/**
 * Form Types
 * Types for form inputs and form states across the application
 */

/** Contact form inputs */
export interface IContactInputs {
    name: string;
    email: string;
    subject: string;
    message: string;
    captcha: string | false;
}

/** Contact form submission status */
export interface IContactStatus {
    submitted: boolean;
    submitting: boolean;
    info: {
        error: boolean;
        msg: string | null;
    };
}
