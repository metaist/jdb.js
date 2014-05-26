define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('select');
  test('without id', function () {
    db = jdb(S.records());
    tmp = S.records();

    deepEqual(db.select(false), tmp, 'Expect to get all fields.');
  });

  test('with id', function () {
    db = jdb(S.records());
    tmp = S.records();

    deepEqual(db.select(), db.select(true), 'Expect equivalent results.');
    _.each(db.select(), function (record, idx) {
      var check = tmp[idx];
      check[jdb.options.id] = record[jdb.options.id]; // copy id field
      deepEqual(record, check, 'Expect same rows.');
    });
  });

  test('single field', function () {
    db = jdb(S.records());
    tmp = _.map(S.records(), function (r) { return { name: r.name }; });

    deepEqual(db.select('name', false), tmp, 'Expect string style select.');
    deepEqual(db.select(['name'], false), tmp, 'Expect array style select.');
    deepEqual(db.select({'name': 1}, false), tmp, 'Expect mongodb style select.');
    deepEqual(db.select({'name': true}, false), tmp, 'Expect extended mongodb style select.');
  });

  test('multiple fields', function () {
    db = jdb(S.records());
    tmp = _.map(S.records(), function (r) {
      return { name: r.name, age: r.age };
    });

    deepEqual(db.select(['name', 'age'], false), tmp, 'Expect array style select.');
    deepEqual(db.select({'name': 1, 'age': 1}, false), tmp, 'Expect mongodb style select.');
    deepEqual(db.select({'name': true, 'age': true}, false), tmp, 'Expect extended mongodb style select.');
  });

  module('index');
  test('no field', function () {
    db = jdb(S.records());
    tmp = {};
    db.each(function (r) { tmp[r._id] = r; });

    deepEqual(db.index(), tmp, 'Expect correct index.');
  });

  test('single field', function () {
    db = jdb(S.records());
    tmp = {};
    db.each(function (r) { tmp[r.name] = r; });

    deepEqual(db.index('name'), tmp, 'Expect correct index.');
  });

  test('function', function () {
    db = jdb(S.records());
    tmp = {};
    db.each(function (r) { tmp[r.name + r.age] = r; });

    deepEqual(db.index(function (r) { return r.name + r.age; }), tmp, 'Expect correct index.');
  });
});
