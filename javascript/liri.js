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

// ACTION REQUESTS
// concert-this axios request
function concertThis() {
    var search = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
    axios
        .get(search)
        .then(function(response) {
            console.log("Upcoming Shows:\n--------------------\n--------------------")
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
                console.log("Tracks on Spotify:")
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