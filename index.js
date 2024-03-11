const http = require('http');
const { translate } = require('free-translate');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                let data = JSON.parse(body)
                if (!data.text) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Text to translate is missing in request body' }));
                    return;
                }


                const translatedText = await translate(data.text, { from: 'en', to: 'fr' });


                res.end(JSON.stringify({ translation: translatedText }));

            } catch (error) {
                console.error('Error occurred during translation:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
