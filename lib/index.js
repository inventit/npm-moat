/*jslint node: true */
/*jshint strict:false */
'use strict';

function LOG_ERROR(m) {
  console.log('[ERROR] ' + m);
}

module.exports = (function() {
  var moat = {},
      moatRuntime = null;
  
  // classes
  moat.Runtime = function() {};
  moat.Runtime.singleton = function() {
    if (!moatRuntime) {
      LOG_ERROR('Not yet configured.');
      throw 'Not yet configured.';
    }
    return moatRuntime;
  };

  // public functions
  moat.persistence = function(modelClass, type) {
    // TODO
  };
  moat.init = function() {
    // TODO
  };

  // spi namespace
  moat.spi = {};
  // spi classes
  moat.spi.Config = function() {
    if (!(this instanceof moat.spi.Config)) {
      throw 'This is not a function.';
    }
    var self = this;
    self.runtime = {
      version: '',
      engine: ''
    };
    Object.seal(self.runtime);
    self.done = function() {
      if (Object.isFrozen(moat.Runtime)) {
        LOG_ERROR('Sorry, already configured.');
        return false;
      }
      moat.Runtime.prototype = self.runtime;
      Object.freeze(moat.Runtime);
      moatRuntime = new moat.Runtime();
      return true;
    };
  };
  Object.freeze(moat.spi);

  Object.freeze(moat);
  return moat;
})();
