
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var user = require('./routes/user');
var engine = require('ejs-locals');
var http = require('http');
var path = require('path');


//=================================
var flash = require('connect-flash')
    , passport = require('passport')
    , util = require('util')
    , LocalStrategy = require('passport-local').Strategy;
/*
var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
    , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {


    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'Pacobengy10',
        database : 'whoo'
    });

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows[0].solution);
    });

    //connection.end();




    connection.query(
        'SELECT * FROM users',
        function selectPlayers(err, results, fields) {
            if (err) {
                console.log("Error: " + err.message);
                throw err;
            }
            console.log("Number of rows: "+results.length);
            console.log(results);

            for (var i = 0, len = results.length; i < len; i++) {
                var user = results[i];
                if (user.username === username) {
                    return fn(null, user);
                }
            }
            return fn(null, null);

            connection.end();
        });

/*    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);*/
//}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    user.findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            user.findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));
//=================================


var app = express();

// all environments
app.set('port', process.env.PORT || 3080);

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('your secret here'));
app.use(express.session({ secret: 'keyboard cat' }));
//app.use(express.session());

//========
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//========

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(logErrors);
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

/*app.use(function(err, req, res, next){
 console.error(err.stack);
 //  res.send(500, 'Something broke!');
 });*/

// development only
/*if ('development' == app.get('env')) {
 console.log('errorHandler');
 app.use(express.errorHandler());
 }*/

/*app.get("/*", function(req, res, next){

 if(typeof req.cookies['connect.sid'] !== 'undefined'){
 console.log(req.cookies['connect.sid']);
 }

 next(); // call the next middleware
 });*/
//===============


/*app.get('/', function(req, res){
    console.log(req.user);
    res.render('index', { user: req.user });
});*/

app.get('/',ensureAuthenticated, function(req, res){
    console.log(req.user);
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
   // console.log(req);
    console.log(req.flash);
    console.log(req.body);
    //name: req.body.name
    res.render('login', { name: req.body.name, message: req.flash('error') });
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        console.log(req.user);
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}
//===============
/*
 app.get('/', routes.index);
 app.get('/users', user.list);

 app.get('/cali', function(req, res) {

 if (req.session.name) {
 console.log(req.session);
 //req.session.name = "cali";
 } else {
 console.log('creating name field');
 req.session.name = "cali";
 }
 if (req.signedCookies.mycookie) {
 console.log('it has signedCookies');
 console.log(req.signedCookies.mycookie.mydog.name);
 } else {
 console.log('sending signedCookies');
 res.cookie('mycookie', {'items': [1,2,3], 'mydog' : {'name': 'paco', 'age': 8, 'friend': 'kiara' } }, {signed: true})
 }
 //console.log('cali route');
 res.send("cali");
 //res.cookie('mycookie', {'items': [1,2,3], 'mydog' : {'name': 'paco', 'age': 8, 'friend': 'kiara' } }, {signed: true})
 });

 */
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
