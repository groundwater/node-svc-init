module.exports = {
  types: {
    args: {type: 'array' , kind: 'string'},
    envs: {type: 'map'   , kind: 'string'},
    file: {type: 'struct', props: {
        mode: 'string',
        path: 'string',
      }, require: ['path']
    },
    task: {type: 'struct', props: {
        exec : 'string',
        args : 'args',
        cwd  : 'string',
        envs : 'envs',
      }, require: ['exec', 'args', 'cwd', 'envs']
    },
    tasks: {type: 'array' , kind: 'task'},
    job  : {type: 'struct', props: {
        tasks: 'tasks'
      }, require: ['tasks']
    }
  },
  routes: {
    createJob: {
      proto: {
        method : 'POST',
        route  : '/jobs/:name'
      },
      input: 'job'
    },
    abortJobs: {
      proto: {
        method: 'DELETE',
        route : '/jobs/:name'
      }
    }
  }
}
