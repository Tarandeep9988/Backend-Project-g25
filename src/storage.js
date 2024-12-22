const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

const saveData = async (data) => {
    try {
        const fileData = await fs.readFile(filePath, 'utf8');
        const jsonData = fileData.trim() ? JSON.parse(fileData) : [];
        jsonData.push(data);
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    } catch (e) {
        throw e; 
    }
};


const getData = async () => {
    try {
        const fileData = await fs.readFile(filePath, 'utf8');
        return fileData;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
module.exports = { saveData, getData };