const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const ssgManifest = require('./.next/static/AanfiBvTONjxvzuhjP9Q8/_ssgManifest.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
   // console.log("resss is");
   // console.log(res);

    // Serve _ssgManifest.js file
    if (parsedUrl.pathname === '/_next/static/AanfiBvTONjxvzuhjP9Q8/_ssgManifest.js') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200); // Set the status code
      res.end(JSON.stringify(ssgManifest));
      return;
    }

    handle(req, res, parsedUrl);
  }).listen(process.env.PORT, (err) => {
    if (err) throw err;
    // console.log('> Ready on http://localhost:' + 3002);
  });
});
