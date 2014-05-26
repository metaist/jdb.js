define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('events');
  test('remove all', function () {
    expect(0);

    db = jdb();
    tmp = function () { ok(false, 'Do not expect to be called.'); };

    db
      .on('beforeinsert', tmp)
      .off('beforeinsert')
      .insert({a: 1});
  });

  test('remove one', function () {
    expect(1);

    db = jdb();
    var fn1 = function () { ok(false, 'Do not expect to be called.'); };
    var fn2 = function () { ok(true, 'Expect to be called.'); };

    db
      .on('beforeinsert', fn1)
      .on('beforeinsert', fn2)
      .off('beforeinsert', fn1)
      .insert({a: 1});
  });
});
