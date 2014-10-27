var assert   = require('assert')
var liquify  = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

function Server() {
  this.init = null
}

/*
  Initializers
*/

Server.New = function () {
  var server = new Server()

  server.init = this.Init()

  return server
}

Server.prototype.createJob = function (job, args) {
  console.log('Create Job')

  job.tasks.forEach(function(task){
    console.log('Adding Task to Queue', args.name)
    console.dir(task)

    this.init.queue(args.name, task)
    .emitter
    .once('exit', console.log)
  }, this)
}

Server.prototype.abortJobs = function (_, args) {
  console.log('Aborting Queue', args.name)

  this.init.abort(args.name)
}

/*
  Inject
*/

function inject(deps) {
  return Object.create(Server, deps)
}

function defaults() {
  var Init = require('lib-init')()
  return {
    Init : {
      value: function() {
        return Init.New()
      }
    }
  }
}

module.exports = function INIT(deps) {
  return inject(deps || defaults())
}
