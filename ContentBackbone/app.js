const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
var cors = require('cors')

const app = express();
const mainRoutes = require('./routes/main')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * Where you can manipulate the reqeusts that is going through before it reaches the endpoints
 * 'use' means all requests will go through this middleware
 * CORS
 */
app.use(cors())
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );
    res.setHeader(
        'Access-Control-Allow-Headers', 
        "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET, POST, PATCH, DELETE, OPTIONS, PUT' //OPTIONS is for the browser to check if the request is allowed
    )
    next();
});
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res.status(501).json({ error: "Uknown error caught by middleware" });
});

app.use("/api/main", mainRoutes);

module.exports = app;
