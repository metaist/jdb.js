define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('sort');
  test('function', function () {
    var fn = function (a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : +1;
    };

    db = jdb(S.records());
    tmp = S.records().sort(fn);

    db.sort(fn);
    deepEqual(db.select(false), tmp, 'Expect sort to work.');
  });

  test('field name', function () {
    db = jdb(S.records());
    tmp = S.records().sort(function (a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : +1;
    });

    db.sort('name');
    deepEqual(db.select(false), tmp, 'Expect sort to work.');
  });

  test('multiple field names', function () {
    db = jdb(S.records());
    tmp = S.records().sort(function (a, b) {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : +1;
    }).sort(function (a, b) {
      return a.age === b.age ? 0 : a.age < b.age ? -1 : +1;
    });

    db.sort(['name', 'age']);
    deepEqual(db.select(false), tmp, 'Expect sort to work.');
  });
});
