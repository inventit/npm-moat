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
    moat.should.not.be.a('function');
  });
  it('should be frozen so that users cannot modify it.', function() {
    moat.someprop = 'me';
    should.not.exist(moat.someprop);
    should.exist(moat.spi);
    delete moat.spi;
    should.exist(moat.spi);
  });
});

describe('moat.Runtime(not initialized)', function() {
  it('should be a function rather than an object.', function() {
    moat.Runtime.should.be.a('function');
    moat.Runtime.should.not.be.an('object');
  });
  it('should not be sealed and frozen prior to moat.spi.Config#done() being invoked.', function() {
    Object.isSealed(moat.Runtime).should.equal(false);
    Object.isFrozen(moat.Runtime).should.equal(false);
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
    moat.spi.should.not.be.a('function');
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
      config.done().should.equal(true);
    });
    it('should return false if "moat.Runtime" is frozen.', function() {
      var config = new moat.spi.Config();
      config.done().should.equal(false);
    });
  });
});

describe('moat.Runtime(initialized)', function() {
  it('should be frozen after moat.spi.Config#done() being invoked.', function() {
    Object.isSealed(moat.Runtime).should.equal(true);
    Object.isFrozen(moat.Runtime).should.equal(true);
  });
  describe('#singleton', function() {
    it('should return a Runtime singleton instance after moat.spi.Config#done() is invoked.', function() {
      moat.Runtime.singleton().should.be.a('object');
      moat.Runtime.singleton().should.be.an.instanceOf(moat.Runtime);
    });
  });
});
