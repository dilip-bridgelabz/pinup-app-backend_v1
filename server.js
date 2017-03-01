//
// FundooHR Backend
//

'use strict';

process.title = 'pinupapp';

var mongoose = require('mongoose'),
    Mongo = require('mongodb'),
    compression = require('compression'),
    express = require('express'),
    cors = require('cors'),
    argv = require('minimist')(process.argv.slice(2)),
    swagger = require("swagger-node-express"),
    morgan = require('morgan'),
    jwt    = require('jsonwebtoken'),
    config = require('./config/database'),
    passport = require('passport'),
    //connectMongo = require('connect-mongo/es5'),
    routes = require('./routes/routes'),
    bodyParser = require('body-parser'),
    auth = require('./methods/auth.js'),
    session = require('express-session'),
    ejs = require('ejs');
		//MongoClient = Mongo.MongoClient;

//var MongoStore = connectMongo(express.session),
  //  models = all(path.resolve('./models/mongo')),
  //  app;

var con = mongoose.connect(config.database);
var app = express();
/*######################### Swagger UI implimentation for API #########################*/
var swaggerApiPath = express();

/*
// Session
var sessionStore = new MongoStore({
    url: config.database,
    autoReconnect: true
});
// Session
var session = {
    key: 'connect.sid',
    secret: 'secretpinupcc',
    store: sessionStore,
    cookie: { secure: true },
    resave: false,
    saveUninitialized: true
};
*/

// HTTP Middlewares app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/api", swaggerApiPath);
swagger.setAppHandler(swaggerApiPath);
swagger.setApiInfo({
    title: "Swagger API for Pinup App",
    description: "Serving the swagger API for Pinup App for testing & user access",
    termsOfServiceUrl: "",
    contact: "dilip.more@bridgelabz.com",
    license: "",
    licenseUrl: ""
});
app.use(express.static('swagger'));
/*################################### Swagger UI Ends ###################################*/

var db = mongoose.connection.on('open', function(){
    console.log('Mongo is connected');
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}));
app.set('view engine', 'ejs');
app.use(routes);
app.use(passport.initialize());

/*################################ Serving the Swagger API ################################*/
swaggerApiPath.get('/', function (req, res) {
    res.sendfile(__dirname + '/swagger/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');
/*###################################### Serving Ends ######################################*/

app.listen(3333, function(){
    console.log('server is running');
});
