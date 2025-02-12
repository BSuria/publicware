const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const path = require("path");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const crypto = require('crypto');
const logger = require('morgan')
const passport = require('passport');
const session = require('express-session');
const mkdirp = require("mkdirp");
const SQLiteStore = require('connect-sqlite3')(session);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(express.static("public"))

mkdirp.sync('var/db');

app.use(session({
    secret: 'bemba',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/get-username', (req, res) => {
    if (req.isAuthenticated()) {
        // User is authenticated, send username
        res.json({ username: req.user.username });
    } else {
        // User is not authenticated
        res.json({ username: null });
    }
});

app.use('/', indexRouter);
app.use('/', authRouter);

const url = "mongodb+srv://bryanalexsur:9GEoP9o2paCal3EC@cluster0.frj1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbconnect = new MongoClient(url);

async function run(){
    await dbconnect.connect().then(() => console.log("Connected!"));
    /*const collection = dbconnect.db("LeaderBoard").collection("Accounts");
    let salt = crypto.randomBytes(16);
    let password = crypto.pbkdf2Sync('1234', salt, 310000, 32, 'sha256')
    let newAccount = {"username": "ryan", "hashed_password": password, "salt": salt}
    const results = await collection.insertOne(newAccount);*/
}

const appRun = run();

app.listen(process.env.PORT || 3000, ()=>{
    console.log("port connected");
});

module.exports = app;

/*app.get('/', (req, res) => {
    res.send('<html><head><title>Express Example</title>' +
        '<link href="assets/style.css" type="text/css" rel="stylesheet" /></head>' +
        '<body><h1>Hello World!</h1></body>')
})*/


/*
const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

const data = []

// let fullURL = ""
const server = http.createServer( function( request,response ) {
    if( request.method === "GET" ) {
        handleGet( request, response )
    }else if( request.method === "POST" ){
        handlePost( request, response )
    }

    // The following shows the requests being sent to the server
    // fullURL = `http://${request.headers.host}${request.url}`
    // console.log( fullURL );
})

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 )

    if( request.url === "/" || request.url === "/index.ejs") {
        if(data.length){
            //console.log("hello" + JSON.parse(data[0]).entry_ID)
            response.writeHead(200, { "Content-Type": "text/html" });
            let html = fs.readFileSync(__dirname + '/public/index.ejs','utf8');
            let addingdata = "";
            for (let i = 0; i < data.length; i++){
                console.log(data[i].name)
                addingdata +='<tr><th><button id="updateButton" type="button">Update</button> <button id="deleteButton" type="button">Delete</button></th>' +
                "<th>" + JSON.parse(data[i]).name + "</th>" + //this line should be the player's name
                    "<th>" + JSON.parse(data[i]).gamename + "</th>" +
                    "<th>" + JSON.parse(data[i]).playtime + "</th>" +
                    "<th>" + JSON.parse(data[i]).startdate + "</th>"  +
                    "<th>" + JSON.parse(data[i]).hours + "</th></tr>" //this line should be the hours/day
            }
            const existingdata = addingdata;
            console.log(existingdata)
            html = html.replace("{emptytable}", existingdata)
            response.end(html);
        }
        else{
            response.writeHead(200, { "Content-Type": "text/html" });
            let html = fs.readFileSync(__dirname + '/public/index.ejs','utf8');
            const nothing = "";
            html = html.replace("{emptytable}", nothing);
            response.end(html);
        }
    }else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    request.on( "end", function() {
        if (request.url === "/delete"){
            for (let i = 0; i < data.length; i++){
                if (JSON.parse(dataString).name === JSON.parse(data[i]).name){
                    data.splice(i,1)

                    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
                    response.end("Deleted")
                    return false;
                }
            }
        }
        console.log( JSON.parse( dataString ) )

        for (let i = 0; i < data.length; i++){
            console.log( JSON.parse( data[i] ) )
        }

        const startTime = new Date(JSON.parse(dataString).startdate)/(3600*1000);
        const currentTime = Date.now()/(3600*1000)
        const hoursPerDay = Math.round(Number(JSON.parse(dataString).playtime)/((currentTime - startTime)/24))

        console.log(Number(JSON.parse(dataString).playtime))
        console.log(hoursPerDay)

        const json = { entry_1: JSON.parse(dataString).entry_1, name: JSON.parse(dataString).name,
            gamename: JSON.parse(dataString).gamename, playtime: JSON.parse(dataString).playtime,
            startdate: JSON.parse(dataString).startdate, hours: hoursPerDay }

        const body = JSON.stringify( json )

        if(request.url === "/submit"){
            for (let i = 0; i < data.length; i++){
                if (JSON.parse(dataString).name === JSON.parse(data[i]).name){
                    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
                    response.end("NameError")
                    return false;
                }
            }
            data.push(body)


            response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
            response.end(body)
        }
        if(request.url === "/update"){
            for (let i = 0; i < data.length; i++){
                if (JSON.parse(dataString).name === JSON.parse(data[i]).name){
                    data[i] = body


                    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
                    response.end(body)
                }
            }
        }
    })
}

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )

        } else {

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )

        }
    })
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

*/
