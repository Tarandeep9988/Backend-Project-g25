const http = require('http');
const { handleRoutes } = require('./routes');

const server = http.createServer((req, res) => {
    handleRoutes(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});