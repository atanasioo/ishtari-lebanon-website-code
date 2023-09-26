const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const next = require('next');
const ssgManifest = require('./.next/static/AanfiBvTONjxvzuhjP9Q8/_ssgManifest.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const requestedPath = parsedUrl.pathname;

    // Serve _ssgManifest.js file
    if (requestedPath === '/_next/static/AanfiBvTONjxvzuhjP9Q8/_ssgManifest.js') {
      res.setHeader('Cache-Control', 'public, max-age=3600'); 
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(ssgManifest));
      return;
    }

    // Serve static files directly if found
    const filePath = path.join(__dirname, requestedPath);
    fs.readFile(filePath, (err, data) => {
      if (!err && data) {
        const contentType = getContentType(filePath);
        res.setHeader('Content-Type', contentType);
        res.writeHead(200);
        res.end(data);
      } else {
        // If file not found, handle with Next.js
        handle(req, res, parsedUrl);
      }
    });
  }).listen(process.env.PORT, (err) => {
    if (err) throw err;
  });
});

// Implement this function to determine content type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);

  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    // Add more cases for other file types as needed
    default:
      return 'application/octet-stream'; // Default to binary data
  }
}

