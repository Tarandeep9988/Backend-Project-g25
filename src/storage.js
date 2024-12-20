const { log } = require('console');
const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

const saveData = (data, callback) => {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        const jsonData = fileData ? JSON.parse(fileData) : [];
        jsonData.push(data);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), callback );
    });
};


const getData = async () => {
    try {
        const fileData = await fsPromise.readFile(filePath, 'utf8');
        return fileData;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
module.exports = { saveData, getData };