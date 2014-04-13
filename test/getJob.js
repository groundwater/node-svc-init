var assert   = require('assert');
var test     = require('tap').test;
var solidify = require('lib-stream-solidify');
var liquify  = require('lib-stream-liquify');
var future   = require('lib-stream-future')
var checked  = require('lib-checked-domain')();
var nodemock = require('nodemock');

test("unknown job", function (t){
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('get').takes('test').returns()
      }
    }
  });

  var server = Server.New();
  var stream = future();

  checked(function () {
    server.getJob(stream, {name: 'test'});
  })
  .on('NotFound', function(){
    t.end();
  })
});

test("status of a job", function (t){

  var pend = [{name: 1}];
  var rest = [{name: 2}];
  var stat = {
    pending: pend,
    running: true,
    results: rest,
  }
  var job = nodemock.mock('status').returns(stat);
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
    var json = JSON.parse(txt);
    t.equals(json.running, true, 'specifies if running');
    t.deepEquals(json.pending, pend, 'contains pending tasks');
    t.deepEquals(json.results, rest, 'contains task results');
    t.end();
  });

  server.getJob(stream, {name: 'test'});
});
