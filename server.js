// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid/v1");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;
const mainDir = path.join(__dirname, "/public");

// Sets up the Express app to handle data parsing
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes to HTML Files
app.get("/", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

// Routes to GET, POST and DELETE notes 
app.get("/api/notes", function(req, res) {
    let savedNotes = require("./db/db.json");
    res.json(savedNotes);
});

app.post("/api/notes", function(req, res) {
    let savedNotes = require("./db/db.json");

    console.log(savedNotes);

    // User input for new note object
    let newNote = req.body;
    console.log(newNote);

    // Adds unique id to saved notes
    newNote.id = uuid();

    savedNotes.push(newNote);

    savedNotes = JSON.stringify(savedNotes);

    // create writeFile function to save new notes  
    fs.writeFile("./db/db.json", savedNotes, "utf8", (err) => {
        if (err) throw err;
        console.log("New Note written to file");

        res.json(JSON.parse(savedNotes));
    });

});

app.delete("/api/notes/:id", function(req, res) {
    let id = req.params.id;
    console.log(id);

    let savedNotes = require("./db/db.json");

    for (let i = 0; i < savedNotes.length; i++) {
        if (id === savedNotes[i].id) {
            savedNotes.splice(i, 1);
            console.log(savedNotes);
        }
    }

    savedNotes = JSON.stringify(savedNotes);

    // create writeFile function to save new array of saved notes  
    fs.writeFile("./db/db.json", savedNotes, "utf8", (err) => {
        if (err) throw err;
        console.log("Note deleted from file");
    });

    res.send(JSON.parse(savedNotes));

});

// Route to home page if any other route entered
app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log(`App is listening on http://localhost:${PORT}`);
});