import type { INoteForm, IFormErrors } from "@types";

/**
 * Validates note form inputs
 * @param form - Note form to validate
 * @returns Object containing field errors (empty if valid)
 */
export const validateNoteForm = (form: INoteForm): IFormErrors => {
    const errors: IFormErrors = {};
    if (!form.title) errors.title = "Title is required";
    if (!form.description) errors.description = "Description is required";
    return errors;
};
