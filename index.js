var assert   = require('assert');
var liquify  = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')
var checked  = require('lib-checked-domain')();

function Server() {
  this.init = null;
}

Server.prototype.getJobs = function (stream) {
  liquify(this.init.list()).pipe(stream);
};

Server.prototype.clearJob = function (stream, params) {
  this.init.clear('test');
  stream.end();
};

Server.prototype.queueTasks = function (stream, params) {
  var name;
  assert(name = params.name, 'name required');

  var init = this.init;

  solidify(stream).json(function (err, body) {
    if (err) throw err;

    var job = init.queue(name, body);

    job.stdout.pipe(stream);
    job.stderr.pipe(stream);
  });
};

Server.prototype.getJob = function (stream, params) {
  var job = this.init.get('test');
  liquify(job.status()).pipe(stream);
};

Server.prototype.streamJob = function (stream, params) {
  var name = params.name;

  var job = this.init.get(name);

  if (!job) throw checked.Error('NotFound', 'job not found');

  job.stdout.pipe(stream);
  job.stderr.pipe(stream);
};

Server.prototype.waitJob = function (stream, params) {
  var job = this.init.get('test');

  if (!job) throw checked.Error('NotFound', 'job not found');

  if (job.queue.running) {
    job.queue.on('empty', function(){
      stream.end();
    })
  } else {
    stream.end();
  }
};

/*
  Initializers
*/

Server.New = function () {
  var server = new Server;

  server.init = this.Init();

  return server;
}

/*
  Inject
*/

function inject(deps) {
  return Object.create(Server, deps);
}

function defaults() {
  var Init = require('lib-init')();
  return {
    Init : {
      value: function() {
        return Init.New();
      }
    }
  };
}

module.exports = function INIT(deps) {
  return inject(deps || defaults());
};
