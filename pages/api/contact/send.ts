import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

interface ContactRequestBody {
    name: string;
    email: string;
    subject: string;
    message: string;
    captcha: string | false;
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

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
        res.status(500).send('Mail service is not configured.');
        return;
    }

    sgMail.setApiKey(sendgridApiKey);

    const html = `
    <h2>The craic mate: ${subject}</h2>
    <p>Good person's name: ${name}</p>
    <p>How can you reach: ${email}</p>
    <h3>Sweet message below</h3>
    <div>${message}</div>
  `;

    try {
        await sgMail.send({
            to: process.env.MAIL,
            from: process.env.GMAIL ?? '',
            subject,
            text: message,
            html,
        });
        res.status(200).send('Message sent successfully.');
    } catch {
        res.status(400).send('Message not sent.');
    }
}
