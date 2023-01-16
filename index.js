const http = require('http');

const PORT = 3000;

const server = http.createServer();

const friends = [
  {
    id: 1,
    name: 'Isaac Netero',
  },
  {
    id: 2,
    name: 'Meruem',
  },
  {
    id: 3,
    name: 'Gon Freecss',
  },
];

server.on('request', (req, res) => {
  const items = req.url.split('/');

  if (req.method === 'POST' && items[1] === 'friends') {
    req.on('data', (data) => {
      const friendStr = data.toString();
      console.log('Request:', friendStr);
      const friend = JSON.parse(friendStr);
      friends.push(friend); 
    });
    req.pipe(res);
  } else if (req.method === 'GET' && items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    let data = friends;
    if (items.length === 3) {
      data = friends.find((f) => f.id === Number(items[2]));
    }

    res.end(JSON.stringify(data));
  } else if (req.method === 'GET' && items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li>Hey Netero, how is your Nen work going?</li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
