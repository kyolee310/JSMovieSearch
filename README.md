# JSMovieSearch

Movie Search Web Application written in Vanilla JavaScript and NodeJS

## Overview

This web application allows users to search movies using the movie title. When the user enters the title of a movie in the search text box, the application displays a list of the movies that have the matching title. When the user clicks the Show button on one of the movies on the list, the application reveals the detailed description of the selected movie; the description includes the poster of the movie and other useful information of the movie such as the year, rated, release date, runtime, genre, director, actors, plot, language, country, and imdb rating of the movie. Also the users can create a list of their favorite movies by clicking the Favorite button that appears next to each movie title. 

The application is written in **Vanilla JavaScript** and **NodeJS**. The application uses the OMDB(http://www.omdbapi.com/) API to obtain movie data. Additionally, the application uses **Bootstrap**, an open-source front-end library for HTML and CSS, to manage the responsive rendering of the applications’ HTML elements. 

## Installation Guide

#### Running the application manually on a Linux server

1. Clone this repository on your server and change the directory to _JSMovieSearch_.
   ```
   git clone https://github.com/kyolee310/JSMovieSearch.git
   cd JSMovieSearch
   ```

2. Insert your own [**OMDb API key**](http://www.omdbapi.com/) in _./public/config.js_.
   ```javascript
   myConfig = {
     omdb_apikey: '123abc456de'
   };
   ```

3. Run the NodeJS server.
   ```
   node server.js
   ```

#### Running the application on Heroku

1. Log in to Heroku using Heroku CLI.
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

4. Insert your own [OMDB API key](http://www.omdbapi.com/) into Heroku's configuration.
   ```
   heroku config:set OMDB_APIKEY=123abc456de
   ```
   
5. Push the application's source code to Heroku.
   ```
   git push heroku master
   ```

6. Monitor the application's status using the commands below.
   ```
   heroku ps:scale web=1
   heroku open
   heroku logs --tail
   ```
