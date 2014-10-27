'use strict'

var http   = require('http')
var RPC    = require('martini')
var Server = require('./index.js')()
var api    = require('./api.js')

var PORT   = process.env.PORT || 8080
var rpc    = RPC.New(api)
var router = rpc.getRouter(Server.New())

rpc.getClient(PORT)

http.createServer(router).listen(PORT, function () {
  console.log("listening on port", PORT)
})
