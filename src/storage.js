const fs = require('fs');
const path = require('path');
const { callbackify } = require('util');

const filePath = path.join(__dirname, 'data.json');

const saveData = (data, callback) => {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        const jsonData = fileData ? JSON.parse(fileData) : [];
        jsonData.push(data);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), callback );
    });
};

module.exports = { saveData };