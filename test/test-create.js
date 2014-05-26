define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('create');
  test('no records', function () {
    db = jdb();
    tmp = [];

    ok(db, 'Expect db to exist');
    deepEqual(db.select(false), tmp, 'Expect no items.');
  });

  test('existing records', function () {
    db = jdb(S.records());
    tmp = S.records();

    deepEqual(db.select(false), tmp, 'Expect all items.');
  });


  test('clone', function () {
    db = jdb(S.records());
    tmp = db.clone();

    deepEqual(db.select(false), tmp.select(false), 'Expect same items.');
    notDeepEqual(db.select(), tmp.select(), 'Expect different identifers.');
  });
});
