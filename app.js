var express        = require('express');
var cors           = require('cors');
var path           = require('path');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var cookieParser   = require("cookie-parser");
var methodOverride = require("method-override");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');

var uuid           = require('uuid');
var multer         = require('multer');
var s3             = require('multer-s3');

var app            = express();

var config         = require('./config/config');
var User           = require('./models/user');
var secret         = require('./config/config').secret;

//API stuff

mongoose.connect(config.database);

require('./config/passport')(passport);

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
  }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

var routes = require('./config/routes');
app.use("/api", routes);

// Front end stuff
app.use("/", express.static(__dirname + "/public"));
app.use("/", express.static(__dirname + "/bower_components"));

var upload = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: process.env.WDI_S3_BUCKET,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'eu-west-1',
    contentType: function(req, file, next) {
      next(null, file.mimetype);
    },
    filename: function(req, file, next) {
      var ext = '.' + file.originalname.split('.').splice(-1)[0];
      var filename = uuid.v1() + ext;
      next(null, filename);
    }
  })
});

// This will upload a single file.
app.post('/api/upload/single', upload.single('file'), function(req, res) {
  res.status(200).json({ filename: req.file.key });
});

app.get("/*",function (req,res){
  res.sendFile(__dirname + '/public/views/index.html');
});

// Now stay a while, and listen.
app.listen(config.port, function(){
  console.log("The Fight Federation is meeting at Port " + config.port);
});
