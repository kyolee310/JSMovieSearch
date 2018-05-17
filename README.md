# JSMovieSearchApp
Movie Search Web Application written in Vanilla JavaScript and NodeJS

## Installation Guide

### Running the app manually

1. Update _config.js_ to include your [**OMDb API key**](http://www.omdbapi.com/).
   ```javascript
   myConfig = {
     omdb_apikey: '123abc456de'
   };
   ```

2. Run the NodeJS server.
   ```
   node server.js
   ```

### Running on Heroku


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
