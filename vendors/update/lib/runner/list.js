'use strict';

var utils = require('../utils');

module.exports = function(options) {
  return function(app) {

    this.define('list', function(cb) {
      var questions = utils.questions(this.base.options);
      var choices = utils.list(this.base.updaters);
      if (!choices.length) {
        console.log(utils.cyan(' No updater tasks found.'));
        return cb(null, {
          updaters: {}
        });
      }

      var question = {
        updaters: {
          message: 'pick an updater to run',
          type: 'checkbox',
          choices: choices
        }
      };

      questions.ask(question, function(err, answers) {
        if (err) return cb(err);
        var args = {
          updaters: {}
        };
        answers.updaters.forEach(function(answer) {
          var segs = answer.split(':');
          if (segs.length === 1) return;
          utils.union(args.updaters, segs[0], (segs[1] || 'default').split(','));
        });
        return cb(null, args);
      });
    });
  };
};
