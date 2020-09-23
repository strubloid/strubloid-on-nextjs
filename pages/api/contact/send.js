import sgMail from '@sendgrid/mail'

import React from 'react';

const Send = async (req, res) => {

    const {name, email, subject, message, captcha} = req.body
    const strubloidGmail = process.env.GMAIL;
    const strubloidMail = process.env.MAIL;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    if (!captcha){
        res.status(400).send('You must confirm the captcha!')
    }

    sgMail.setApiKey(sendgridApiKey);

    const html = `<h2>The craic mate: ${subject}</h2>
        <p>Good person's name: ${name}</p>
        <p>How can you reach: ${email}</p>
        <h3>Sweet message below</h3>
        <div>${message}</div>`;

    const content = {
        to: strubloidMail,
        from: strubloidGmail,
        subject: subject,
        text: message,
        html: html
    }

    try {
        await sgMail.send(content)
        res.status(200).send('Message sent successfully.')
    } catch (error) {
        res.status(400).send('Message not sent.')
    }

};

export default Send;