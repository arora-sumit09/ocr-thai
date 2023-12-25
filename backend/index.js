const express=require('express');
const database = require('./database');
const cors = require('cors')

require('dotenv').config()
const PORT= process.env.PORT ||8081;
var app= express();
app.use(cors())



app.use(express.json());

database();

app.use('/api/', require('./routes/createUser'));
app.use('/api/', require('./routes/fetchRecord'));
app.use('/api/', require('./routes/deleteRecord'));

app.listen(PORT, function () {
 
    console.log("App listening at http://localhost:",PORT);
 })
 