const express = require('express');

const expressLayouts = require('express-ejs-layouts');

const app = express();

const port = 8000;

app.use(expressLayouts); // has to be before routes 

//use express router

app.use('/',require('./routes'));

//setup the view engine

app.set('view engine','ejs');

app.set('views', './views');



app.listen(port, function(err){

    if(err) console.log(`Error in running the server: ${err}`);

    console.log(`Server is up and running on port: ${port}`);
});

