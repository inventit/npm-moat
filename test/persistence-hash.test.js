var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var builder = require('../src/persistence-hash.js');

describe("persistence-hash module", function() {
  var MyModelClass = function() {};
  var mapper;
  it("should be a function rather than an object.", function() {
    builder.should.be.a('function');
  });
  it("should be configured with init() function.", function() {
    builder.init({});
    (function() {
      builder.init({maxSize:0});
    }).should.throw('maxSize should be a positive number.');
    builder.init({maxSize:3});
  });
  it("should create an object containing mapper functions.", function() {
    obj = builder(MyModelClass);
    should.exist(obj);
  });

  describe("mapper functions object", function() {
    it("should be an object rather than a function.", function() {
      obj.should.be.an('object');
    });
    it("should offer 'add' method.", function() {
      obj.should.have.a.property('add');
      obj.add.should.be.a('function');
    });
    describe("#add", function() {
      it("should not accept objects not derived from the defined class.", function() {
        (function() {
          obj.add(null);
        }).should.throw('entity is mandatory.');
        (function() {
          obj.add({});
        }).should.throw('Incompatible entity.');
        (function() {
          obj.add('a string');
        }).should.throw('Incompatible entity.');
      });
      it("should generate a UUID if entity.uid is missing.", function(done) {
        var entity = new MyModelClass();
        should.not.exist(entity.uid);
        obj.add(entity, function(error, result) {
          try {
            should.exist(entity.uid);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
      it("should not generate a UUID if entity.uid is available.", function(done) {
        var entity = new MyModelClass();
        entity.uid = 'boooom!';
        obj.add(entity, function(error, result) {
          try {
            should.exist(entity.uid);
            entity.uid.should.equal('boooom!');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
      it("should add a given entity if entity.id already exists.", function(done) {
        var entity = new MyModelClass();
        entity.uid = 'voooom!';
        obj.add(entity, function(error, result) {
          try {
            should.not.exist(error);
            should.exist(entity.uid);
            entity.uid.should.equal('voooom!');

            obj.add(entity, function(error, result) {
              try {
                should.exist(error);
                should.exist(error.message);
                error.message.should.equal('Duplicate entry, uid:voooom!');
                done();
              } catch (e) {
                done(e);
              }
            });
          } catch (e) {
            done(e);
          }
        });
      });
      it("should not accept a new entity if the size of the store reaches its max size.", function(done) {
        var entity = new MyModelClass();
        entity.uid = 'doooom!';
        obj.add(entity, function(error, result) {
          try {
            should.exist(error);
            should.exist(error.message);
            error.message.should.equal('Size full, remove entries prior to adding a new one. Size:3');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe("#update", function() {
      it("should not accept objects not derived from the defined class.", function() {
        (function() {
          obj.update(null);
        }).should.throw('entity is mandatory.');
        (function() {
          obj.update({});
        }).should.throw('Incompatible entity.');
        (function() {
          obj.update('a string');
        }).should.throw('Incompatible entity.');
        (function() {
          var entity = new MyModelClass();
          obj.update(entity);
        }).should.throw('entity.uid is mandatory.');
      });
      it("should update the given entity.", function(done) {
        var entity = new MyModelClass();
        entity.uid = 'boooom!';
        entity.prop1 = 'test';
        obj.update(entity, function(error, result) {
          try {
            should.not.exist(error);
            result.prop1.should.equal('test');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe("#updateFields", function() {
      it("should not accept objects not derived from the defined class.", function() {
        (function() {
          obj.updateFields(null);
        }).should.throw('entity is mandatory.');
        (function() {
          obj.updateFields({});
        }).should.throw('Incompatible entity.');
        (function() {
          obj.updateFields('a string');
        }).should.throw('Incompatible entity.');
        (function() {
          var entity = new MyModelClass();
          obj.updateFields(entity);
        }).should.throw('entity.uid is mandatory.');
        (function() {
          var entity = new MyModelClass();
          entity.uid = 'boooom!';
          obj.updateFields(entity);
        }).should.throw('[fields] variable is mandatory.');
        (function() {
          var entity = new MyModelClass();
          entity.uid = 'boooom!';
          obj.updateFields(entity, []);
        }).should.throw('[fields] variable is mandatory.');
        (function() {
          var entity = new MyModelClass();
          entity.uid = 'boooom!';
          obj.updateFields(entity, function() {});
        }).should.throw('[fields] variable should be an array.');
      });
      it("should update the given entity of the given fields.", function(done) {
        var entity = new MyModelClass();
        entity.uid = 'boooom!';
        entity.prop1 = 'new!';
        entity.prop2 = 999;
        obj.updateFields(entity, ['prop1', 'prop2'], function(error, result) {
          try {
            should.not.exist(error);
            result.prop1.should.equal('new!');
            result.prop2.should.equal(999);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe("#remove", function() {
      it("should always require uid.", function() {
        (function() {
          obj.remove();
        }).should.throw('uid is mandatory.');
        (function() {
          obj.remove(null);
        }).should.throw('uid is mandatory.');
        (function() {
          obj.remove({});
        }).should.throw('uid should be string.');
      });
      it("should remove an entity identified by the uid.", function(done) {
        obj.remove('boooom!', function(error, result) {
          try {
            should.not.exist(error);
            result.uid.should.equal('boooom!');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
      it("should return an error when the given uid is missing.", function(done) {
        obj.remove('boooom!', function(error, result) {
          try {
            should.exist(error);
            error.message.should.equal('Missing entry, uid:boooom!');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe("#findByUid", function() {
      it("should always require uid.", function() {
        (function() {
          obj.findByUid();
        }).should.throw('uid is mandatory.');
        (function() {
          obj.findByUid(null);
        }).should.throw('uid is mandatory.');
        (function() {
          obj.findByUid({});
        }).should.throw('uid should be string.');
        (function() {
          obj.findByUid('boooom');
        }).should.throw('callback is mandatory.');
      });
      it("should return an entity identified by the uid.", function(done) {
        obj.findByUid('voooom!', function(error, result) {
          try {
            should.not.exist(error);
            result.uid.should.equal('voooom!');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
      it("should return an error when the given uid is missing.", function(done) {
        obj.findByUid('no-such-uid!!', function(error, result) {
          try {
            should.exist(error);
            error.message.should.equal('Missing entry, uid:no-such-uid!!');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe("#findAllUids", function() {
      it("should always require uid.", function() {
        (function() {
          obj.findAllUids();
        }).should.throw('callback is mandatory.');
      });
      it("should return all uids.", function(done) {
        obj.findAllUids(function(error, uidArray) {
          try {
            should.not.exist(error);
            uidArray.length.should.equal(2);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe("#count", function() {
      it("should always require uid.", function() {
        (function() {
          obj.count();
        }).should.throw('callback is mandatory.');
      });
      it("should return all uids.", function(done) {
        obj.count(function(error, length) {
          try {
            should.not.exist(error);
            length.should.equal(2);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

  });
});
