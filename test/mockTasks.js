var assert   = require('assert');
var test     = require('tap').test;
var solidify = require('lib-stream-solidify');
var liquify  = require('lib-stream-liquify');
var future   = require('lib-stream-future')
var nodemock = require('nodemock');

test("pipe stdout", function (t){
  var key = 'hello world';

  // mock job to return
  var job = {
    stdout: liquify(key),
    stderr: future(),
  };

  var name = 'test';
  var body = {};
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('queue').takes(name, body).returns(job)
      }
    }
  });

  var solid = solidify();

  // our actual test to see what got returned
  solid.json(function (err, data) {
    t.equals(data, key);
    t.end();
  });

  var stream = future();

  stream.setReadable(liquify(body));
  stream.setWritable(solid);

  var server = Server.New();
  server.queueTasks(stream, {name: name});
});

test("pipe stderr", function (t){
  var key = 'goodbye world';

  // mock job to return
  var job = {
    stdout: future(),
    stderr: liquify(key),
  };

  var name = 'test';
  var body = {};
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('queue').takes(name, body).returns(job)
      }
    }
  });

  var solid = solidify();

  // our actual test to see what got returned
  solid.json(function (err, data) {
    t.equals(data, key);
    t.end();
  });

  var stream = future();

  stream.setReadable(liquify(body));
  stream.setWritable(solid);

  var server = Server.New();
  server.queueTasks(stream, {name: name});
});

test("throws when no name is supplied", function (t){
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock;
      }
    }
  });
  var stream = future();
  var server = Server.New();

  t.throws(function () {
    server.queueTasks(stream, {name: name});
  }, assert.AssertionError(''));
  t.end();
});
