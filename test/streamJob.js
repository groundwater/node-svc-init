var assert   = require('assert');
var test     = require('tap').test;
var solidify = require('lib-stream-solidify');
var liquify  = require('lib-stream-liquify');
var future   = require('lib-stream-future');
var check    = require('lib-checked-domain')();
var nodemock = require('nodemock');

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
    server.streamJob(stream, {name: 'test'});
  })
  .on('NotFound', function(){
    t.end();
  })
});

test("stream a jobs stdout", function (t){
  var job = {
    stdout: future(),
    stderr: future(),
  };
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
    t.equals(txt, '"Hello World"');
    t.end();
  });

  server.streamJob(stream, {name: 'test'});

  job.stdout.setReadable(liquify("Hello World"));
});

test("stream a jobs stderr", function (t){
  var job = {
    stdout: future(),
    stderr: future(),
  };
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
    t.equals(txt, '"Hello World"');
    t.end();
  });

  server.streamJob(stream, {name: 'test'});

  job.stderr.setReadable(liquify("Hello World"));
});

test("stream a jobs stderr+stdout", function (t){
  var job = {
    stdout: future(),
    stderr: future(),
  };
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
    t.equals(txt, '"Hello World""Goodbye World"');
    t.end();
  });

  server.streamJob(stream, {name: 'test'});

  job.stderr.setReadable(liquify("Hello World"));
  job.stdout.setReadable(liquify("Goodbye World"));
});

test("stream a jobs stdout+stderr", function (t){
  var job = {
    stdout: future(),
    stderr: future(),
  };
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
    t.equals(txt, '"Goodbye World""Hello World"');
    t.end();
  });

  server.streamJob(stream, {name: 'test'});

  job.stdout.setReadable(liquify("Goodbye World"));
  job.stderr.setReadable(liquify("Hello World"));
});
