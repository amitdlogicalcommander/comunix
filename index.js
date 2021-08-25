require('dotenv').config();
var cluster = require('cluster');
var path = require('path');
const cors = require('cors')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validator = require('express-validator');
var routes = require('./routes/index');

const port = process.env.PORT || 3000;
const workers = process.env.WORKERS || require('os').cpus().length;

cluster.isMaster ? handleMaster() : handleWorker();

function handleMaster(){
  console.log(`Number of CPUs is ${workers}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
}
function handleWorker() {
  var express = require('express');
  var app = express();
  var http = require('http');
  var server = http.createServer(app);
  var io = require('socket.io').listen(server);
  var redis = require('socket.io-redis');
  io.adapter(redis({ host: 'localhost', port: 6379 }));
  var socketCtrl = require('./controllers/socket');
  app.use(function(req, res, next){
    res.io = io;
    next();
  });
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(cors());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(validator());
  //routes
  app.use('/', routes);
  
  server.listen(port);
  socketCtrl.handleConnectionSession(io);
}
