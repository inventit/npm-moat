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
      var ns = {applicationId:'appId', packageId:'pkgId'};
      var obj = new moat.ServerContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  it('should be a type of moat.Context.', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ServerContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [applicationId, packageId, namespace, dmjob, device, modelObjects, database].', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ServerContext(ns);
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('applicationId');
    obj.should.have.a.property('packageId');
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
    it('should require a namespace object and applicationId.', function() {
      (function () {
        moat.ServerContext({});
      }).should.throw('The applicationId is mandatory.');
    });
    it('should require a namespace object, applicationId and packageId.', function() {
      (function () {
        moat.ServerContext({applicationId:'appId'});
      }).should.throw('The packageId is mandatory.');
    });
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ServerContext({applicationId:'appId', packageId:'pkgId'});
      }).should.throw('This is not a function.');
    });
  });
  describe('#httpSync', function() {
    it('should fail prior to moat.spi.Config#done() being invoked.', function() {
      (function () {
        new moat.ServerContext({applicationId:'appId', packageId:'pkgId'}).httpSync();
      }).should.throw('Not yet configured.');
    });
  });
  describe('#findPackage', function() {
    it('should fail prior to moat.spi.Config#done() being invoked.', function() {
      (function () {
        new moat.ServerContext({applicationId:'appId', packageId:'pkgId'}).findPackage();
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
      var ns = {applicationId:'appId', packageId:'pkgId'};
      var obj = new moat.ClientContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  it('should be a type of moat.Context.', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ClientContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace, applicationId, packageId].', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ClientContext(ns);
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('applicationId');
    obj.should.have.a.property('packageId');
  });
  describe('constructor', function() {
    it('should require a namespace object.', function() {
      (function () {
        moat.ClientContext();
      }).should.throw('The namespace object is mandatory.');
    });
    it('should require a namespace object and applicationId.', function() {
      (function () {
        moat.ClientContext({});
      }).should.throw('The applicationId is mandatory.');
    });
    it('should require a namespace object, applicationId and packageId.', function() {
      (function () {
        moat.ClientContext({applicationId:'appId'});
      }).should.throw('The packageId is mandatory.');
    });
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ClientContext({applicationId:'appId', packageId:'pkgId'});
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
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ServerContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace, applicationId, packageId, dmjob, device, modelObjects, database].', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ServerContext(ns);
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('applicationId');
    obj.should.have.a.property('packageId');
    obj.should.have.a.property('dmjob');
    obj.should.have.a.property('device');
    obj.should.have.a.property('modelObjects');
    obj.should.have.a.property('database');
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var ns = {applicationId:'appId', packageId:'pkgId'};
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
    it('should require a namespace object and applicationId.', function() {
      (function () {
        moat.ServerContext({});
      }).should.throw('The applicationId is mandatory.');
    });
    it('should require a namespace object, applicationId and packageId.', function() {
      (function () {
        moat.ServerContext({applicationId:'appId'});
      }).should.throw('The packageId is mandatory.');
    });
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ServerContext({applicationId:'appId', packageId:'pkgId'});
      }).should.throw('This is not a function.');
    });
  });
  describe('#httpSync', function() {
    it('should be overwritten after moat.spi.Config#done() being invoked.', function() {
      new moat.ServerContext({applicationId:'appId', packageId:'pkgId'}).httpSync().should.equal('OK! I was overwritten.');
    });
  });
  describe('#findPackage', function() {
    it('should be overwritten after moat.spi.Config#done() being invoked.', function() {
      new moat.ServerContext({applicationId:'appId', packageId:'pkgId'}).findPackage().should.equal('OK! I was overwritten.');
    });
  });
});

describe('moat.ClientContext(initialized)', function() {
  it('should be sealed and frozen.', function() {
    Object.isSealed(moat.ClientContext).should.equal(true);
    Object.isFrozen(moat.ClientContext).should.equal(true);
  });
  it('should be a type of moat.Context.', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ClientContext(ns);
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [namespace, applicationId, packageId, bindingContext] but bindingContext sohuld be null.', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ClientContext(ns);
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('applicationId');
    obj.should.have.a.property('packageId');
    obj.should.have.a.property('bindingContext');
    should.not.exist(obj.bindingContext);
  });
  it('should have properties named [namespace, applicationId, packageId, bindingContext].', function() {
    var ns = {applicationId:'appId', packageId:'pkgId'};
    var obj = new moat.ClientContext(ns, {});
    obj.should.have.a.property('namespace');
    obj.should.have.a.property('applicationId');
    obj.should.have.a.property('packageId');
    obj.should.have.a.property('bindingContext');
    should.exist(obj.bindingContext);
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var ns = {applicationId:'appId', packageId:'pkgId'};
      var obj = new moat.ClientContext(ns);
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  describe('constructor', function() {
    describe('constructor', function() {
      it('should require a namespace object and applicationId.', function() {
        (function () {
          moat.ClientContext({});
        }).should.throw('The applicationId is mandatory.');
      });
      it('should require a namespace object, applicationId and packageId.', function() {
        (function () {
          moat.ClientContext({applicationId:'appId'});
        }).should.throw('The packageId is mandatory.');
      });
      it('should not be executed as a function as it is a constructor.', function() {
        (function () {
          moat.ClientContext({applicationId:'appId', packageId:'pkgId'});
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
      }).should.throw('moat URN is missing.');
      (function () {
        moat.init('applicationId');
      }).should.throw('Invalid moat URN.');
      (function () {
        moat.init('urn:moat:applicationId');
      }).should.throw('Application id is missing.');
      (function () {
        moat.init('urn:moat:applicationId:');
      }).should.throw('Package id is missing.');
      (function () {
        moat.init('urn:moat:applicationId:mypackage:');
      }).should.throw('Operation is missing.');
      (function () {
        moat.init('urn:moat:applicationId:mypackage:operation:');
      }).should.throw('Version is missing.');
      (function () {
        moat.init('urn:moat:applicationId:./mypackage:operation:1.0.0');
      }).should.throw('Package id should not be a path.');
      (function () {
        moat.init('urn:moat:applicationId:/mypackage:operation:1.0.0');
      }).should.throw('Package id should not be a path.');
      (function () {
        moat.init('urn:moat:applicationId:mypackage:operation:1.0.0');
      }).should.throw('The require function is missing.');
      (function () {
        moat.init('urn:moat:applicationId:mypackage:operation:1.0.0');
      }).should.throw('The require function is missing.');
      (function () {
        moat.init('urn:moat:applicationId:mypackage:operation:1.0.0');
      }).should.throw('The require function is missing.');
      (function () {
        moat.init('urn:moat:applicationId:mypackage:operation:1.0.0', {});
      }).should.throw('The require function is missing.');
    });

    it('should not accept a missing packageId.', function() {
      (function () {
        moat.init('urn:moat:applicationId:no-such-a-package!!:operation:1.0.0', require);
      }).should.throw("Cannot find module 'no-such-a-package!!'");
    });

    var mypackage = null;
    it('should load a given moat package.', function() {
      mypackage = moat.init('urn:moat:applicationId:mypackage:operation:1.0.0', require);
      should.exist(mypackage);
      mypackage.should.have.a.property('applicationId');
      mypackage.should.have.a.property('packageId');
      mypackage.should.have.a.property('urn');
      mypackage.applicationId.should.equal('applicationId');
      mypackage.packageId.should.equal('mypackage');
      mypackage.urn.should.equal('urn:moat:applicationId:mypackage:operation:1.0.0');
    });
    it('should cache the already loaded package.', function() {
      moat.init('urn:moat:applicationId:mypackage:operation:1.0.0', require).should.equal(mypackage);
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
        describe('.array', function() {
          it('should be a function.', function() {
            var array = models.array;
            should.exist(array);
            array.should.be.a('function');
          });
          it('should return an array of model classes', function() {
            should.exist(models.array);
            var modelClasses = models.array();
            should.exist(modelClasses);
            modelClasses.should.be.an('array');
            modelClasses.length.should.equal(2);
            modelClasses[0].should.equal(models.FirstLargeObject);
            modelClasses[1].should.equal(models.SecondLargeObject);
          });
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

describe('moat.Utils', function() {
  it('should be frozen.', function() {
    Object.isFrozen(moat.Utils).should.equal(true);
  });
  it('should have static methods.', function() {
    moat.Utils.should.have.a.property('digest');
    moat.Utils.digest.should.be.a('function');
    moat.Utils.should.have.a.property('hmac');
    moat.Utils.hmac.should.be.a('function');
    moat.Utils.should.have.a.property('hex2b64');
    moat.Utils.hex2b64.should.be.a('function');
    moat.Utils.should.have.a.property('b642hex');
    moat.Utils.b642hex.should.be.a('function');
    moat.Utils.should.have.a.property('text2hex');
    moat.Utils.text2hex.should.be.a('function');
    moat.Utils.should.have.a.property('hex2text');
    moat.Utils.hex2text.should.be.a('function');
    moat.Utils.should.have.a.property('text2b64');
    moat.Utils.text2b64.should.be.a('function');
    moat.Utils.should.have.a.property('b642text');
    moat.Utils.b642text.should.be.a('function');
  });
  it('should be a singleton.', function() {
    new moat.Utils().should.equal(moat.Utils);
  });
  describe('.digest', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.digest('MD5');
      }).should.throw('Set the encoding, one of hex, b64 or plain is available.');
      (function() {
        moat.Utils.digest('MD5', 'hex');
      }).should.throw('value is missing');
      (function() {
        moat.Utils.digest('MD512', 'hex', 'servicesync');
      }).should.throw('Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
      (function() {
        moat.Utils.digest('MD5', 'binary', 'servicesync');
      }).should.throw('Set the encoding, one of hex, b64 or plain is available.');
      (function() {
        moat.Utils.digest('MD5', 'hex', true);
      }).should.throw('value should be string.');
    });
    it('should return the valid digest value.', function() {
      moat.Utils.digest('MD5', 'hex', 'servicesync').should.equal('9936b41329a55c42dc87f6cd53ff93a2');
      moat.Utils.digest('MD5', 'b64', 'servicesync').should.equal('mTa0EymlXELch/bNU/+Tog==');
      moat.Utils.digest('SHA1', 'hex', 'servicesync').should.equal('49e09261cd886ce484f638c9264d2ce82d92d9a7');
      moat.Utils.digest('SHA1', 'b64', 'servicesync').should.equal('SeCSYc2IbOSE9jjJJk0s6C2S2ac=');
      moat.Utils.digest('SHA256', 'hex', 'servicesync').should.equal('ee9a6e168d76c3c95d658e6d3fd0a55105516b924dfb8c5ca40c683a1b696867');
      moat.Utils.digest('SHA256', 'b64', 'servicesync').should.equal('7ppuFo12w8ldZY5tP9ClUQVRa5JN+4xcpAxoOhtpaGc=');
    });
  });
  describe('.hmac', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.hmac('MD5');
      }).should.throw('Set the encoding, one of hex, b64 or plain is available.');
      (function() {
        moat.Utils.hmac('MD5', 'hex');
      }).should.throw('secret is missing.');
      (function() {
        moat.Utils.hmac('MD5', 'hex', 'secret');
      }).should.throw('value is missing');
      (function() {
        moat.Utils.hmac('MD512', 'hex', 'secret', 'servicesync');
      }).should.throw('Set the algorithm, one of MD5, SHA1, or SHA256 is available.');
      (function() {
        moat.Utils.hmac('MD5', 'binary', 'secret', 'servicesync');
      }).should.throw('Set the encoding, one of hex, b64 or plain is available.');
      (function() {
        moat.Utils.hmac('MD5', 'hex', true, true);
      }).should.throw('secret should be string.');
      (function() {
        moat.Utils.hmac('MD5', 'hex', 'secret', true);
      }).should.throw('value should be string.');
    });
    it('should return the valid digest value.', function() {
      moat.Utils.hmac('MD5', 'hex', 'secret',  'servicesync').should.equal('e60b80135cb37c1eda1c4c3a0418d243');
      moat.Utils.hmac('MD5', 'b64', 'secret', 'servicesync').should.equal('5guAE1yzfB7aHEw6BBjSQw==');
      moat.Utils.hmac('SHA1', 'hex', 'secret', 'servicesync').should.equal('174d89b7793814f0169d7fd0ee9d8cecfbec98b8');
      moat.Utils.hmac('SHA1', 'b64', 'secret', 'servicesync').should.equal('F02Jt3k4FPAWnX/Q7p2M7PvsmLg=');
      moat.Utils.hmac('SHA256', 'hex', 'secret', 'servicesync').should.equal('5bc512af727da8cea6af0d8861b6b60186d4a0723dc24539d53f3e09fe79c3c9');
      moat.Utils.hmac('SHA256', 'b64', 'secret', 'servicesync').should.equal('W8USr3J9qM6mrw2IYba2AYbUoHI9wkU51T8+Cf55w8k=');
    });
  });
  describe('.hex2b64', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.hex2b64();
      }).should.throw('hex is missing.');
      (function() {
        moat.Utils.hex2b64(true);
      }).should.throw('hex should be string.');
      (function() {
        // the size is odd.
        moat.Utils.hex2b64('e60b80135cb37c1eda1c4c3a0418d24');
      }).should.throw('Invalid hex string');
    });
    it('should return the valid converted value.', function() {
      moat.Utils.hex2b64('e60b80135cb37c1eda1c4c3a0418d243').should.equal('5guAE1yzfB7aHEw6BBjSQw==');
    });
  });
  describe('.b642hex', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.b642hex();
      }).should.throw('b64 is missing.');
      (function() {
        moat.Utils.b642hex(true);
      }).should.throw('b64 should be string.');
    });
    it('should return the valid converted value.', function() {
      moat.Utils.b642hex('5guAE1yzfB7aHEw6BBjSQw==').should.equal('e60b80135cb37c1eda1c4c3a0418d243');
    });
  });
  describe('.text2hex', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.text2hex();
      }).should.throw('text is missing.');
      (function() {
        moat.Utils.text2hex(true);
      }).should.throw('text should be string.');
    });
    it('should return the valid converted value.', function() {
      moat.Utils.text2hex('servicesync').should.equal('7365727669636573796e63');
      moat.Utils.text2hex('utf-8', 'servicesync').should.equal('7365727669636573796e63');
    });
  });
  describe('.hex2text', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.hex2text();
      }).should.throw('hex is missing.');
      (function() {
        moat.Utils.hex2text(true);
      }).should.throw('hex should be string.');
    });
    it('should return the valid converted value.', function() {
      moat.Utils.hex2text('7365727669636573796e63').should.equal('servicesync');
      moat.Utils.hex2text('utf-8', '7365727669636573796e63').should.equal('servicesync');
    });
  });
  describe('.text2b64', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.text2b64();
      }).should.throw('text is missing.');
      (function() {
        moat.Utils.text2b64(true);
      }).should.throw('text should be string.');
    });
    it('should return the valid converted value.', function() {
      moat.Utils.text2b64('servicesync').should.equal('c2VydmljZXN5bmM=');
      moat.Utils.text2b64('utf-8', 'servicesync').should.equal('c2VydmljZXN5bmM=');
    });
  });
  describe('.b642text', function() {
    it('should not accept the wrong parameters.', function() {
      (function() {
        moat.Utils.b642text();
      }).should.throw('b64 is missing.');
      (function() {
        moat.Utils.b642text(true);
      }).should.throw('b64 should be string.');
    });
    it('should return the valid converted value.', function() {
      moat.Utils.b642text('c2VydmljZXN5bmM=').should.equal('servicesync');
      moat.Utils.b642text('utf-8', 'c2VydmljZXN5bmM=').should.equal('servicesync');
    });
  });
});
