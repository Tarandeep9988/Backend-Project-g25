const http = require('http');
const { handleRoutes } = require('./routes');
const { Console } = require('console');

const server = http.createServer((req, res) => {
    handleRoutes(req, res);
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});