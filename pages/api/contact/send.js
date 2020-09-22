const sgMail = require('@sendgrid/mail')

export default async (req, res) => {

    const {name, email, subject, message} = req.body
    const to = process.env.EMAIL;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    // console.log(email);
    // console.log(sendgridApiKey);

    sgMail.setApiKey(sendgridApiKey);
    const html = `<h3>${subject}</h3><p>F: ${name}</p>
    <p>E: ${email}</p><div>${message}</div>`;

    const content = {
        to: to,
        from: email,
        subject: subject,
        text: message,
        html: html
    }

    try {
        await sgMail.send(content)
        res.status(200).send('Message sent successfully.')
    } catch (error) {
        // console.log('ERROR', error)
        // res.status(400).send('Message not sent.')
        res.status(400).send(error)
    }
}