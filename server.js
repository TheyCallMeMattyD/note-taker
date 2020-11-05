// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// creating the Express server
const app = express();
const PORT = process.env.PORT || 8000;

let notesData = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));

// api call response for all the notes, and sends the results to the browser as an array of object
app.get("/api/notes", function(err, res) {
    try {
        // reads the notes from json file
        notesData = fs.readFileSync("Develop/db/db.json", "utf8");
        console.log("hello!");
        // parse it so notesData is an array of objects
        notesData = JSON.parse(notesData);

        // error handling
    } catch (err) {
        console.log("\n error (in app.get.catch):");
        console.log(err);
    }
    //   send objects to the browser
    res.json(notesData);
});

// writes the new note to the json file
app.post("/api/notes", function(req, res) {
    try {
        // reads the json file
        notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
        console.log(notesData);

        // parse the data to get an array of objects
        notesData = JSON.parse(notesData);
        req.body.id = notesData.length;
        // add the new note
        notesData.push(req.body);
        notesData = JSON.stringify(notesData);
        // writes the new note to file
        fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {

            if (err) throw err;
        });
        // change it back to an array of objects & send it back to the browser(client)
        res.json(JSON.parse(notesData));

    } catch (err) {
        throw err;
        console.error(err);
    }
});

// Delete a note
app.delete("/api/notes/:id", function(req, res) {
    try {
        //  Read the note file
        notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
        notesData = JSON.parse(notesData);
        // Delete the note
        notesData = notesData.filter(function(note) {
            return note.id != req.params.id;
        });

        notesData = JSON.stringify(notesData);
        fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {

            if (err) throw err;
        });

        // change it back to an array of objects & send it back to the browser (client)
        res.send(JSON.parse(notesData));

    } catch (err) {
        throw err;
        console.log(err);
    }
});

// HTML GET Requests

// Location of where to look for notes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

// And if none are found go here
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/api/notes", function(req, res) {
    return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
});

// Start listening on the defined port
app.listen(PORT, function() {
    console.log("SERVER IS LISTENING: " + PORT);
});