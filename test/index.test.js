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
      var obj = new moat.ServerContext();
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  it('should be a type of moat.Context.', function() {
    var obj = new moat.ServerContext();
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [dmjob, modelObjects, database].', function() {
    var obj = new moat.ServerContext();
    obj.should.have.a.property('dmjob');
    obj.should.have.a.property('modelObjects');
    obj.should.have.a.property('database');
  });
  describe('constructor', function() {
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ServerContext();
      }).should.throw('This is not a function.');
    });
  });
  describe('#httpSync', function() {
    it('should fail prior to moat.spi.Config#done() being invoked.', function() {
      (function () {
        new moat.ServerContext().httpSync();
      }).should.throw('Not yet configured.');
    });
  });
  describe('#findPackage', function() {
    it('should fail prior to moat.spi.Config#done() being invoked.', function() {
      (function () {
        new moat.ServerContext().findPackage();
      }).should.throw('Not yet configured.');
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
  describe('runtime', function() {
    it('should be sealed so that users cannot add/remove but edit properties.', function() {
      var config = new moat.spi.Config();
      config.runtime.foo = 'yay!';
      should.not.exist(config.runtime.foo);
      config.runtime.version = 'yay!';
      config.runtime.version.should.equal('yay!');
      config.runtime.engine = 'servicesync';
      config.runtime.engine.should.equal('servicesync');
    });
  });
  describe('#done', function() {
    it('should return true when it is terminated without errors.', function() {
      var config = new moat.spi.Config();
      config.runtime.version = '1.0.0';
      config.runtime.engine = 'servicesync';
      config.serverContextProto.httpSync = function(options) {
        return 'OK! I was overwritten.';
      };
      config.serverContextProto.findPackage = function(object) {
        return 'OK! I was overwritten.';
      };
      config.done().should.equal(true);
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
    var obj = new moat.ServerContext();
    obj.should.be.an.instanceOf(moat.Context);
  });
  it('should have properties named [dmjob, modelObjects, database].', function() {
    var obj = new moat.ServerContext();
    obj.should.have.a.property('dmjob');
    obj.should.have.a.property('modelObjects');
    obj.should.have.a.property('database');
  });
  describe('instance', function() {
    it('should be sealed and frozen.', function() {
      var obj = new moat.ServerContext();
      Object.isSealed(obj).should.equal(true);
      Object.isFrozen(obj).should.equal(true);
    });
  });
  describe('constructor', function() {
    it('should not be executed as a function as it is a constructor.', function() {
      (function () {
        moat.ServerContext();
      }).should.throw('This is not a function.');
    });
  });
  describe('#httpSync', function() {
    it('should be overwritten after moat.spi.Config#done() being invoked.', function() {
      new moat.ServerContext().httpSync().should.equal('OK! I was overwritten.');
    });
  });
  describe('#findPackage', function() {
    it('should be overwritten after moat.spi.Config#done() being invoked.', function() {
      new moat.ServerContext().findPackage().should.equal('OK! I was overwritten.');
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
    describe('mypackage(sample app package for testing)', function() {
      it('should have model classes as properties.', function() {
        mypackage.should.have.a.property('FirstLargeObject');
        mypackage.should.have.a.property('SecondLargeObject');
        Object.isSealed(mypackage.FirstLargeObject).should.equal(true);
        Object.isFrozen(mypackage.FirstLargeObject).should.equal(false);
      });
      describe('.FirstLargeObject', function() {
        it('should have mapper functions as class methods.', function() {
          var FirstLargeObject = mypackage.FirstLargeObject;
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
            var obj = new mypackage.FirstLargeObject();
            Object.isSealed(obj).should.equal(true);
            Object.isFrozen(obj).should.equal(false);
          });
          it('should have attributes declared in the package.json.', function() {
            var obj = new mypackage.FirstLargeObject();
            obj.should.have.a.property('name');
            obj.should.have.a.property('timestamp');
            obj.should.have.a.property('file');
            obj.should.have.a.property('binary');
          });
          it('should have command functions declared in the package.json.', function() {
            var obj = new mypackage.FirstLargeObject();
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
            var obj = new mypackage.FirstLargeObject();
            obj.name = 'myname';
            obj.name.should.equal('myname');
          });
        });
        describe('#downloadToLocal', function() {
          it('should be overridden.', function() {
            var obj = new mypackage.FirstLargeObject();
            should.exist(obj.downloadToLocal);
            obj.downloadToLocal = function(params, callback) {
              return 'ok';
            };
            obj.downloadToLocal().should.equal('ok');
          });
        });
      });
      describe('.SecondLargeObject', function() {
        describe('instance', function() {
          it('should be sealed but NOT frozen.', function() {
            var obj = new mypackage.SecondLargeObject();
            Object.isSealed(obj).should.equal(true);
            Object.isFrozen(obj).should.equal(false);
          });
        });
      });
    });
  });
});
