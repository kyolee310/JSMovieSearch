//========================
// ENVIRONMENT VARIABLES
//========================

// Import the environment variables loaded from config.js.
var config = window.myConfig || {};

// Retrieve Heroku environment variables
if (!config.omdb_apikey) {
    config.omdb_apikey = OMDB_APIKEY;
}
// Validate the environment variables such as OMDb API key and the URL of NodeJS server.
if (!config.omdb_apikey) {
    document.getElementById("error-div").innerHTML += "Error: Missing 'omdb_apikey' in configuration file.<br>";
}

//===================
// GLOBAL VARIABLES
//===================

// Create a user object
// For the scope of this assignment, the application assumes only one user and the user's information is hardcoded.
var user = {
    name: 'user01',
    oid: '12345678'
};

// The array movieData holds a list of the movies returned from the search request.
var movieData = [];
// This array favoritesData holds a list of the movies that are selected as favorite by the user.
var favoritesData = [];

//=======================
// EVENT LISTENER SETUP
//=======================

// Send a request to search movies when the search button is clicked.
document
    .getElementById("search-by-title-button")
    .addEventListener("click", function() {
        searchMovies();
    });

// Send a request to search movies when the user presses the enter key on the search input text box.
document
    .getElementById("movie-title-input")
    .addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // key 13 mean an enter key is pressed.
            searchMovies();
        }
    });

// Send a request to search movies when any change is detected on the search input text box.
document
    .getElementById("movie-title-input")
    .addEventListener('change', function() {
        searchMovies();
    });

// Reset the search result display div element when the reset button is clicked.
document
    .getElementById("reset-button")
    .addEventListener("click", function() {
        document.getElementById("response-div").innerHTML = "";
    });

// Send a request to retrieve the user's favorite movies when the show favorites link is clicked.
// Also display the returned data on the screen.
document
    .getElementById("show-favorites-button")
    .addEventListener("click", function() {
        // When the parameter for getFavorites() is true, it means to display the result on the screen.
        getFavorites(true);
    });

// Retieve the user's favorite movies when the web application is loaded.
// This initial load of the user's favorite movies is needed for the application
// to detect which movies have already been selected as favorites.
window
    .onload = function() {
        // When the parameter for getFavorites() is false,
        // it means to retrieve the data but do not refresh the screen to display the result. 
        getFavorites(false);
    };

//========================
// API REQUEST FUNCTIONS
//========================

// Make an asynchronous call to request the movie search by title
var searchMovies = function() {
    var xhr = new XMLHttpRequest();
    // Retieve the movie title from the search input text box.
    var movieTitle = encodeURI(document.getElementById('movie-title-input').value);
    // If no movie title is entered into the input box, display the error message and cancel the request.
    if (!movieTitle) {
        document.getElementById("response-div").innerHTML = "Enter a movie title.";
        return;
    }
    // Construct the request URL for the API call
    var url = "https://www.omdbapi.com/?apikey=" + config.omdb_apikey + "&s=" + movieTitle;
    xhr.open("GET", url, true);
    // Assign a callback function that handles the response from this call.
    xhr.onreadystatechange = function() {
        handleMovieListResponse(xhr);
    };
    // Send the request.
    xhr.send(null);
};

// Make an asynchronous call to request the detailed description of a selected movie,
// which is identified by its imdbID
var getMovieDetailById = function(imdbID) {
    var xhr = new XMLHttpRequest();
    // Construct the URL for the API call
    var url = "https://www.omdbapi.com/?apikey=" + config.omdb_apikey + "&i=" + imdbID;
    xhr.open("GET", url, true);
    // Assign a callback function that handles the response from this call.
    xhr.onreadystatechange = function() {
        handleMovieDetailResponse(xhr);
    };
    // Send the request
    xhr.send(null);
};

// Make an asynchronous call to request a list of the favorite movies selected by the user
// If the argument isDisplayed is true,
// the list of the movies displayed on the screen needs to be refreshed with the newly received data.
var getFavorites = function(isDisplayed) {
    var xhr = new XMLHttpRequest();
    // Construct the URL for the API call, which will go to the NodeJS backend server.
    var url = "/favorites";
    xhr.open("GET", url, true);
    // Assign a callback function that handles the response from this call.
    // Notice that the parameter isDisplayed is directly relayed to the second parameter of the callback function.
    xhr.onreadystatechange = function() {
        handleFavoritesResponse(xhr, isDisplayed);
    };
    // Send the request
    xhr.send(null);
};

// Make an asynchronous call to request a new movie to be added to the user's favorite movies list.
// This function takes the imdbID of a movie as a parameter.
// Using the imdbID, the function retrieves the detail of the movie,
// and it included the movie's detail in the body of the POST request. 
var informNewFavorite = function(imdbID) {
    var xhr = new XMLHttpRequest();
    // Construct the URL for the API call, which points to the NodeJS backend server.
    var url = "/favorites";
    // Retieve the detail of the movie using its imdbID
    var thisMovie = getMovieDataById(imdbID);
    // Validate the movie detail data. In case of error, cancel the request.
    if (!thisMovie) {
        console.log("Error: Cannot find the movie " + imdbID);
        return;
    }
    // Notice that a POST request is made here, not GET.
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Assign a callback function that handles the response from this call.
    // Notice the parameter is set to false.
    // This setup means we ask the app to not refresh the view
    // when the request is completed.
    // This setup prevents the view from suddenly jumping to display the favorite movie list
    // when a new movie is selected as favorite.
    xhr.onreadystatechange = function() {
        handleFavoritesResponse(xhr, false);
    };
    // Construct the POST message and send the request.
    // Include to the user's information in the message.
    xhr.send("name=" + user.name + "&oid=" + user.oid + "&data=" + JSON.stringify(thisMovie));
};

// Make an asynchronous call to request a new movie to be removed the user's favorite movies list.
// This function takes the imdbID of a movie as a parameter to inform the backend server which movie to be removed. 
var informRemoveFavorite = function(imdbID) {
    var xhr = new XMLHttpRequest();
    // Construct the URL for the API call. Notice the additional path needed for the removal operation.
    var url = "/favorites/remove";
    // Set up a POST request
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Assign a callback function that handles the response from this call.
    // Notice the parameter is set to false.
    // This setup means we ask the app to not refresh the view
    // when the request is completed.
    // This setup keeps the deselected movie to remain on the screen,
    // instead of having it disappeared once deselected.
    xhr.onreadystatechange = function() {
        handleFavoritesResponse(xhr, false);
    };
    // Construct the POST message and send the request.
    // Include the user's information in the message.
    xhr.send("name=" + user.name + "&oid=" + user.oid + "&data=" + imdbID);
};

//=================================
// API RESPONSE HANDLER FUNCTIONS
//=================================

// This API response handler function retrieves a list of the movies that are returned from the search by title request.
var handleMovieListResponse = function(xhr) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var rawdata = JSON.parse(xhr.responseText);
            // Make sure that the response contains the object Search.
            if (rawdata.hasOwnProperty('Search')) {
                // Extract only the object Search from the response,
                // and save it to the global array movieData
                movieData = rawdata.Search;
            } else {
                // In case of malformed data, clear the list.
                movieData = [];
            }
            // Update the screen with the new list.
            displayMovieList(movieData);
        } else {
            // In case of error, display the error message on the screen.
            document.getElementById("response-div").innerHTML =
                "Movie List Request Status: " + xhr.status;
        }
    }
};

// This API response handler function retrieves the detailed description of a movie.
var handleMovieDetailResponse = function(xhr) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // Receive the movie detail and parse the data into JSON.
            var movieDetail = JSON.parse(xhr.responseText);
            // Display the movie detail on the screen.
            displayMovieDetail(movieDetail);
        } else {
            // In case of error, display the error message on the screen.
            document.getElementById("response-div").innerHTML =
                "Movie Detail Request Status: " + xhr.status;
        }
    }
};

// This API response handler function retrieves the user's favorite movies list.
// If the parameter toDisplay is true, the function refreshes the display on the screen.
var handleFavoritesResponse = function(xhr, toDisplay) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // Receive the favorite movies list and parse the data into JSON.
            var rawdata = JSON.parse(xhr.responseText);
            // Validate the data
            if (rawdata.hasOwnProperty('favorites')) {
                // Update the global array favoritesData with the new list.
                // However, reverse the order so that the newest favorite movies show up at the top of the list.
                favoritesData = rawdata.favorites.reverse();
            }
            // If the parameter toRefresh is true, refresh the screen.
            if (toDisplay) {
                // Duplicate the global array favoritesData to movieData
                // before switching the screen to display the user's favorite moves list
                // This setup allows the data of the movies that are displayed on the screen
                // to be preserved while the user freely adds and removes the movies from favoritesData. 
                movieData = favoritesData;
                // Display the new favorite movies list on the screen.
                displayMovieList(favoritesData);
            }
        } else {
            // In case of error, display the error message on the screen.
            document.getElementById("response-div").innerHTML =
                "Favorites Request Status: " + xhr.status;
            // If the status is 404, it means likely there is no backend server running.
            if (xhr.status === 404) {
                document.getElementById("response-div").innerHTML +=
                    " -- Check your server configuration and make sure that the server is running.";
            }
        }
    }
};

//==================================
// VIEW MODIFIER FUNCTIONS
//==================================

// This function adds a series of the div elements to the response-div element.
// Each of the div elements contains a movie title and two buttons: Show and Favorite.
// Each of the div elements is identifiable by its movie's imdbID, which is used as part of the element's id.  
var displayMovieList = function(movieList) {
    var str = "";
    // Loop through all the movies in the list, which is passed in as a parameter
    for (var i = 0; i < movieList.length; i++) {
        var item = movieList[i];
        // Construct the div element for this movie
        str += '<div class="movie-title-div" id="movie-title-display-div-' + item.imdbID + '">';
        str += '<div class="row">';
        str += '<div class="col-sm-9">';
        str += '<span class="movie-title-span">';
        str += item.Title + " ";
        str += "(" + item.Year + ") ";
        str += '</span>';
        str += '</div>';
        str += '<div class="col-sm-3 buttons-div">';
        // Add the Show button, which is mapped to the function detailButtonClicked().
        str += '<span class="show-button-span">';
        str +=
            '<button class="btn-sm btn-primary" id="detail-button-' + item.imdbID +
            '" onclick="detailButtonClicked(\'' + item.imdbID +
            '\')">Show</button>';
        str += '</span>';
        // Add the Favorite button, which is mapped to the function favoriteButtonClicked().
        str += '<span class="favorite-button-span">';
        // Check if the movie is already included in the user's favorite movies list.
        if (!isAlreadyFavorite(item.imdbID)) {
            // If the movie is not already in the user's favorite movies list,
            // use the class btn-light to make the button displayed in white background.
            str +=
                '<button class="btn-sm btn-light" id="fav-button-' + item.imdbID +
                '" onclick="favoriteButtonClicked(\'' + item.imdbID +
                '\')">' +
                'Favorite ' +
                '<span><i class="cr-icon glyphicon glyphicon-star-empty"></i></span>' +
                '</button>';
        } else {
            // If the movie is already in the user's favorite movies list,
            // use the class btn-warning to make the button displayed in yellow background.
            str +=
                '<button class="btn-sm btn-warning" id="fav-button-' + item.imdbID +
                '" onclick="favoriteButtonClicked(\'' + item.imdbID +
                '\')">' +
                'Favorite ' +
                '<span><i class="cr-icon glyphicon glyphicon-star"></i></span>' +
                '</button>';
        }
        str += '</span>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        // Add an empty div element, which is to be used to display the detailed description of the movie
        str += '<div class="movie-detail" id="movie-detail-display-div-' + item.imdbID + '"></div>';
    }
    // if there are no movies in the list, display a message on the screen.
    if (movieList.length === 0) {
        str = "No items are found.";
    }
    // Finally, attach the series of the div elements to the response-div element
    document.getElementById("response-div").innerHTML = str;
};

// Create a div element that displays the detailed description of a movie.
// This function takes the object that contains the detail description of a movie in JSON format,
// which comes directly from the search by imdbID API call to the OMDb site.
var displayMovieDetail = function(movieDetail) {
    // Add the poster on the left div element and the description on the right div element.
    document.getElementById("movie-detail-display-div-" + movieDetail.imdbID).innerHTML =
        '<div class="row">' +
        '<div class="col-sm-4 movie-poster">' +
        '<img src="' + movieDetail.Poster + '">' +
        '</div>' +
        '<div class="col-sm-8 movie-description">' +
        '<label>Title:</label> ' + movieDetail.Title + '<br>' +
        '<label>Year:</label> ' + movieDetail.Year + '<br>' +
        '<label>Rated:</label> ' + movieDetail.Rated + '<br>' +
        '<label>Released:</label> ' + movieDetail.Released + '<br>' +
        '<label>Runtime:</label> ' + movieDetail.Runtime + '<br>' +
        '<label>Genre:</label> ' + movieDetail.Genre + '<br>' +
        '<label>Director:</label> ' + movieDetail.Director + '<br>' +
        '<label>Actors:</label> ' + movieDetail.Actors + '<br>' +
        '<label>Plot:</label> ' + movieDetail.Plot + '<br>' +
        '<label>Language:</label> ' + movieDetail.Language + '<br>' +
        '<label>Country:</label> ' + movieDetail.Country + '<br>' +
        '<label>imdbRating:</label> ' + movieDetail.imdbRating + '<br>' +
        '</div>' +
        '</div>';
};

// This function is called when the Show button is clicked.
// The state of the display is determined by the class
// that the button has at the time when the button is clicked.
// For instance, if the button has btn-primary class, then it means the button hasn't been clicked.
// Once the button is clicked, the class btn-primary is removed and the class btn-info is added,
// which marks that the movie's detailed description div is currently in display.
var detailButtonClicked = function(imdbID) {
    // Locate the button object using imdbID
    var thisButton = document.getElementById("detail-button-" + imdbID);
    // If the button has the class btn-primary, it means the button hasn't been clicked.
    if (thisButton.className.indexOf('btn-primary') > -1) {
        // Remove the class btn-primary and add the class btn-info to indicate the button is currently clicked.
        thisButton.classList.remove("btn-primary");
        thisButton.classList.add("btn-info");
        // Make the API request to obtain the movie's detailed description
        getMovieDetailById(imdbID);
    } else {
        // Remove the class btn-info and add the class btn-primary to indicate the button is unclicked.
        thisButton.classList.remove("btn-info");
        thisButton.classList.add("btn-primary");
        // Remove the content in the detailed description div.
        document.getElementById("movie-detail-display-div-" + imdbID).innerHTML = "";
    }
};

// This function is called when the Favorite button is clicked.
// If the button has the class btn-light, then it means the movie is not currently included
// in the user's favorite movies list; thus this movie needs to be added to the favorite list.
// If the button doesn't have the class btn-light, then it means the movie is already included
// in the user's favorite movies list. In this case, the following action is to remove this movie
// from the user's favorite movies list.
var favoriteButtonClicked = function(imdbID) {
    // Locate the button object using imdbID
    var thisButton = document.getElementById("fav-button-" + imdbID);
    // If the button has the class btn-light, it means the movie is not included in the user's favorite movies list.
    if (thisButton.className.indexOf('btn-light') > -1) {
        // Make the API call to the backend server to add this movie to the list.
        informNewFavorite(imdbID);
        // Remove the class btn-light and add the class btn-warning to indicate the Favorite button is currently clicked.
        thisButton.classList.remove("btn-light");
        thisButton.classList.add("btn-warning");
    } else {
        // Make the API call to the backend server to remove this movie from the list.
        informRemoveFavorite(imdbID);
        // Remove the class btn-warning and add the class btn-light to indicate the Favorite button is unclicked.
        thisButton.classList.remove("btn-warning");
        thisButton.classList.add("btn-light");
    }
};

//==============================
// AUXILIARY HELPING FUNCTIONS
//==============================

// This helping function uses a movie's imdbID to locate and return the movie's data stored in the global arrays.
var getMovieDataById = function(imdbID) {
    // Scan the movies in the global array movieData.
    for (var i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID === imdbID) {
            return movieData[i];
        }
    }
    // Scan the movies in the global array favoritesData.
    for (var j = 0; j < favoritesData.length; j++) {
        if (favoritesData[j].imdbID === imdbID) {
            return favoritesData[j];
        }
    }
    // If the movie is not found in both arrays, return null
    return null;
};

// This helping function uses a movie's imdbID to check if the movie is already included in the user's favorite movies list.
var isAlreadyFavorite = function(imdbID) {
    for (var i = 0; i < favoritesData.length; i++) {
        if (favoritesData[i].imdbID === imdbID) {
            return true;
        }
    }
    return false;
};
