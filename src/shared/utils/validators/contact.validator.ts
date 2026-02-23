import type { IContactInputs, IFormErrors } from "@types";

/**
 * Validates contact form inputs
 * @param inputs - Contact form inputs to validate
 * @returns Object containing field errors (empty if valid)
 */
export const validateContactForm = (inputs: IContactInputs): IFormErrors => {
    const errors: IFormErrors = {};
    if (!inputs.name) errors.name = "Name is required";
    if (!inputs.email) errors.email = "Email is required";
    if (!inputs.subject) errors.subject = "Subject is required";
    if (!inputs.message) errors.message = "Message is required";
    if (!inputs.captcha) errors.captcha = "Please confirm you are not a robot";
    return errors;
};
