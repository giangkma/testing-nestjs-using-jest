export interface ContactFormPayload {
    name: string;
    work?: string; // default = "-"
    email: string;
    phone_number?: string; // default "-"
    message: string;
    subject: string;
}

export interface ContactFormAutoReplyPayload {
    name: string;
}

export const getContactFormPayload = (
    payload: ContactFormPayload,
): ContactFormPayload => {
    const { name, work, email, phone_number, message, subject } = payload;

    return {
        name,
        work: work ?? '-',
        email,
        phone_number: phone_number ?? '-',
        message,
        subject,
    };
};
