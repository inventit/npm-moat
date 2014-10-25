// declare 1 variable per line as this file is never uglified/minified.
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

// application specific dependencies
var moat = require('../src/index.js');

describe('moat', function() {
  it('should be an object rather than a function.', function() {
    moat.should.be.an('object');
  });
  it('should be frozen so that users cannot modify it.', function() {
    moat.someprop = 'me';
    should.not.exist(moat.someprop);
    should.exist(moat.spi);
    delete moat.spi;
    should.exist(moat.spi);
  });
});

describe('moat.Context(not initialized)', function() {
  it('should be a function rather than an object.', function() {
    moat.Context.should.be.a('function');
  });
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.Context).should.equal(true);
    Object.isFrozen(moat.Context).should.equal(true);
  });
});

describe('moat.ServerContext(not initialized)', function() {
  it('should be a function rather than an object.', function() {
    moat.ServerContext.should.be.a('function');
  });
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.ServerContext).should.equal(true);
    Object.isFrozen(moat.ServerContext).should.equal(true);
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var ns = {};
      var obj = new moat.ServerContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  it('should be a type of moat.Context.', function() {
    var ns = {};
    var obj = new moat.ServerContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace, dmjob, device, modelObjects, database].', function() {
    var ns = {};
    var obj = new moat.ServerContext(ns);
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('dmjob');
    obj.should.have.a.property('device');
    obj.should.have.a.property('modelObjects');
    obj.should.have.a.property('database');
  });
  describe('constructor', function() {
    it('should require a namespace object.', function() {
      (function () {
        moat.ServerContext();
      }).should.throw('The namespace object is mandatory.');
    });
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ServerContext({});
      }).should.throw('This is not a function.');
    });
  });
  describe('#httpSync', function() {
    it('should fail prior to moat.spi.Config#done() being invoked.', function() {
      (function () {
        new moat.ServerContext({}).httpSync();
      }).should.throw('Not yet configured.');
    });
  });
  describe('#findPackage', function() {
    it('should fail prior to moat.spi.Config#done() being invoked.', function() {
      (function () {
        new moat.ServerContext({}).findPackage();
      }).should.throw('Not yet configured.');
    });
  });
});

describe('moat.ClientContext(not initialized)', function() {
  it('should be a function rather than an object.', function() {
    moat.ClientContext.should.be.a('function');
  });
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.ClientContext).should.equal(true);
    Object.isFrozen(moat.ClientContext).should.equal(true);
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var ns = {};
      var obj = new moat.ClientContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  it('should be a type of moat.Context.', function() {
    var ns = {};
    var obj = new moat.ClientContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace].', function() {
    var ns = {};
    var obj = new moat.ClientContext(ns);
    obj.should.have.a.property('namespace');
  });
  describe('constructor', function() {
    it('should require a namespace object.', function() {
      (function () {
        moat.ClientContext();
      }).should.throw('The namespace object is mandatory.');
    });
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ClientContext({});
      }).should.throw('This is not a function.');
    });
  });
});

describe('moat.Runtime(not initialized)', function() {
  it('should be a function rather than an object.', function() {
    moat.Runtime.should.be.a('function');
  });
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.Runtime).should.equal(true);
    Object.isFrozen(moat.Runtime).should.equal(true);
    var obj = new moat.Runtime();
    Object.isSealed(obj).should.equal(true);
    Object.isFrozen(obj).should.equal(true);
  });
  describe('constructor', function() {
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.Runtime();
      }).should.throw('This is not a function.');
    });
  });
  describe('#singleton', function() {
    it('should throw an exception unless moat.spi.Config#done() is invoked.', function() {
      (function () {
        moat.Runtime.singleton();
      }).should.throw('Not yet configured.');
    });
  });
});

describe('moat.spi', function() {
  it('should be an object rather than a function.', function() {
    moat.spi.should.be.an('object');
  });
  it('should be frozen so that users cannot modify it.', function() {
    moat.spi.someprop = 'me';
    should.not.exist(moat.spi.someprop);
    should.exist(moat.spi.Config);
    delete moat.spi.Config;
    should.exist(moat.spi.Config);
  });
});

describe('moat.spi.Config', function() {
  describe('constructor', function() {
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.spi.Config();
      }).should.throw('This is not a function.');
    });
    it('should have an object property named "runtime".', function() {
      var config = new moat.spi.Config();
      should.exist(config.runtime);
    });
    it('should be sealed and frozen.', function() {
      Object.isSealed(moat.spi.Config).should.equal(true);
      Object.isFrozen(moat.spi.Config).should.equal(true);
    });
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var obj = new moat.spi.Config();
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  describe('#runtime', function() {
    it('should be sealed so that users cannot add/remove but edit properties.', function() {
      var config = new moat.spi.Config();
      config.runtime.foo = 'yay!';
      should.not.exist(config.runtime.foo);
      config.runtime.version = 'yay!';
      config.runtime.version.should.equal('yay!');
      config.runtime.server = true;
      config.runtime.server.should.equal(true);
      config.runtime.engine = 'servicesync';
      config.runtime.engine.should.equal('servicesync');
    });
  });
  describe('#serverContextProto', function() {
    it('should be sealed so that users cannot add/remove but edit properties.', function() {
      var config = new moat.spi.Config();
      config.runtime.foo = 'yay!';
      should.not.exist(config.runtime.foo);
      config.serverContextProto.httpSync = function(options) {
        return 'OK! I was overwritten.';
      };
      config.serverContextProto.httpSync().should.equal('OK! I was overwritten.');
      config.serverContextProto.findPackage = function(object) {
        return 'OK! I was overwritten.';
      };
      config.serverContextProto.findPackage().should.equal('OK! I was overwritten.');
    });
  });
  describe('#serviceBuilders', function() {
    it('should be sealed so that users cannot add/remove but edit properties.', function() {
      var config = new moat.spi.Config();
      config.serviceBuilders.foo = 'yay!';
      should.not.exist(config.serviceBuilders.foo);
      config.serviceBuilders.client = function(options) {
        return 'OK! I was overwritten.';
      };
      config.serviceBuilders.client().should.equal('OK! I was overwritten.');
      config.serviceBuilders.server = function(object) {
        return 'OK! I was overwritten.';
      };
      config.serviceBuilders.server().should.equal('OK! I was overwritten.');
    });
  });
  describe('#done', function() {
    it('should return true when it is terminated without errors.', function() {
      var config = new moat.spi.Config();
      config.runtime.server = false;
      config.runtime.version = '1.0.0';
      config.runtime.engine = 'servicesync';
      config.serverContextProto.httpSync = function(options) {
        return 'OK! I was overwritten.';
      };
      config.serverContextProto.findPackage = function(object) {
        return 'OK! I was overwritten.';
      };
      config.serviceBuilders.server = function(packageId, ns, main) {};
      config.serviceBuilders.client = function(packageId, ns, main) {};
      Object.isFrozen(config.runtime).should.equal(false);
      config.done().should.equal(true);
      Object.isFrozen(config.runtime).should.equal(true);
    });
    it('should return false if "moat.Runtime.prototype" is frozen.', function() {
      var config = new moat.spi.Config();
      config.done().should.equal(false);
    });
  });
});

describe('moat.Context(initialized)', function() {
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.Context).should.equal(true);
    Object.isFrozen(moat.Context).should.equal(true);
  });
  describe('instance', function() {
    it('should not be sealed and frozen.', function() {
      var obj = new moat.Context();
      Object.isSealed(obj).should.equal(false);
      Object.isFrozen(obj).should.equal(false);
    });
  });
});

describe('moat.ServerContext(initialized)', function() {
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.ServerContext).should.equal(true);
    Object.isFrozen(moat.ServerContext).should.equal(true);
  });
  it('should be a type of moat.Context.', function() {
    var ns = {};
    var obj = new moat.ServerContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace, dmjob, device, modelObjects, database].', function() {
    var ns = {};
    var obj = new moat.ServerContext(ns);
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('dmjob');
    obj.should.have.a.property('device');
    obj.should.have.a.property('modelObjects');
    obj.should.have.a.property('database');
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var ns = {};
      var obj = new moat.ServerContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  describe('constructor', function() {
    it('should require a namespace object.', function() {
      (function () {
        moat.ServerContext();
      }).should.throw('The namespace object is mandatory.');
    });
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ServerContext({});
      }).should.throw('This is not a function.');
    });
  });
  describe('#httpSync', function() {
    it('should be overwritten after moat.spi.Config#done() being invoked.', function() {
      new moat.ServerContext({}).httpSync().should.equal('OK! I was overwritten.');
    });
  });
  describe('#findPackage', function() {
    it('should be overwritten after moat.spi.Config#done() being invoked.', function() {
      new moat.ServerContext({}).findPackage().should.equal('OK! I was overwritten.');
    });
  });
});

describe('moat.ClientContext(initialized)', function() {
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.ClientContext).should.equal(true);
    Object.isFrozen(moat.ClientContext).should.equal(true);
  });
  it('should be a type of moat.Context.', function() {
    var ns = {};
    var obj = new moat.ClientContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace].', function() {
    var ns = {};
    var obj = new moat.ClientContext(ns);
    obj.should.have.a.property('namespace');
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var ns = {};
      var obj = new moat.ClientContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  describe('constructor', function() {
    describe('constructor', function() {
      it('should require a namespace object.', function() {
        (function () {
          moat.ClientContext();
        }).should.throw('The namespace object is mandatory.');
      });
      it('should not be executed as a function as it is a constructor.', function() {
        (function () {
          moat.ClientContext({});
        }).should.throw('This is not a function.');
      });
    });
  });
});

describe('moat.Runtime(initialized)', function() {
  it('should be frozen after moat.spi.Config#done() being invoked.', function() {
    Object.isSealed(moat.Runtime).should.equal(true);
    Object.isFrozen(moat.Runtime).should.equal(true);
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var obj = new moat.Runtime();
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  describe('constructor', function() {
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.Runtime();
      }).should.throw('This is not a function.');
    });
  });
  describe('.singleton', function() {
    it('should return a Runtime singleton instance after moat.spi.Config#done() is invoked.', function() {
      moat.Runtime.singleton().should.be.a('object');
      moat.Runtime.singleton().should.be.an.instanceOf(moat.Runtime);
    });
  });
});

describe('moat(initialized)', function() {
  describe('.init', function() {
    it('should not accept an empty string and a path as a packageId.', function() {
      (function () {
        moat.init();
      }).should.throw('packageId is missing.');
      (function () {
        moat.init('');
      }).should.throw('packageId is missing.');
      (function () {
        moat.init('./mypackage');
      }).should.throw('packageId should not be a path.');
      (function () {
        moat.init('/mypackage');
      }).should.throw('packageId should not be a path.');
    });

    it('should not accept a missing packageId.', function() {
      (function () {
        moat.init('no-such-a-package!!');
      }).should.throw("Cannot find module 'no-such-a-package!!'");
    });

    var mypackage = null;
    it('should load a given moat package.', function() {
      mypackage = moat.init('mypackage');
      should.exist(mypackage);
    });
    it('should cache the already loaded package.', function() {
      moat.init('mypackage').should.equal(mypackage);
    });
    describe('mypackage(sample app package for testing)', function() {
      it('should have sub packages as properties.', function() {
        mypackage.should.have.a.property('models');
        mypackage.m.should.equal(mypackage.models);
        mypackage.should.have.a.property('server');
        mypackage.svr.should.equal(mypackage.server);
        mypackage.should.have.a.property('client');
        mypackage.clt.should.equal(mypackage.client);
        Object.isFrozen(mypackage.models).should.equal(true);
        Object.isFrozen(mypackage.server).should.equal(true);
        Object.isFrozen(mypackage.client).should.equal(true);
      });
      describe('.models', function() {
        var models = null;
        it('should have model classes as properties.', function() {
          models = mypackage.models;
          models.should.have.a.property('FirstLargeObject');
          models.should.have.a.property('SecondLargeObject');
          Object.isSealed(models.FirstLargeObject).should.equal(true);
          Object.isFrozen(models.FirstLargeObject).should.equal(false);
        });
        describe('.FirstLargeObject', function() {
          it('should have mapper functions as class methods.', function() {
            var FirstLargeObject = models.FirstLargeObject;
            FirstLargeObject.should.have.a.property('add');
            FirstLargeObject.should.have.a.property('remove');
            FirstLargeObject.should.have.a.property('update');
            FirstLargeObject.should.have.a.property('updateFields');
            FirstLargeObject.should.have.a.property('findByUid');
            FirstLargeObject.should.have.a.property('findAllUids');
            FirstLargeObject.should.have.a.property('count');
            FirstLargeObject.add.should.be.a('function');
            FirstLargeObject.remove.should.be.a('function');
            FirstLargeObject.update.should.be.a('function');
            FirstLargeObject.updateFields.should.be.a('function');
            FirstLargeObject.findByUid.should.be.a('function');
            FirstLargeObject.findAllUids.should.be.a('function');
            FirstLargeObject.count.should.be.a('function');
          });
          describe('instance', function() {
            it('should be sealed but NOT frozen.', function() {
              var obj = new models.FirstLargeObject();
              Object.isSealed(obj).should.equal(true);
              Object.isFrozen(obj).should.equal(false);
            });
            it('should have attributes declared in the package.json.', function() {
              var obj = new models.FirstLargeObject();
              obj.should.have.a.property('name');
              obj.should.have.a.property('timestamp');
              obj.should.have.a.property('file');
              obj.should.have.a.property('binary');
            });
            it('should have command functions declared in the package.json.', function() {
              var obj = new models.FirstLargeObject();
              obj.should.have.a.property('downloadToLocal');
              obj.downloadToLocal.should.be.a('function');
              obj.should.have.a.property('removeLocal');
              obj.removeLocal.should.be.a('function');
              obj.should.have.a.property('uploadFromLocal');
              obj.uploadFromLocal.should.be.a('function');
              obj.should.have.a.property('collectBinary');
              obj.collectBinary.should.be.a('function');
            });
          });
          describe('#name', function() {
            it('should be modified.', function() {
              var obj = new models.FirstLargeObject();
              obj.name = 'myname';
              obj.name.should.equal('myname');
            });
          });
          describe('#downloadToLocal', function() {
            it('should be overridden.', function() {
              should.exist(models.FirstLargeObject.prototype.downloadToLocal);
              models.FirstLargeObject.prototype.downloadToLocal = function(params, callback) {
                return 'ok';
              };
              var obj = new models.FirstLargeObject();
              should.exist(obj.downloadToLocal);
              obj.downloadToLocal().should.equal('ok');
            });
          });
        });
        describe('.SecondLargeObject', function() {
          describe('instance', function() {
            it('should be sealed but NOT frozen.', function() {
              var obj = new models.SecondLargeObject();
              Object.isSealed(obj).should.equal(true);
              Object.isFrozen(obj).should.equal(false);
            });
          });
        });
      });
    });
  });
});
