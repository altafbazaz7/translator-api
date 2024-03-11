const http = require('http');
const translate = require('translate-google')

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                translate(data.text, {to: 'fr'}).then(translatedText => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ translated: translatedText }));
                }).catch(err => {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                });
            } catch (error) {
                console.error('Error occurred during translation:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: 'Translator' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
