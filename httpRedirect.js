const http = require('http');

const express = require('express');

module.exports = () => {
    const app = express();
    app.get('*', (request, response) => {
        response.redirect('https://' + request.headers.host + request.url);
    });

    const httpServer = http.createServer(app);

    httpServer.listen(8000, () => {
        console.log('HTTP Server running on port 80');
    });
}