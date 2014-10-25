/*jslint node: true */
/*jshint strict:false */
'use strict';

var path = require('path'),
    assert = require('assert'),
    DEFAULT_PERSISTENCE = 'hash';

function ERR(m) {
  console.log('[ERROR] ' + m);
  return m;
}
function assertType(obj, type) {
  assert(obj instanceof type, 'This is not a function.');
}
function notConf() {
  throw ERR('Not yet configured.');
}

/**
 * 
 * @namespace
 */
var moat = {};

module.exports = (function() {
  var moatRuntime = null,   // Runtime prototype
      context = {},
      serverContext = null,
      clientContext = null,
      serverServiceBuilder = null,
      clientServiceBuilder = null,
      nsStore = {},         // namespace store
      pmStore = {};         // persistence module store

  /**
   * Representing the currently running environment information.
   * This class is a singleton, users shouldn't instantiate it.
   * 
   * @class
   */
  moat.Runtime = function() {
    assertType(this, moat.Runtime);
    Object.freeze(this);
  };

  /**
   * 
   * @returns {moat.Runtime} A singleton object.
   */
  moat.Runtime.singleton = function() {
    assert(moatRuntime, 'Not yet configured.');
    return moatRuntime;
  };

  /**
   * Short name alias for moat.Runtime.singleton() function.
   * 
   * @function
   * @returns {moat.Runtime} A singleton object.
   */
  moat.Runtime.s = moat.Runtime.singleton;
  moat.Runtime.prototype = {
    /**
     * Whether or not the runtime is server-side.
     * 
     * @readonly
     * @instance
     * @memberof moat.Runtime
     * @type {boolean}
     */
    server: false,

    /**
     * The name of the engine.
     * 
     * @readonly
     * @instance
     * @memberof moat.Runtime
     * @type {string}
     */
    engine: '',

    /**
     * The version of the engine.
     * 
     * @readonly
     * @instance
     * @memberof moat.Runtime
     * @type {string}
     */
    version: ''
  };
  Object.freeze(moat.Runtime);

  /**
   * The base class of the running context.
   * 
   * @class
   */
  moat.Context = function() {
    assertType(this, moat.Context);
  };
  Object.seal(context);
  Object.freeze(moat.Context);

  /**
   * The server-side running context.
   * Users shouldn't instantiate it directly as the runtime environment is responsible for providing the instance.
   * @extends moat.Context
   * @class
   * @constructor
   * @param {object} namespace The namespace associated with the server context.
   * @param {object} applicationId The applicationId of the running application.
   * @param {object} packageId The packageId of the running application.
   */
  moat.ServerContext = function(namespace, applicationId, packageId) {
    assert(namespace, 'The namespace object is mandatory.');
    assert(applicationId, 'The applicationId is mandatory.');
    assert(packageId, 'The packageId is mandatory.');
    assertType(this, moat.ServerContext);
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name namespace
     */
    this.namespace = namespace;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name applicationId
     */
    this.applicationId = applicationId;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name packageId
     */
    this.packageId = packageId;
    // Instance properties are set via prototype.
    Object.freeze(this);
  };
  serverContext = new moat.Context();
  /**
   * 
   * @readonly
   * @instance
   * @memberof moat.ServerContext
   * @type {object}
   * @name dmjob
   */
  serverContext.dmjob = null;
  /**
   * 
   * @readonly
   * @instance
   * @memberof moat.ServerContext
   * @type {object}
   * @name device
   */
  serverContext.device = null;
  /**
   * 
   * @readonly
   * @instance
   * @memberof moat.ServerContext
   * @type {array|object}
   * @name modelObjects
   */
  serverContext.modelObjects = null;
  /**
   * 
   * @readonly
   * @instance
   * @memberof moat.ServerContext
   * @type {object}
   * @name database
   */
  serverContext.database = null;
  /**
   * 
   * @instance
   * @memberof moat.ServerContext
   * @abstract
   * @function
   * @name httpSync
   * @param {object} opts HTTP request options.
   */
  serverContext.httpSync = notConf;
  /**
   * 
   * @instance
   * @memberof moat.ServerContext
   * @abstract
   * @function
   * @name findPackage
   * @param {string} packageId The package ID to be identified.
   */
  serverContext.findPackage = notConf;
  Object.seal(serverContext);
  moat.ServerContext.prototype = serverContext;
  Object.freeze(moat.ServerContext);

  /**
   * The client-side running context.
   * Users shouldn't instantiate it directly as the runtime environment is responsible for providing the instance.
   * @extends moat.Context
   * @class
   * @constructor
   * @param {object} namespace The namespace associated with the client context.
   * @param {object} applicationId The applicationId of the running application.
   * @param {object} packageId The packageId of the running application.
   */
  moat.ClientContext = function(namespace, applicationId, packageId) {
    assert(namespace, 'The namespace object is mandatory.');
    assert(applicationId, 'The applicationId is mandatory.');
    assert(packageId, 'The packageId is mandatory.');
    assertType(this, moat.ClientContext);
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ClientContext
     * @type {object}
     * @name namespace
     */
    this.namespace = namespace;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name applicationId
     */
    this.applicationId = applicationId;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name packageId
     */
    this.packageId = packageId;
    // Instance properties are set via prototype.
    Object.freeze(this);
  };
  clientContext = new moat.Context();

  Object.seal(clientContext);
  moat.ClientContext.prototype = clientContext;
  Object.freeze(moat.ClientContext);

  /**
   * Initializing the application package identified by the given packageId.
   * 
   * @param {string} packageId of the application to be started.
   * @returns {object} A namespace object of the application package.
   */
  moat.init = function(packageId) {
    assert(moatRuntime, 'Illegal state.');
    function newDefaultValue(type) {
      if (!type) {
        return null;
      }
      switch (type) {
      case 'int16':
      case 'int32':
      case 'int64':
        return 0;
      case 'float':
      case 'double':
        return 0.0;
      case 'boolean':
        return false;
      case 'resource':
        return {};
      default:
        return null;
      }
    }
    function buildModelClass(modelClassName, desc) {
      var modellClass = function() {
        var self = this;
        for (var p in modellClass.prototype) {
          if (modellClass.prototype.hasOwnProperty(p)) {
            self[p] = modellClass.prototype[p];
          }
        }
        Object.seal(self);
      };
      var proto = {};
      var attrs = desc.attributes;
      for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          proto[attr] = newDefaultValue(attrs[attr].type);
        }
      }
      var commands = desc.commands;
      for (var command in commands) {
        if (commands.hasOwnProperty(command)) {
          proto[command] = notConf;
        }
      }
      Object.seal(proto);
      modellClass.prototype = proto;
      modellClass.className = modelClassName;
      configure(modellClass, DEFAULT_PERSISTENCE, true);
      return modellClass;
    }
    function buildModelClasses(ns, models) {
      for (var modelClassName in models) {
        if (models.hasOwnProperty(modelClassName)) {
          console.log('Building [' + modelClassName + ']');
          var modelClass = buildModelClass(modelClassName, models[modelClassName]);
          if (modelClass) {
            console.log('  => done!');
            ns[modelClassName] = modelClass;
          }
        }
      }
    }
    function readPackageJson(packageId) {
      var packageJsonPath = path.resolve(require.resolve(packageId), '../package.json');
      var packageJson = require(packageJsonPath);
      return packageJson;
    }

    assert(packageId && packageId.length > 0, 'packageId is missing.');
    assert(packageId[0] != '.' && packageId[0] != '/', 'packageId should not be a path.');
    var ns = nsStore[packageId];
    if (ns) {
      return ns;
    }
    var packageJson = readPackageJson(packageId);
    assert(packageJson.models, 'The package[' + packageId + '] does not seem to be a MOAT js app since model descriptoers are missing in the package.json.');
    moat.persistence(DEFAULT_PERSISTENCE);
    ns = {
      models: {},
      server: {},
      client: {}
    };
    ns.m = ns.models;
    ns.svr = ns.server;
    ns.clt = ns.client;
    buildModelClasses(ns.m, packageJson.models);
    Object.freeze(ns.m);
    serverServiceBuilder(packageId, ns.svr, packageJson.serverMain);
    Object.freeze(ns.svr);
    clientServiceBuilder(packageId, ns.clt, packageJson.main);
    Object.freeze(ns.clt);
    Object.freeze(ns);
    nsStore[packageId] = ns;
    return ns;
  };

  /**
   * Short name alias for init() function.
   * 
   * @function
   * @param {string} packageId of the application to be started.
   * @returns {object} A namespace object of the application package.
   */
  moat.i = moat.init;

  /**
   * Initializing the persistence library used for managing model objects on the device database.
   * 
   * @param {string} library The persistence library name to be initialized.
   * @param {object} opts An object containing initializing parameters
   */
  moat.persistence = function(library, opts) {
    assert(library, 'Missing peristence module name.');
    var module = null;
    module = pmStore[library];
    if (!module) {
      try {
        module = require(path.resolve(__dirname, 'persistence-' + library + '.js'));
      } catch (e) {
        throw ERR(library + ' is unsupported.');
      }
      assert(typeof module === 'function', 'Invalid persistence module. Fucntion is expecte.');
      pmStore[library] = module;
    }
    module.init(opts);
    return moat;
  };

  /**
   * Short name alias for persistence() function.
   * 
   * @function
   * @param {string} library The persistence library name to be initialized.
   * @param {object} opts An object containing initializing parameters
   */
  moat.p = moat.persistence;

  /**
   * Configuring a model class in order to associate it with a specific persistence library.
   * This function seals the given modelClass object.
   * This function freezes the given modelClass object as well unless 'internal' is false.
   * 
   * @inner
   * @memberof moat
   * @param {object} modelClass A model class object.
   * @param {string} library The persistence library name to be initialized.
   * @param {boolean} internal Whether or not the caller is internal stuff of this module.
   * @returns {object} The moat namespace object.
   */
  function configure(modelClass, library, internal) {
    var moduleName = library,
        module = null;
    assert(modelClass, 'Missing model class.');
    assert(library, 'Missing library.');
    assert(modelClass.className, 'Invalid model class.');

    if (library == 'custom') {
      module = modelClass;
    } else {
      module = pmStore[moduleName](modelClass);
    }

    assert(module, 'The persistence module [' + moduleName + '] is missing.');
    assert(!Object.isFrozen(modelClass), 'Sorry, "' + modelClass.className + '" is already configured.');

    modelClass.add = module.add;
    modelClass.update = module.update;
    modelClass.updateFields = module.updateFields;
    modelClass.remove = module.remove;
    modelClass.findByUid = module.findByUid;
    modelClass.findAllUids = module.findAllUids;
    modelClass.count = module.count;
    if (internal) {
      Object.seal(modelClass);
    } else {
      Object.freeze(modelClass);
    }
    return moat;
  }

  /**
   * Configuring a model class in order to associate it with a specific persistence library.
   * This function freezes the given modelClass object.
   * 
   * @param {object} modelClass A model class object.
   * @param {string} library The persistence library name to be initialized.
   * @returns {object} The moat namespace object.
   */
  moat.configure = function(modelClass, library) {
    configure(modelClass, library, false);
  };

  /**
   * Short name alias for configure() function.
     * 
   * @function
   * @param {object} modelClass A model class object.
   * @param {string} library The persistence library name to be initialized.
   * @returns {object} The moat namespace object.
   */
  moat.c = moat.configure;

  /**
   * This namespace is for objects providing Service Provider Interfaces.
   * User applications don't have to use them.
   * @namespace
   */
  moat.spi = {};
  var spi = moat.spi;

  /**
   * This class represents the configuration information regarding the underlying moat API and runtime environment.
   * Users don't have to use this class directly but the runtime environment does.
   * @class
   */
  moat.spi.Config = function() {
    assertType(this, moat.spi.Config);
    var self = this;
    var Runtime = moat.Runtime;
    var runtimeProto = Runtime.prototype;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.spi.Config
     * @type {moat.Runtime}
     * @name runtime
     */
    self.runtime = runtimeProto;
    /**
     * The prototype of the {@link moat.ServiceContext}.
     * 
     * @readonly
     * @instance
     * @memberof moat.spi.Config
     * @type {moat.Context}
     * @name serverContextProto
     */
    self.serverContextProto = moat.ServerContext.prototype;
    Object.seal(self.runtime);
    /**
     * An object containing service builders for both server and client.
     * 
     * @readonly
     * @instance
     * @memberof moat.spi.Config
     * @type {object}
     * @name serviceBuilders
     */
    self.serviceBuilders = {
      /**
       * Server service builder.
       * 
       * @instance
       * @memberof serviceBuilders
       * @type {function}
       */
      server: notConf,
      /**
       * Client service builder.
       * 
       * @instance
       * @memberof serviceBuilders
       * @type {function}
       */
      client: notConf
    };
    Object.seal(self.serviceBuilders);
    /**
     * 
     * @instance
     * @memberof moat.spi.Config
     * @function
     * @name done
     * @returns {boolean} false when the configuration is already performed.
     */
    self.done = function() {
      if (Object.isFrozen(runtimeProto)) {
        ERR('Sorry, already configured.');
        return false;
      }
      moatRuntime = new Runtime();
      Object.freeze(runtimeProto);
      serverServiceBuilder = self.serviceBuilders.server;
      clientServiceBuilder = self.serviceBuilders.client;
      return true;
    };
    Object.freeze(self);
  };
  Object.freeze(spi.Config);
  Object.freeze(spi);
  Object.freeze(moat);
  return moat;
})();
