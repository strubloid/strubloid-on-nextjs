const fs = require('fs')

const keys = [
    `GOOGLE_KEY=${process.env.GOOGLE_KEY}\n`,
    `MONGO_URI=${process.env.MONGO_URI}\n`,
    `SERVER_URL=${process.env.SERVER_URL}\n`,
]

const lineToWrite = keys.join('');
// console.log(lineToWrite)

fs.writeFileSync('./.env', `${lineToWrite}`)


