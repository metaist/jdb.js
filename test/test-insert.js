define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('insert');
  test('before event', function () {
    db = jdb();
    tmp = S.records().filter(S.isMale);

    db.on('beforeinsert', function (r) { return r.filter(S.isMale); });
    db.insert(S.records());
    deepEqual(db.select(false), tmp, 'Expect only males.');
  });

  test('new records', function () {
    db = jdb();
    tmp = S.records()[0];

    db.insert(tmp);
    deepEqual(db.select(false), [tmp], 'Expect correct item insert.');
  });

  test('into subset', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db.insert(tmp[0]);
    deepEqual(db.select(false), [tmp[0]], 'Expect item insert.');

    var f = db.filter(S.isMale).insert(tmp[1]);
    deepEqual(db.select(false), [tmp[0], tmp[1]], 'Expect root updated.');
    deepEqual(f.select(false), [tmp[0], tmp[1]], 'Expect filter updated.');
  });

  test('double filter', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db.insert(tmp[0]);

    var f = db.filter(S.isMale).filter({age: { '>': 20}}).insert(tmp[1]);
    deepEqual(db.select(false), [tmp[0], tmp[1]], 'Expect root updated.');
    deepEqual(f.end().select(false), [tmp[0]], 'Expect 1st filter not updated.');
    deepEqual(f.select(false), [tmp[1]], 'Expect 2nd filter updated.');
  });

  test('after event', function () {
    expect(1);

    db = jdb();
    tmp = S.records()[0];

    db.on('insert', function () {
      tmp._id = this._id;
      deepEqual(this, tmp, 'Expect callback function.');
    });

    db.insert(tmp);
  });
});
