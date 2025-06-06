
const http = require('http');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    const filePath = path.join(uploadsDir, `compressed-${Date.now()}.jpg`);
    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File saved!');
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
