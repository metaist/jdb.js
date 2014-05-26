define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('merge');
  test('multiple update', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db
      .insert(tmp[0])
      .merge(tmp);

    deepEqual(db.select(false), tmp, 'Expect correct item insert.');
  });

  test('single update', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db
      .insert(tmp[0])
      .merge(tmp[1]);

    deepEqual(db.select(false), tmp, 'Expect correct item insert.');
  });

  test('string param', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db
      .insert(tmp[0])
      .merge(tmp, 'id');

    deepEqual(db.select(false), tmp, 'Expect correct item insert.');
  });

  test('bool param', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db
      .insert(tmp[0])
      .merge(tmp, false);

    deepEqual(db.select(false), tmp, 'Expect correct item insert.');
  });

  test('object param', function () {
    db = jdb();
    tmp = S.records().slice(0, 2);

    db
      .insert(tmp[0])
      .merge(tmp, {field: 'id', events: false});

    deepEqual(db.select(false), tmp, 'Expect correct item insert.');
  });
});
