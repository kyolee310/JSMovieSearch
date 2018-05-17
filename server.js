var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser'); // Missed the module 'body-parser' -- Kyo

app.use(express.static(path.join(__dirname, '/public'))); 
app.use(bodyParser.urlencoded({extended: false})); // Missed ; at the end of the line -- Kyo
app.use(bodyParser.json());

// Missed ) at the end of the function -- Kyo 
app.use('/', express.static(path.join(__dirname, 'public')));

// This function creates env.js that loads the necessary environment variables
// for the client side JavaScript when running on Heroku.
app.get('/herokuenv.js', function(req, res){
    res.send("var OMDB_APIKEY='"+process.env.OMDB_APIKEY+"';");
});

// Missed }) at the end of the function -- Kyo
// This function handles the GET request on the endpoint /favorites,
// which return the user's favorite movies list.
app.get('/favorites', function(req, res) {
    var data = fs.readFileSync('./data.json');
    // Needed to adjust the header of the response to bypass the No 'Access-Control-Allow-Origin' error -- Kyo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});

// Missed } for the function (){}.
// This method needs to be POST, not GET.
// Missed '/' in the route argument.
// -- Kyo
// This function handles the POST request on the endpoint /favorites,
// which add a new movie to the user's favorite movies list.
app.post('/favorites', function(req, res) {
    // Needed to adjust the header of the response to bypass the No 'Access-Control-Allow-Origin' error -- Kyo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    // Misplaced the closing parenthesis } -- Kyo
    // If the request does not have the parameter name or oid, reject the request.
    if (!req.body.name || !req.body.oid) {
        // Needed to provide more detail in the error message -- Kyo
        res.send("Error: Missing the attribute 'name' or 'oid'");
        // Missed ; at the end of the line -- Kyo
        return;
    }
    // Read the data from the file that contains the user's favorite movies list.
    var data = JSON.parse(fs.readFileSync('./data.json'));
    // Check if the data from the file has a valid data format.
    // If not, initialize the data object.
    // This condition also handles the case of the fresh start of the server, which begins with empty data. 
    if (!data.hasOwnProperty('oid')) {
        data = {};
        data.name = req.body.name;
        data.oid = req.body.oid;
        data.favorites = [];
    }
    // Parse the data from the request into JSON
    var newFavorite = JSON.parse(req.body.data);
    // Validate the parsed data 
    if (newFavorite.hasOwnProperty('imdbID')) {
        // If the data is valid, push the new movie into the user's favorite movies list.
        data.favorites.push(newFavorite);
    } else {
        // If the data is not valid, return an error message.
        res.send("Error: Invalid Data Received");
        return;
    }
    // Write the data back to the file.
    fs.writeFile('./data.json', JSON.stringify(data));
    // Return the latest data that represents the user's favorite movies list.
    res.send(data);
});

// This function/endpoint handles the request that removes a movie from the user's favorite movies list.
app.post('/favorites/remove', function(req, res) {
    // Needed to adjust the header of the response to bypass the No 'Access-Control-Allow-Origin' error. 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    // If the request does not have the parameter name or oid, reject the request.
    if (!req.body.name || !req.body.oid) {
        res.send("Error: Missing the attribute 'name' or 'oid'");
        return;
    }
    // Read the data from the file that contains the user's favorite movies list.
    var data = JSON.parse(fs.readFileSync('./data.json'));
    // Validate the parsed data 
    if (data.hasOwnProperty('favorites')) {
        // Get the imdbID from the request data
        var imdbID = req.body.data;
        // Start with an empty array
        var newList = [];
        // Loop through the user's favorite movies list and insert the movies into newList,
        // except the movie whose imdbID matches the imdbID from the request.
        // As a result, the movie with the matching imdbID is removed from the list.
        for (var i = 0; i < data.favorites.length; i++) {
            if (data.favorites[i].imdbID !== imdbID) {
                newList.push(data.favorites[i]);
            }
        }
        // Update the data's favorites object with the newly created list.
        data.favorites = newList;
    }
    // Write the data back to the file.
    fs.writeFile('./data.json', JSON.stringify(data));
    // Return the latest data that represents the user's favorite movies list.
    res.send(data);
});

// Had the incorect function name app.list(), which needed to be app.listen() -- Kyo
// process.env.PORT is added to work on Heroku
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log("Listening on port " + port);
});
