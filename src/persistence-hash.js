/**
 * Generates a UUID version 4 string from http://stackoverflow.com/a/105074
 * @returns {string} UUID
 */
var uuid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})(),
    maxSize = 1000;

/**
 * A builder function to create an object containing asynchronous mapper functions.
 * @param {object} modelClass
 */
module.exports = function(modelClass) {
  return (function() {
    var hash = {},
        assert = require('assert'),
        EventEmitter = require('events').EventEmitter,
        bus = new EventEmitter();
    
    /**
     * A convenient method to create an exiting event identifier.
     * @param {string} action The type of mapper operation.
     * @param {string} uid The unique identifier. Optional.
     * @returns {stirng} [action]-[uid] or [action]-result if uid is missing.
     */
    function exev(action, uid) {
      if (uid) {
        return action + '-' + uid;
      }
      return action + '-result';
    }
    
    /**
     * Cloning a given entity.
     * @param {object} entity An instance of the modelClass to be copied.
     * @returns {object} A cloned object.
     */
    function clone(entity) {
      var obj = new modelClass();
      for (var p in entity) {
        if (entity.hasOwnProperty(p)) {
          obj[p] = entity[p];
        }
      }
      return obj;
    }
    
    bus.on('add', function(entity) {
      var error;
      if (hash[entity.uid]) {
        error = Error('Duplicate entry, uid:' + entity.uid);
      } else if (Object.keys(hash).length >= maxSize) {
        error = Error('Size full, remove entries prior to adding a new one. Size:' + maxSize);
      } else {
        hash[entity.uid] = clone(entity);
      }
      process.nextTick(function() {
        bus.emit(exev('add', entity.uid), error, entity);
      });
    });
    
    bus.on('update', function(entity) {
      var error;
      hash[entity.uid] = clone(entity);
      process.nextTick(function() {
        bus.emit(exev('update', entity.uid), error, entity);
      });
    });
    
    bus.on('updateFields', function(entity, fields) {
      var error,
          current = hash[entity.uid];
      for (var i = 0; i < fields.length; i++) {
        current[fields[i]] = entity[fields[i]];
      }
      process.nextTick(function() {
        bus.emit(exev('updateFields', current.uid), error, clone(current), fields);
      });
    });
    
    bus.on('remove', function(uid) {
      var error,
          entity;
      if (hash[uid]) {
        entity = hash[uid];
        delete hash[uid];
      } else {
        error = Error('Missing entry, uid:' + uid);
      }
      process.nextTick(function() {
        bus.emit(exev('remove', uid), error, entity);
      });
    });
    
    bus.on('findByUid', function(uid) {
      var error,
          entity;
      if (hash[uid]) {
        entity = clone(hash[uid]);
      } else {
        error = Error('Missing entry, uid:' + uid);
      }
      process.nextTick(function() {
        bus.emit(exev('findByUid', uid), error, entity);
      });
    });
    
    bus.on('findAllUids', function() {
      process.nextTick(function() {
        bus.emit(exev('findAllUids'), undefined, Object.keys(hash));
      });
    });
    
    bus.on('count', function() {
      process.nextTick(function() {
        bus.emit(exev('count'), undefined, Object.keys(hash).length);
      });
    });
    
    return {
      /**
       * @param {object} entity a model object to be added.
       * @param {function} callback a callback function object.
       */
      add: function(entity, callback) {
        assert(entity, 'entity is mandatory.');
        assert(entity instanceof modelClass, 'Incompatible entity.');
        if (!entity.uid) {
          entity.uid = uuid();
        }
        var added = bus.once(exev('add', entity.uid), function(error, result) {
          if (callback) {
            callback(error, result);
          }
        });
        process.nextTick(function() {
          bus.emit('add', entity);
        });
      },

      /**
       * @param {object} entity a model object to be updated.
       * @param {function} callback a callback function object.
       */
      update: function(entity, callback) {
        assert(entity, 'entity is mandatory.');
        assert(entity instanceof modelClass, 'Incompatible entity.');
        assert(entity.uid, 'entity.uid is mandatory.');
        bus.once(exev('update', entity.uid), function(error, result) {
          if (callback) {
            callback(error, result);
          }
        });
        process.nextTick(function() {
          bus.emit('update', entity);
        });
      },

      /**
       * @param {object} entity a model object to be added.
       * @param {array} fields the names of field to be updated.
       * @param {function} a callback function object.
       */
      updateFields: function(entity, fields, callback) {
        assert(entity, 'entity is mandatory.');
        assert(entity instanceof modelClass, 'Incompatible entity.');
        assert(entity.uid, 'entity.uid is mandatory.');
        assert(fields, '[fields] variable is mandatory.');
        assert(fields instanceof Array, '[fields] variable should be an array.');
        assert(fields.length > 0, '[fields] variable is mandatory.');
        bus.once(exev('updateFields', entity.uid), function(error, result, fields) {
          if (callback) {
            callback(error, result, fields);
          }
        });
        process.nextTick(function() {
          bus.emit('updateFields', entity, fields);
        });
      },

      /**
       * @param {string} uid The unique identifier of the entity to be removed.
       * @param {function} callback a callback function object.
       */
      remove: function(uid, callback) {
        assert(uid, 'uid is mandatory.');
        assert(typeof(uid) === 'string', 'uid should be string.');
        bus.once(exev('remove', uid), function(error, removed) {
          if (callback) {
            callback(error, removed);
          }
        });
        process.nextTick(function() {
          bus.emit('remove', uid);
        });
      },

      /**
       * @param {string} uid The unique identifier of the target entity.
       * @param {function} callback a callback function object.
       */
      findByUid: function(uid, callback) {
        assert(uid, 'uid is mandatory.');
        assert(typeof(uid) === 'string', 'uid should be string.');
        assert(callback, 'callback is mandatory.');
        bus.once(exev('findByUid', uid), function(error, result) {
          if (callback) {
            callback(error, result);
          }
        });
        process.nextTick(function() {
          bus.emit('findByUid', uid);
        });
      },

      /**
       * @param {function} callback a callback function object.
       */
      findAllUids: function(callback) {
        assert(callback, 'callback is mandatory.');
        bus.once(exev('findAllUids'), function(error, uidArray) {
          if (callback) {
            callback(error, uidArray);
          }
        });
        process.nextTick(function() {
          bus.emit('findAllUids');
        });
      },

      /**
       * @param {string} uid The unique identifier of the target entity.
       * @param {function} callback a callback function object.
       */
      count: function(callback) {
        assert(callback, 'callback is mandatory.');
        bus.once(exev('count'), function(error, length) {
          if (callback) {
            callback(error, length);
          }
        });
        process.nextTick(function() {
          bus.emit('count');
        });
      }
    };
  })();
};

/**
 * The static initializer for the persistence module.
 * Database settings can be passed via this function, for instance.
 * @param {object} opts
 */
module.exports.init = function(opts) {
  if (opts) {
    if (opts.hasOwnProperty('maxSize')) {
      assert(opts.maxSize > 0, 'maxSize should be a positive number.');
      maxSize = opts.maxSize;
    }
  }
};
