/** Shared interfaces for the Note entity */
export interface INote {
    _id: string;
    title: string;
    description: string;
}

/** Form shape for creating/editing a Note */
export interface INoteForm {
    title: string;
    description: string;
}

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

/** Generic form validation errors */
export interface IFormErrors {
    [key: string]: string;
}

/** Standard API JSON response */
export interface IApiResponse<T = unknown> {
    success: boolean;
    data?: T;
}

/** Props for components that receive a Google Maps API key */
export interface IGoogleKeyProps {
    googleKey?: string;
}
