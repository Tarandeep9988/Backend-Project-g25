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

        if (!body.username || !body.password || !body.dob) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({message: 'Invalid INPUT'}));
        }

        saveData(body, (err) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error saving data' }));
                
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Registration successfull' }));
        });
    }
    else if (req.url == '/registrations' && req.method == 'GET') {
        try {
            const data = await getData();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);  // Send the file data as the response
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error'); 
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = { handleRoutes };