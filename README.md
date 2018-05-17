# JSMovieSearchApp
Movie Search Web Application written in Vanilla JavaScript and NodeJS

## Installation Guide

1. Update _config.js_ to include your [**OMDb API key**](http://www.omdbapi.com/) and the **URL** of your NodeJS server.
   ```javascript
   myConfig = {
     omdb_apikey: '123abc456de',
     nodejs_conn: 'http://ec2-55-555-55-123.us-west-1.compute.amazonaws.com:3000'
   };
   ```

2. Run the NodeJS server.
   ```
   node server.js
   ```

