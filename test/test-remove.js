define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('remove');
  test('before event', function () {
    db = jdb(S.records());
    tmp = S.records().filter(function (r) { return !S.isMale(r); });

    db.on('beforeremove', function (items) { return items.filter(S.isMale); });
    db.remove();
    deepEqual(db.select(false), tmp, 'Expect some records removed.');
  });

  test('all records', function () {
    db = jdb(S.records());
    tmp = [];

    db.remove();
    deepEqual(db.get(), tmp, 'Expect all records removed.');
  });

  test('selected records', function () {
    db = jdb(S.records());
    tmp = S.records().filter(function (r) { return !S.isMale(r); });

    var f = db.filter(S.isMale).remove();
    deepEqual(f.select(false), [], 'Expect nothing selected.');
    deepEqual(db.select(false), tmp, 'Expect correct items.');
  });

  test('double filter', function () {
    db = jdb(S.records());
    tmp = S.records().filter(function (r) {
      return !(S.isMale(r) && r.age > 20);
    });

    db.filter(S.isMale).filter({ age: { '>': 20 }}).remove();
    deepEqual(db.select(false), tmp, 'Expect correct items.');
  });

  test('after event', function () {
    db = jdb(S.records());
    tmp = S.records().filter(function (r) { return !S.isMale(r); });

    db.on('remove', function (item) {
      ok(S.isMale(item), 'Expect correct items removed.');
    });

    db.filter(S.isMale).remove().end();

    deepEqual(db.select(false), tmp, 'Expect correct items.');
  });
});
