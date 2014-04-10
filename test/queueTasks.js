var test = require('tap').test;

var liquify = require('lib-stream-liquify')
var future = require('lib-stream-future')
var solidify = require('lib-stream-solidify');

var Server = require('../index.js')();
var job = {
  tasks: [
    {
      exec: process.argv[0],
      args: ['-v'],
      envs: process.env,
      cwd : process.cwd(),
    },
  ]
}

test(function (t) {
  var server = Server.New();
  var stream = future();
  stream.setReadable(liquify(job));
  server.queueTasks(stream, {name: 'test'})
  stream.writable.on('data', function(data) {
    t.equals(data.toString().trim(), process.version);
    t.end();
  });
  t.ok(process.version);
});
