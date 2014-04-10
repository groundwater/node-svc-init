var http   = require('http');
var Rpc    = require('lib-http-rpc')();
var api    = require('lib-api-init');
var Server = require('./index.js')();

var PORT   = process.env.PORT;
var rpc    = Rpc.NewFromInterface(api);
var router = rpc.getRouter(Server.New());

http.createServer(router).listen(PORT, function () {
  console.log("listening on port", PORT);
});
