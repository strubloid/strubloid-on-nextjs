const fs = require('fs');

// Keys array to populate on live
const keys = [
  `NEXT_PUBLIC_GOOGLE_KEY=${process.env.NEXT_PUBLIC_GOOGLE_KEY}\n`,
  `NEXT_PUBLIC_MONGO_URI=${process.env.NEXT_PUBLIC_MONGO_URI}\n`,
  `NEXT_PUBLIC_SERVER_URL=${process.env.NEXT_PUBLIC_SERVER_URL}\n`,
  `NEXT_PUBLIC_SITE_RECAPTCHA_KEY=${process.env.NEXT_PUBLIC_SITE_RECAPTCHA_KEY}\n`,
  `NEXT_PUBLIC_SITE_RECAPTCHA_SECRET=${process.env.NEXT_PUBLIC_SITE_RECAPTCHA_SECRET}\n`,
  `NEXT_PUBLIC_RESEND_API_KEY=${process.env.NEXT_PUBLIC_RESEND_API_KEY}\n`,
  `NEXT_PUBLIC_GMAIL=${process.env.NEXT_PUBLIC_GMAIL}\n`,
  `NEXT_PUBLIC_MAIL=${process.env.NEXT_PUBLIC_MAIL}\n`,
]

// Tranforming into a string
const lineToWrite = keys.join('');

// creating the .env file
fs.writeFileSync('./.env', `${lineToWrite}`)
