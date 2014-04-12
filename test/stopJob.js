var assert   = require('assert');
var test     = require('tap').test;
var solidify = require('lib-stream-solidify');
var liquify  = require('lib-stream-liquify');
var future   = require('lib-stream-future')
var nodemock = require('nodemock');
var check    = require('lib-checked-domain')();

test("throw if name not specified", function (t){
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns();
      }
    }
  });
  var server = Server.New();
  var stream = future();
  t.throws(function () {
    server.stopJob(stream, {});
  }, new assert.AssertionError({message: 'name parameter required'}))
  t.end()
});

test("stopping a job", function (t){
  var job = nodemock.mock('abort')
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns(job)
      }
    }
  });

  var server = Server.New();

  var stream = future();
  var solid  = solidify();

  stream.setWritable(solid);

  solid.text(function (err, txt) {
    job.assertThrows();
    t.ok(true, 'calls abort');
    t.end();
  });

  server.stopJob(stream, {name: 'test'});
});

test("stopping a nonexistent job", function (t){
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns()
      }
    }
  });

  var server = Server.New();

  var stream = future();
  var solid  = solidify();

  stream.setWritable(solid);

  solid.text(function (err, txt) {
    job.assertThrows();
    t.ok(true, 'calls abort');
    t.end();
  });

  check(function(){
    server.stopJob(stream, {name: 'test'});
  })
  .on('NotFound', function(){
    t.end();
  })
});
