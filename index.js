var assert   = require('assert');
var liquify  = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

function Server() {
  this.init = null;
}

Server.prototype.getJobs = function (stream) {
  liquify(this.init.list()).pipe(stream);
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

/*
  Initializers
*/

Server.New = function () {
  var server = new Server;

  server.init = this.Init.New();

  return server;
}

/*
  Inject
*/

function inject(deps) {
  return Object.create(Server, deps);
}

function defaults() {
  return {
    Init : {
      value: require('lib-init')()
    }
  };
}

module.exports = function INIT(deps) {
  return inject(deps || defaults());
};
