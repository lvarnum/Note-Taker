// --- Import Dependecies ---
const express = require("express");
const path = require("path");
const fs = require("fs");

// --- Set up the Express app ---
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// --- HTML Route ---
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// --- API Routes ---
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        var parsedData = JSON.parse(data);
        res.json(parsedData);
    });
});

app.post('/api/notes/', (req, res) => {
    var newNote = req.body;
    var newData;
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        var parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedData), err => {
            if (err) throw err;
        })
    });
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        var parsedData = JSON.parse(data);
        for (var i = 0; i < parsedData.length; i++) {
            if (parsedData[i].id === req.params.id) {
                parsedData.splice(i, 1);
            }
        }
        fs.writeFile('./db/db.json', JSON.stringify(parsedData), err => {
            if (err) throw err;
            res.json(parsedData);
        });
    });
});

// --- Default Route ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// --- Start the Server ---
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

