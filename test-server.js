import http from 'http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('MRadio test server running!\n');
});

server.listen(9126, '127.0.0.1', () => {
  console.log('Test server running at http://127.0.0.1:9126/');
});