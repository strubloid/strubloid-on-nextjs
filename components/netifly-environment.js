const fs = require('fs')

// Keys array to populate on live
const keys = [
    `GOOGLE_KEY=${process.env.GOOGLE_KEY}\n`,
    `MONGO_URI=${process.env.MONGO_URI}\n`,
    `SERVER_URL=${process.env.SERVER_URL}\n`,
    `SITE_RECAPTCHA_KEY=${process.env.SITE_RECAPTCHA_KEY}\n`,
    `SITE_RECAPTCHA_SECRET=${process.env.SITE_RECAPTCHA_SECRET}\n`,
    `SENDGRID_API_KEY=${process.env.SENDGRID_API_KEY}\n`,
    `EMAIL=${process.env.EMAIL}\n`,
]

// Tranforming into a string
const lineToWrite = keys.join('');

// creating the .env file
fs.writeFileSync('./.env', `${lineToWrite}`)
