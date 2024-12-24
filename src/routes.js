const { saveData, getData } = require('./storage');
const { parseRequestBody } = require('./utils');
const fs = require('fs');
const path = require('path');

const handleRoutes = async (req, res) => {    
    if (req.url == '/' && req.method == 'GET') {
        const filePath = path.join(__dirname, 'frontend/index.html');
        fs.readFile(filePath, (err, content) => {
            if(err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } 
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        })
    }
    else if (req.url == '/style.css' && req.method == 'GET') {
        const filePath = path.join(__dirname, 'frontend/style.css');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(content);
            }
        })
    }
    else if(req.url == '/script.js' && req.method == 'GET') {
        const filePath = path.join(__dirname, 'frontend/script.js');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/js' });
                res.end(content);
            }
        })
    }
    else if (req.url == '/register' && req.method == 'POST') {
        const body = await parseRequestBody(req);
        for (const value of Object.values(body)) {
            if (value.trim() == "") {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({message: 'Invalid INPUT'}));
            }
        }

        saveData(body)
        .then(() => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Registration successfull' }));
        })
        .catch((e) => {
            console.log("Error saving data:", e);
            res.writeHead(500, {'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error saving data' }));
        });

    }
    else if (req.url == '/registrations' && req.method == 'GET') {
        const filePath = path.join(__dirname, 'frontend/registrations.html');
        fs.readFile(filePath, (err, content) => {
            if(err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } 
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
    else if (req.url == '/registrations/data' && req.method == 'GET') {
        getData()
        .then((content) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(content);
        })
        .catch((e) => {
            console.log(e);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Data not found');
        })
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = { handleRoutes };