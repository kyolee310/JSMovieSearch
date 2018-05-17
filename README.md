# JSMovieSearch

Movie Search Web Application written in Vanilla JavaScript and NodeJS

## Overview

This web application allows users to search movies using the movie title. When the user enters the title of a movie in the search text box, the application displays a list of the movies that have the matching title. When the user clicks the Show button on one of the movies on the list, the application reveals the detailed description of the selected movie; the description includes the poster of the movie and other useful information of the movie such as the year, rated, release date, runtime, genre, director, actors, plot, language, country, and imdb rating of the movie. Also the users can create a list of their favorite movies by clicking the Favorite button that appears next to each movie title. 

The application is written in Vanilla JavaScript and NodeJS. Also the application uses Bootstrap, an open-source front-end library for HTML and CSS, to manage the responsive rendering of the applications’ HTML elements. 

## Installation Guide

#### Running the application manually on a Linux server

1. Insert your [**OMDb API key**](http://www.omdbapi.com/) in _./public/config.js_.
   ```javascript
   myConfig = {
     omdb_apikey: '123abc456de'
   };
   ```

2. Run the NodeJS server.
   ```
   node server.js
   ```

#### Running the application on Heroku

   ```
   heroku login
   git clone https://github.com/kyolee310/JSMovieSearch.git
   heroku create
   heroku config:set OMDB_APIKEY=123abc456de
   git push heroku master
   heroku ps:scale web=1
   heroku open
   heroku logs --tail
   ```
