var assert   = require('assert');
var test     = require('tap').test;
var solidify = require('lib-stream-solidify');
var liquify  = require('lib-stream-liquify');
var future   = require('lib-stream-future')
var nodemock = require('nodemock');
var check    = require('lib-checked-domain')();

test("clear a job", function (t){
  var init = nodemock
      .mock('clear').takes('test')
  var job = {};

  var Server = require('../index.js')({
    Init: {
      value: function() {
        return init
      }
    }
  });

  var server = Server.New();

  var stream = future();
  var solid  = solidify();

  stream.setWritable(solid);

  solid.text(function (err, txt) {
    init.assertThrows();
    t.end();
  });

  server.clearJob(stream, {name: 'test'});
});

test("job not found", function (t){
  var init = nodemock
      .mock('clear').takes('test').returnsF(function(){
        throw check.Error('NotFound', '')
      })
  var job = {};

  var Server = require('../index.js')({
    Init: {
      value: function() {
        return init
      }
    }
  });

  var server = Server.New();
  var stream = future();

  check(function () {
    server.clearJob(stream, {name: 'test'});
  })
  .on('NotFound', function(){
    init.assertThrows();
    t.end();
  })
});

test("cannot clear a running job", function (t){
  var init = nodemock
      .mock('clear').takes('test').returnsF(function(){
        throw check.Error('Forbidden', '')
      })
  var job = {};

  var Server = require('../index.js')({
    Init: {
      value: function() {
        return init
      }
    }
  });

  var server = Server.New();
  var stream = future();

  check(function () {
    server.clearJob(stream, {name: 'test'});
  })
  .on('Forbidden', function(){
    init.assertThrows();
    t.end();
  })
});
