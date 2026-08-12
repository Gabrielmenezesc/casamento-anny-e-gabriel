const https = require('https');

function createBlob(data, name) {
  const payload = JSON.stringify(data);
  const options = {
    hostname: 'jsonblob.com',
    path: '/api/jsonBlob',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json'
    }
  };

  const req = https.request(options, res => {
    console.log(name + ' ID: ' + res.headers.location);
  });

  req.on('error', e => {
    console.error(name + ' Error: ' + e);
  });

  req.write(payload);
  req.end();
}

createBlob([], 'RSVPS');
createBlob([], 'GIFTS');
createBlob([], 'GODPARENTS');
createBlob({ goal: 25000, currentAmount: 0 }, 'SETTINGS');
