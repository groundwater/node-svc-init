'use strict';

var http   = require('http');
var Rpc    = require('lib-http-rpc')();
var api    = require('lib-api-init');
var check  = require('lib-checked-domain')();
var Server = require('./index.js')();

var PORT   = process.env.PORT || 8080;
var rpc    = Rpc.NewFromInterface(api);
var router = rpc.getRouter(Server.New());

http.createServer(function (req, res) {
  check(function(){
    router(req, res);
  })
  .on('NotFound', function (e) {
    res.statusCode = 404;
    res.end(e.message);
  })
  .on('BadRequest', function (e) {
    res.statusCode = 400;
    res.end(e.message);
  })
}).listen(PORT, function () {
  console.log("listening on port", PORT);
});
