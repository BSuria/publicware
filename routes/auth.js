const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = "mongodb+srv://bryanalexsur:9GEoP9o2paCal3EC@cluster0.frj1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbconnect = new MongoClient(url);
let collection = null;

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log("password entered");

    const collection = dbconnect.db("LeaderBoard").collection("Accounts");

    const results = await collection.find({}).toArray();
    console.log(results);
    try {
        let row = await collection.findOne({username: username});

        console.log('Row from DB:', row);

        if (!row) {
            console.log('Row from DB:', row);
            return cb(null, false, { message: 'Username or Password is incorrect.' });
        }

        const saltBuffer = row.salt instanceof Buffer ? row.salt : Buffer.from(row.salt.buffer);
        const hashedPasswordBuffer = row.hashed_password instanceof Buffer ? row.hashed_password : Buffer.from(row.hashed_password.buffer);


        crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return cb(err);
            }
            if (!crypto.timingSafeEqual(hashedPasswordBuffer, hashedPassword)) {
                console.log("incorrect password")
                return cb(null, false, { message: 'Username or Password is incorrect.' });
            }
            return cb(null, row);
        });

    } catch (err) {
        console.log('Error during authentication:', err);
        return cb(err);
    }
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

router.post('/signout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

router.post('/signup', function(req, res, next) {
    const collection = dbconnect.db("LeaderBoard").collection("Accounts");

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
        if (err) { return next(err); }
        try{
            await collection.insertOne({ username : req.body.username, hashed_password : hashedPassword, salt : salt});
        } catch{
            return next(err);
        }
            if (err) { return next(err); }
            const user = {
                id: this.lastID,
                username: req.body.username
            };
            req.login(user, function(err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
    });
});

module.exports = router;