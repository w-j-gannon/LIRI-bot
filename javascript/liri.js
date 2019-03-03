//LIRI-APP
// dotenv for environment variables
require("dotenv").config();

// spotify
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// other dependancies
const axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// node user arguments
var action = process.argv[2];
var query = process.argv.slice(3).join("+");

// switch case to determine action
function userQuery() {
    switch (action) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhat();
            break;
        default:
            console.log("Invalid command");
    };
};

userQuery();

// ACTION REQUESTS
// concert-this axios request
function concertThis() {
    var search = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
    axios
        .get(search)
        .then(function(response) {
            console.log("\nUpcoming Shows:\n--------------------\n--------------------")
            for (i = 1; i < response.data.length; i++) {
                var venue = response.data[i].venue.name;
                var city = response.data[i].venue.city;
                var date = moment(response.data[i].datetime).format("MMMM Do YYYY, h:mm a");
                console.log("Show #" + i);
                console.log("Venue: " + venue);
                console.log("City: " + city);
                console.log("Date: " + date + "\n--------------------\n");
            }
        })
        .catch(function(error) {
            console.log("Error: " + error);
        });
};

// spotify-this
function spotifyThis(){
    if (query){
        spotify.search({ 
            type: 'track', 
            query: query
        }, function(err, response) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // if there is a response array greater than 0
            if (response.tracks.items.length > 0){
                console.log("\nTracks on Spotify:")
                response.tracks.items.forEach(function(spot){
                    console.log("--------------------------\n");
                    console.log(spot.name);
                    console.log(spot.album.artists[0].name);
                    console.log(spot.album.name);
                    console.log(spot.external_urls.spotify);
                });
            // if 0 responses, show the sign
            } else {
                spotifyThis("The Sign, Ace of Base");
            }
        });
    // if no query entered, show the sign
    } else {
        spotifyThis("The Sign, Ace of Base");
    }
};

// OMDB - movie-this
function movieThis() {
    // if a title is entered, query the api
    if (query) {
        // search omdb with axios
        axios
            .get("https://www.omdbapi.com/?t="+ query +"&y=&plot=short&apikey=trilogy")
            .then(function (response) {
                //if a response comes back
                if (response) {
                    console.log("\nOMDB Movie Info:\n")
                    console.log("--------------------------\n");
                    console.log("Title: " + response.data.Title);
                    console.log("Release Year: " + response.data.Year);
                    console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                    console.log("Country: "+response.data.Country);
                    console.log("Language: " + response.data.Language);
                    console.log("Plot Summary: " + response.data.Plot);
                    console.log("Cast: " + response.data.Actors);
                    console.log("\n--------------------------\n");   
                } else {
                    movieThis("Big");
                }
            })
                // catch/log any errors
                .catch(function (error) {
                    console.log(error);
                });
    } else {
        movieThis("Big");
    }
};

// do what it says
function doWhat() {
    fs.readFile("./../random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        };

        console.log("\nQuery from text file: " + data);

        var info = data.split(",");

        action = info[0].trim().toString();

        query = info[1].trim();
        
        userQuery()

    })
};