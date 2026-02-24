import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

interface ContactRequestBody {
    name: string;
    email: string;
    subject: string;
    message: string;
    captcha: string | false;
}

interface RecaptchaResponse {
    success: boolean;
    'error-codes'?: string[];
}

async function verifyRecaptcha(token: string): Promise<boolean> {
    const secret = process.env.NEXT_PUBLIC_SITE_RECAPTCHA_SECRET;
    if (!secret) return false;

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${token}`,
    });

    const data = (await response.json()) as RecaptchaResponse;
    return data.success;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { name, email, subject, message, captcha } =
        req.body as ContactRequestBody;

    if (!captcha) {
        res.status(400).send('You must confirm the captcha!');
        return;
    }

    const captchaValid = await verifyRecaptcha(captcha as string);
    if (!captchaValid) {
        res.status(400).send('Captcha verification failed. Please try again.');
        return;
    }

    const resendApiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;
    if (!resendApiKey) {
        res.status(500).send('Mail service is not configured.');
        return;
    }

    const resend = new Resend(resendApiKey);

    const html = `
    <h2>The craic mate: ${subject}</h2>
    <p>Good person's name: ${name}</p>
    <p>How can you reach: ${email}</p>
    <h3>Sweet message below</h3>
    <div>${message}</div>
  `;

    try {
        const { error } = await resend.emails.send({
            from: `${name} <noreply@strubloid.com>`,
            to: process.env.MAIL ?? 'mail@strubloid.com',
            replyTo: email,
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            res.status(400).send(`Message not sent: ${error.message}`);
            return;
        }

        res.status(200).send('Message sent successfully.');
    } catch (err: unknown) {
        const e = err as { message?: string };
        console.error('Resend exception:', e?.message);
        res.status(400).send(`Message not sent: ${e?.message ?? 'Unknown error'}`);
    }
}
