// Dependencies
const express = require('express');
// const path = require('path');
// const fs = require('fs');
const PORT = process.env.PORT || 3001;

//Testing, not really needed here
const dbJson = require('./db/db.json')

// Sets up the Express App
const app = express();

//Accesses public file mainly for proper CSS loading
app.use(express.static(__dirname + '/public'));
app.use(express.static('./'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Require the Routes.js files in order to communicate when to generate api routes and html files
require("./apiRoutes")(app);
require("./htmlRoutes")(app);


// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});