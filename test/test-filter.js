define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('filter');
  test('function', function () {
    db = jdb(S.records()).filter(S.isMale);
    tmp = S.records().filter(S.isMale);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('field function', function () {
    db = jdb(S.records()).find({gender: S.isMale});
    tmp = S.records().filter(S.isMale);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('shorthand single criteria', function () {
    db = jdb(S.records()).find({id: 1});
    tmp = S.records().filter(function (i) { return 1 === i.id; });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('shorthand multiple criteria', function () {
    db = jdb(S.records()).find({id: 1, gender: 'M'});
    tmp = S.records().filter(function (i) { return 1 === i.id && 'M' === i.gender; });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('array multiple criteria', function () {
    db = jdb(S.records()).find([{id: 1}, {gender: 'M'}]);
    tmp = S.records().filter(function (i) { return 1 === i.id || 'M' === i.gender; });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('shorthand array', function () {
    db = jdb(S.records()).find({id: [1, 2]});
    tmp = S.records().filter(function (i) { return 1 === i.id || 2 === i.id; });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('shorthand regex array', function () {
    var R1 = /^H/, R2 = / .*e/;
    db = jdb(S.records()).find({name: [R1, R2]});
    tmp = S.records().filter(function (i) { return R1.test(i.name) || R2.test(i.name); });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('shorthand array-to-array', function () {
    var R1 = /^H/;
    db = jdb(S.records());
    db.each(function (record) {
      record.vals = [record.name, record.name.split('').reverse().join('')];
    });
    db = db.find({vals: [/^H/, /H$/]});
    tmp = S.records().filter(function (i) { return R1.test(i.name); });
    
    deepEqual(db.select({_id: false, vals: false}), tmp, 'Expect filtered results.');
  });

  test('chained', function () {
    db = jdb(S.records()).filter(S.isMale).find({age: { '!>': 20, '<': 50 }});
    tmp = S.records().filter(function (i) { return 'M' === i.gender && i.age <= 20 && i.age < 50; });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('compare/equal', function () {
    db = jdb(S.records()).find({age: { '>=': 20, '<=': 50 }});
    tmp = S.records().filter(function (i) { return i.age >= 20 && i.age <= 50; });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('regex', function () {
    var R = /^H/;
    db = jdb(S.records()).find({name: { 'regex': R }});
    tmp = S.records().filter(function (i) { return R.test(i.name); });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('shorthand regex', function () {
    var R = /^H/;
    db = jdb(S.records()).find({name: R});
    tmp = S.records().filter(function (i) { return R.test(i.name); });

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('slice', function () {
    db = jdb(S.records()).slice(1, 2);
    tmp = S.records().slice(1, 2);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('eq - positive', function () {
    db = jdb(S.records()).eq(2);
    tmp = S.records().slice(2, 3);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('eq - negative', function () {
    db = jdb(S.records()).eq(-2);
    tmp = S.records().slice(-2, -1);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('first', function () {
    db = jdb(S.records()).slice(1).first();
    tmp = S.records().slice(1, 2);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });

  test('last', function () {
    db = jdb(S.records()).last(2);
    tmp = S.records().slice(-2);

    deepEqual(db.select(false), tmp, 'Expect filtered results.');
  });
});
