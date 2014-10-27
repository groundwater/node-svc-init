#!/usr/bin/env node
'use strict'

var RPC    = require('martini')
var Server = require('./index.js')()
var api    = require('./api.js')
var argv   = require('minimist')(process.argv.slice(2))
var solid  = require('lib-stream-solidify')

var HOST   = argv.host || process.env.HOST || 'localhost'
var PORT   = argv.port || process.env.PORT || 8080

var rpc    = RPC.New(api)
var client = rpc.getClient(PORT, HOST)

switch(argv._.shift()) {
case 'start':
  solid(process.stdin).json(function(err, obj) {
    client.createJob(obj, {name: argv._.shift() || 'default'})
    .then(console.log)
    .catch(console.error)
  })
  break
case 'stop':
  client.abortJobs(null, {name: argv._.shift() || 'default'})
    .then(console.log)
    .catch(console.error)
  break
default:
  console.error('Usage: node-initctl [OPTIONS] COMMAND')
  process.exit(1)
}
