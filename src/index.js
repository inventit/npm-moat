/*jslint node: true */
/*jshint strict:false */
'use strict';

var path = require('path'),
    assert = require('assert'),
    DEFAULT_PERSISTENCE = 'hash';

function err(m) {
  console.log('[ERROR] ' + m);
  return m;
}
function assertType(obj, type) {
  assert(obj instanceof type, 'This is not a function.');
}
function notConf() {
  throw err('Not yet configured.');
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
      pmStore = {},         // persistence module store
      crypto = require('crypto');

  /**
   * Representing the currently running environment information.<br />
   * This class is a singleton, users shouldn't instantiate it.<br />
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
   * The server-side running context.<br />
   * Users shouldn't instantiate it directly as the runtime environment is responsible for providing the instance.<br />
   * @extends moat.Context
   * @class
   * @constructor
   * @param {object} namespace The namespace associated with the server context.
   */
  moat.ServerContext = function(namespace) {
    assert(namespace, 'The namespace object is mandatory.');
    var applicationId = namespace.applicationId || namespace.appId;
    var packageId = namespace.packageId || namespace.pkgId;
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
    /**
     * Short name for namespace
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name namespace
     */
    this.ns = namespace;
    /**
     * Short name for applicationId
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name appId
     */
    this.appId = applicationId;
    /**
     * Short name for packageId
     * @readonly
     * @instance
     * @memberof moat.ServerContext
     * @type {object}
     * @name pkgId
     */
    this.pkgId = packageId;
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
   * The client-side running context.<br />
   * Users shouldn't instantiate it directly as the runtime environment is responsible for providing the instance.<br />
   * @extends moat.Context
   * @class
   * @constructor
   * @param {object} namespace The namespace associated with the client context.
   * @param {object} bindingContext Optional. An object containing the context information regarding application binding.
   */
  moat.ClientContext = function(namespace, bindingContext) {
    assert(namespace, 'The namespace object is mandatory.');
    var applicationId = namespace.applicationId || namespace.appId;
    var packageId = namespace.packageId || namespace.pkgId;
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
     * @memberof moat.ClientContext
     * @type {object}
     * @name applicationId
     */
    this.applicationId = applicationId;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ClientContext
     * @type {object}
     * @name packageId
     */
    this.packageId = packageId;
    /**
     * Short name for namespace
     * @readonly
     * @instance
     * @memberof moat.ClientContext
     * @type {object}
     * @name namespace
     */
    this.ns = namespace;
    /**
     * Short name for applicationId
     * @readonly
     * @instance
     * @memberof moat.ClientContext
     * @type {object}
     * @name applicationId
     */
    this.appId = applicationId;
    /**
     * Short name for packageId
     * @readonly
     * @instance
     * @memberof moat.ClientContext
     * @type {object}
     * @name packageId
     */
    this.pkgId = packageId;
    /**
     * 
     * @readonly
     * @instance
     * @memberof moat.ClientContext
     * @type {object}
     * @name bindingContext
     */
    this.bindingContext = (bindingContext ? bindingContext : null);
    // Instance properties are set via prototype.
    Object.freeze(this);
  };
  clientContext = new moat.Context();

  Object.seal(clientContext);
  moat.ClientContext.prototype = clientContext;
  Object.freeze(moat.ClientContext);

  /**
   * A class having static utility methods.<br />
   * The server-side MOAT js services may require this class since they aren't allowed to use built-in node modules and arbitrary npm modules on the server-side MOAT runtime, which provides isolated sandbox environment for the security purpose.<br />
   * The client-side MOAT js sevices may use this class though the use is NOT mandatory.<br />
   * <br />
   * Users should use the class object, {@link moat.Utils} itself, rather than its instance. The constructor always returns {@link moat.Utils} class object.
   * @class
   * @constructor
   */
  moat.Utils = function() {
    return moat.Utils;
  };
  var Utils = moat.Utils;
  /**
   * Returns a hash digest value as a string in the given encoding.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name digest
   * @param {string} algorithm One of 'MD5', 'SHA1', 'SHA256' is acceptable.
   * @param {string} encoding The type of encoding used for a value string. One of 'hex','b64', 'plain'.
   * @param {string} value A  string value to be calculated.
   * @returns {string} A digest hash value with the given encoding. Note that a hex string is returned if the encoding is 'plain'.
   */
  Utils.digest = function(algorithm, encoding, value) {
    assert(algorithm, 'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
    assert(algorithm === 'MD5' || algorithm === 'SHA1' || algorithm === 'SHA256',
      'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
    assert(encoding, 'Set the encoding, one of hex, b64 or plain is available.');
    assert(encoding == 'hex' || encoding == 'b64' || encoding == 'plain',
      'Set the encoding, one of hex, b64 or plain is available.');
    assert(value, 'value is missing.');
    assert(typeof(value) === 'string', 'value should be string.');
    var shasum = crypto.createHash(algorithm);
    shasum.update(value);
    var digest = null;
    switch (encoding) {
    default:
    case 'hex':
      digest = shasum.digest('hex');
      break;
    case 'b64':
      digest = shasum.digest('base64');
      break;
    case 'plain':
      digest = shasum.digest('binary').toString('utf8');
      break;
    }
    return digest;
  };
  /**
   * Returns a hmac value as a string in the given encoding.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name hmac
   * @param {string} algorithm One of 'MD5', 'SHA1', 'SHA256' is acceptable.
   * @param {string} encoding The type of encoding used for a value string. One of 'hex','b64', 'plain'.
   * @param {string} secret A secret text.
   * @param {string} value A  string value to be calculated.
   * @returns {string} An HMAC value with the given encoding. Note that a hex string is returned if the encoding is 'plain'.
   */
  Utils.hmac = function(algorithm, encoding, secret, value) {
    assert(algorithm, 'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
    assert(algorithm === 'MD5' || algorithm === 'SHA1' || algorithm === 'SHA256',
      'Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
    assert(encoding, 'Set the encoding, one of hex, b64 or plain is available.');
    assert(encoding == 'hex' || encoding == 'b64' || encoding == 'plain',
      'Set the encoding, one of hex, b64 or plain is available.');
    assert(secret, 'secret is missing.');
    assert(typeof(secret) === 'string', 'secret should be string.');
    assert(value, 'value is missing');
    assert(typeof(value) === 'string', 'value should be string.');
    var shasum = crypto.createHmac(algorithm, secret);
    shasum.update(value);
    var digest = null;
    switch (encoding) {
    default:
    case 'hex':
      digest = shasum.digest('hex');
      break;
    case 'b64':
      digest = shasum.digest('base64');
      break;
    case 'plain':
      digest = shasum.digest('binary').toString('utf8');
      break;
    }
    return digest;
  };
  /**
   * Converts a given hex string to a base64 string.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name hex2b64
   * @param {string} hex a hex string.
   * @returns {string} A Base64 string.
   */
  Utils.hex2b64 = function(hex) {
    assert(hex, 'hex is missing.');
    assert(typeof(hex) === 'string', 'hex should be string.');
    var buf = new Buffer(hex, 'hex');
    return buf.toString('base64');
  };
  /**
   * Converts a given hex string to a base64 string.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name b642hex
   * @param {string} b64 A Base64 string.
   * @returns {string} A hex string.
   */
  Utils.b642hex = function(b64) {
    assert(b64, 'b64 is missing.');
    assert(typeof(b64) === 'string', 'b64 should be string.');
    var buf = new Buffer(b64, 'base64');
    return buf.toString('hex');
  };
  function text2_(target, arg1, arg2) {
    var text = null,
        encoding = 'utf8',
        format = target;
    if (arg2) {
      text = arg2;
      encoding = arg1;
    } else {
      assert(arg1, 'text is missing.');
      text = arg1;
    }
    assert(typeof(text) === 'string', 'text should be string.');
    if (format === 'b64') {
      format = 'base64';
    }
    var buf = new Buffer(text, encoding);
    return buf.toString(format);
  }
  function textFrom_(target, arg1, arg2) {
    var str = null,
        encoding = 'utf8',
        format = target;
    if (arg2) {
      str = arg2;
      encoding = arg1;
    } else {
      assert(arg1, target + ' is missing.');
      str = arg1;
    }
    assert(typeof(str) === 'string', target + ' should be string.');
    if (format === 'b64') {
      format = 'base64';
    }
    var buf = new Buffer(str, format);
    return buf.toString(encoding);
  }
  /**
   * Converts a plain text into a hex string.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name text2hex
   * @param {string} plain A plain text.
   * @returns {string} A hex string.
   */
  /**
   * Converts a plain text into a hex string.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name text2hex
   * @param {string} encoding The character encoding. UTF-8 by default.
   * @param {string} text A plain text.
   * @returns {string} A hex string.
   */
  Utils.text2hex = function(arg1, arg2) {
    return text2_('hex', arg1, arg2);
  };
  /**
   * Converts a hex string into a plain text.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name hex2text
   * @param {string} hex A hex string.
   * @returns {string} A plain text.
   */
  /**
   * Converts a hex string into a plain text.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name hex2text
   * @param {string} encoding The character encoding. UTF-8 by default.
   * @param {string} hex A hex string.
   * @returns {string} A plain text.
   */
  Utils.hex2text = function(arg1, arg2) {
    return textFrom_('hex', arg1, arg2);
  };
  /**
   * Converts a plain text into a Base64 string.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name text2b64
   * @param {string} plain A plain text.
   * @returns {string} A Base64 string.
   */
  /**
   * Converts a plain text into a Base64 string.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name text2b64
   * @param {string} encoding The character encoding. UTF-8 by default.
   * @param {string} plain A plain text.
   * @returns {string} A Base64 string.
   */
  Utils.text2b64 = function(arg1, arg2) {
    return text2_('b64', arg1, arg2);
  };
  /**
   * Converts a Base64 string into a plain text.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name b642hex
   * @param {string} b64 A Base64 string.
   * @returns {string} A plain text.
   */
  /**
   * Converts a Base64 string into a plain text.
   * 
   * @static
   * @memberof moat.Utils
   * @function
   * @name b642hex
   * @param {string} encoding The character encoding. UTF-8 by default.
   * @param {string} b64 A Base64 string.
   * @returns {string} A plain text.
   */
  Utils.b642text = function(arg1, arg2) {
    return textFrom_('b64', arg1, arg2);
  };
  Object.freeze(moat.Utils);

  /**
   * Initializing the application package identified by the given packageId.
   * 
   * @param {string} urn The MOAT URN of the application package to be started.
   * @param {require} resolver The <code>require</code> function on the caller's context.
   * @returns {object} A namespace object of the application package.
   */
  moat.init = function(urn, resolver) {
    assert(moatRuntime, 'Illegal state.');
    function MoatURN(urn) {
        if (!(this instanceof MoatURN)) {
            throw 'This is not a function but a class!';
        }
        if (!urn) {
            throw 'moat URN is missing.';
        }
        if (urn.indexOf('urn:moat:') !== 0) {
            throw 'Invalid moat URN.';
        }
        var i = 'urn:moat:'.length, j;
        j = urn.indexOf(':', i);
        if (j < 0) {
            throw 'Application id is missing.';
        }
        this.applicationId = urn.substring(i, j);
        i = j + 1;
        j = urn.indexOf(':', i);
        if (j < 0) {
            throw 'Package id is missing.';
        }
        this.packageId = urn.substring(i, j);
        i = j + 1;
        j = urn.indexOf(':', i);
        if (j < 0) {
            throw 'Operation is missing.';
        }
        this.operation = urn.substring(i, j);
        i = j + 1;
        if (j >= urn.length) {
            throw 'Version is missing.';
        }
        this.version = urn.substring(i);
        if (!this.version) {
          throw 'Version is missing.';
        }
        this.urn = urn;
    }
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
    function validateModelName(name) {
      if (!name) {
        throw err('Missing model name.');
      }
      var first = name.charAt(0);
      if (first < 'A' || first > 'Z') {
        throw err('Model name must be CamelCase.');
      }
    }
    function buildModelClasses(ns, models) {
      var modelClassArray = [];
      for (var modelClassName in models) {
        if (models.hasOwnProperty(modelClassName)) {
          validateModelName(modelClassName);
          console.log('Building [' + modelClassName + ']');
          var modelClass = buildModelClass(modelClassName, models[modelClassName]);
          if (modelClass) {
            console.log('  => done!');
            ns[modelClassName] = modelClass;
            modelClassArray.push(modelClass);
          }
        }
      }
      ns.array = function() {
        var ary = [];
        for (var i = 0; i < modelClassArray.length; i++) {
          ary[i] = modelClassArray[i];
        }
        return ary;
      };
    }
    function readPackageJson(packageId, resolver) {
      var packageJsonPath = path.resolve(resolver.resolve(packageId), '../package.json');
      var packageJson = resolver(packageJsonPath);
      return packageJson;
    }

    var moatUrn = new MoatURN(urn),
        applicationId = moatUrn.applicationId,
        packageId = moatUrn.packageId;
    assert(applicationId && applicationId.length > 0, 'Application id is missing.');
    assert(packageId && packageId.length > 0, 'Package id is missing.');
    assert(packageId[0] != '.' && packageId[0] != '/', 'Package id should not be a path.');
    assert(resolver && typeof resolver === 'function', 'The require function is missing.');
    var ns = nsStore[packageId];
    if (ns) {
      return ns;
    }
    var packageJson = readPackageJson(packageId, resolver);
    assert(packageJson.models, 'The package[' + packageId + '] does not seem to be a MOAT js app since model descriptoers are missing in the package.json.');
    moat.persistence(DEFAULT_PERSISTENCE);
    ns = {
      /**
       * The sub namespace for model classes.
       */
      models: {
        /**
         * Returns an array of defined model classes.
         */
        array: function() {
          // see buildModelClasses() function.
        }
      },
      /**
       * The sub namespace for server side classes.
       */
      server: {},
      /**
       * The sub namespace for client side classes.
       */
      client: {},
      /**
       * URN for this application.
       */
      urn: urn,
      /**
       * Application ID of this application.
       */
      applicationId: applicationId,
      /**
       * Package ID of this application.
       */
      packageId: packageId
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
    console.log('namespace[' + packageId + '] has been generated.');
    return ns;
  };

  /**
   * Short name alias for init() function.
   * 
   * @function
   * @param {string} applicationId The applicationId of the application to be started.
   * @param {string} packageId The packageId of the application to be started.
   * @param {require} resolver The <code>require</code> function on the caller's context.
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
        throw err(library + ' is unsupported.');
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
       * @param {string} packageId The packageId of the service.
       * @param {object} namespace The namespace object the services belong to.
       * @param {string} main The main script path.
       */
      server: notConf,
      /**
       * Client service builder.
       * 
       * @instance
       * @memberof serviceBuilders
       * @type {function}
       * @param {string} packageId The packageId of the service.
       * @param {object} namespace The namespace object the services belong to.
       * @param {string} main The main script path.
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
        err('Sorry, already configured.');
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
