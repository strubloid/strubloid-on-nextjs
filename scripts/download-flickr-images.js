// Downloads Flickr images to /public/img/flickr if not present
const fs = require('fs');
const path = require('path');
const https = require('https');

const flickrData = require('../data/flickr.json');
const destDir = path.join(__dirname, '../public/img/flickr');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      fs.unlink(dest, () => {});
      cb(new Error(`Failed to get '${url}' (${response.statusCode})`));
      return;
    }
    response.pipe(file);
    file.on('finish', () => file.close(cb));
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    cb(err);
  });
}

(async () => {
  for (const photo of flickrData.photos) {
    const url = photo.url_z;
    const fileName = `${photo.id}.jpg`;
    const dest = path.join(destDir, fileName);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading ${url} -> ${fileName}`);
      await new Promise((resolve, reject) => {
        download(url, dest, (err) => {
          if (err) {
            console.error(`Failed: ${url}`);
            resolve(); // skip on error
          } else {
            resolve();
          }
        });
      });
    } else {
      console.log(`Exists: ${fileName}`);
    }
  }
  console.log('Done.');
})();
