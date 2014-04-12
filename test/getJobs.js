var test = require('tap').test;
var solidify = require('lib-stream-solidify');
var nodemock = require('nodemock');

test("list returns data stream", function (t){
  var test = {
    a: 'a',
    b: 'b'
  }
  var Server = require('../index.js')({
    Init: {
      value: function() {
        return nodemock.mock('list').returns(test)
      }
    }
  });
  var solid = solidify();
  solid.json(function (err, data) {
    t.ifError(err);
    t.deepEquals(data, test);
    t.end();
  });
  var server = Server.New()
  server.getJobs(solid);
})
