var assert   = require('assert');
var test     = require('tap').test;
var solidify = require('lib-stream-solidify');
var liquify  = require('lib-stream-liquify');
var future   = require('lib-stream-future');
var check    = require('lib-checked-domain')();
var nodemock = require('nodemock');

test("throw a name not specified", function (t){
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
    server.waitJob(stream, {});
  }, new assert.AssertionError({message: 'name parameter required'}))
  t.end()
});

test("throw a NotFound if job not found", function (t){
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns();
      }
    }
  });
  var server = Server.New();
  var stream = future();
  check(function(){
    server.waitJob(stream, {name: 'test'});
  })
  .on('NotFound', function(){
    t.end();
  })
});
test("wait for a job to exit", function (t){
  var queue = nodemock.mock('on').takes('empty', function(){}).calls(1, []);
  queue.running = true;
  var job = {
    queue: queue
  }
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns(job);
      }
    }
  });

  var stream = future();
  var solid  = solidify();

  stream.setWritable(solid);
  var server = Server.New();

  solid.text(function(){
    t.end();
  })

  server.waitJob(stream, {name: 'test'});
});

test("wait for a job to exit", function (t){
  var queue = nodemock.mock('on').takes('empty', function(){});
  queue.running = true;
  var job = {
    queue: queue
  }
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns(job);
      }
    }
  });

  var stream = future();
  var solid  = solidify();

  stream.setWritable(solid);
  var server = Server.New();

  solid.text(function(){
    t.ok(false); // FAIL HERE
  })

  // the job should wait so the timeout should fire
  setTimeout(function() {
    t.end(); // OKAY!
  }, 100)
  server.waitJob(stream, {name: 'test'});
});


test("dont wait if job is not running", function (t){
  var job = {
    queue: {
      running: false
    }
  }
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns(job);
      }
    }
  });

  var stream = future();
  var solid  = solidify();

  stream.setWritable(solid);
  var server = Server.New();

  solid.text(function(){
    t.end();
  })

  server.waitJob(stream, {name: 'test'});
});
