# JSMovieSearch

Movie Search Web Application written in Vanilla JavaScript and NodeJS.

<img src="https://github.com/kyolee310/JSMovieSearch/blob/master/screenshot.png" width="800">

## Overview

This web application allows users to search movies using the movie title. When the user enters the title of a movie in the search text box, the application displays a list of the movies that have the matching title. When the user clicks the Show button on one of the movies on the list, the application reveals the detailed description of the selected movie; the description includes the poster of the movie and other useful information of the movie such as the year, rated, release date, runtime, genre, director, actors, plot, language, country, and imdb rating of the movie. Also the users can create a list of their favorite movies by clicking the Favorite button that appears next to each movie title. 

The application is written in **Vanilla JavaScript** and **NodeJS**. The application uses the **OMDB(http://www.omdbapi.com/) API** to obtain movie data. Additionally, the application uses **Bootstrap**, an open-source front-end library for HTML and CSS, to manage the responsive rendering of the applications’ HTML elements. 

You can find this application currently running at the following URL:

https://frozen-caverns-18184.herokuapp.com/

## Components

#### server.js

This JavaScript file contains the code for the Node backend server. The main task of the backend server in this application is to persist the data that contain the user’s favorite movies list. When a GET request is made to the endpoint _/favorites_, the backend returns the user’s favorite movies list. (At the moment, only one user is simulated in the application.) However, when a POST request is made to the same endpoint _/favorites_, the endpoint expects update in the user’s favorite movies list: an addition of a new movie in the list. If the application wants to remove a movie from the user’s favorite movies list, a POST request needs to be made to the endpoint _/favorites/remove_. All POST requests to the backend server must contain the _name_ and _oid_ of the user in the body of the request.

#### data.json

This file stores the JSON object that represents the user’s favorite movies list.

#### /public/index.html

This HTML file is first loaded to the client’s web browser when the website, which runs this application, is visited. This HTML file contains the bare-minimum frame of the HTML elements for the application. More importantly, this HTML file initiates the loading of the other scripts such as Bootstrap, CSS, and our main client-side JavaScript file _search_movie.js_.

#### /public/search_movie.js

This JavaScript file runs on the client’s web browser to manage various interactions on the HTML elements and handle data flow between the client’s web browser and the API servers (the OMDB API server and our Node backend server).

The application uses the OMDb API to obtain movie information. The AJAX component in this JavaScript file makes direct API calls to the OMDb server to receive the movie data. Two types of the API calls are made to the OMDb server: _search by title_ and _search by imdb ID_. The former requests a list of the movies that contain the movie title, which is provided as a parameter to the API call. The later requests a detailed description of the movie given its imdb ID, which is a parameter to the API call.

The other AJAX component in this file interacts with the Node backend server to store the user’s favorite movies list. There are two endpoints (and three actions) available in the Node backend server: _/favorites_ and _/favorites/remove_. See the description of _server.js_ above for more detail.

#### /public/config.js

This configuration file is used to specify the OMDb API key. However, this file is not used when the application runs on Heroku.

#### /public/custom.css

This CSS file contains a set of the custom CSS classes used in the application. 

## Installation Guide

### Before you start

Make sure that you have **Node** and **Git** installed on your server or machine. You can run the commands below on your command shell to verify the installations:

   ```
   node --version
   git --version
   ```

### Running the application manually on a Linux server

1. Clone this repository on your server and change the directory to _JSMovieSearch_.
   ```
   git clone https://github.com/kyolee310/JSMovieSearch.git
   cd JSMovieSearch
   ```

2. Insert _your own [OMDb API key](http://www.omdbapi.com/)_ in the configuration file _/public/config.js_.
   ```javascript
   myConfig = {
     omdb_apikey: '123abc456de'
   };
   ```

3. Run the NodeJS server.
   ```
   node server.js
   ```

### Running the application on Heroku

1. Log in to Heroku using [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
   ```
   heroku login
   ```

2. Clone this repository on your server and change the directory to _JSMovieSearch_.
   ```
   git clone https://github.com/kyolee310/JSMovieSearch.git
   cd JSMovieSearch
   ```

3. In your _JSMovieSearch_ directory, create an application on Heroku, which prepares Heroku to recieve the source code.
   ```
   heroku create
   ```

4. Insert _your own [OMDB API key](http://www.omdbapi.com/)_ into Heroku's configuration.
   ```
   heroku config:set OMDB_APIKEY=123abc456de
   ```
   
5. Push the application's source code to Heroku.
   ```
   git push heroku master
   ```

The application is deployed on Heroku at this point. You can monitor the application's status using the commands below:
   ```
   heroku ps:scale web=1
   heroku open
   heroku logs --tail
   ```
