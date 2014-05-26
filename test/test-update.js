define(function (require) {
  var
    _ = require('src/_'),
    S = require('setup.js'),
    jdb = require('src/jdb'),
    db, tmp;

  module('update');
  test('before event', function () {
    var
      updates = {updated: true},
      males = S.records().filter(S.isMale);

    db = jdb(S.records());
    db.on('beforeupdate', function (items, diff) {
      equal(items.length, males.length, 'Expect only males.');
      deepEqual(diff, updates, 'Expect hash of changes.');
      return _.slice.call(items, 1);
    }).filter(S.isMale).update(updates);

    var mcount = 0;
    tmp = S.records();
    _.each(tmp, function (r, i) {
      if (S.isMale(r) && ++mcount > 1) { _.extend(r, updates); }
    });

    deepEqual(db.select(false), tmp, 'Expect items updated.');
  });

  test('all records', function () {
    db = jdb(S.records());
    db.update({updated: true});

    db.each(function () { ok(this.updated, 'Expect updated item.'); });
  });

  test('selected records', function () {
    expect(S.records().length);

    db = jdb(S.records());
    db.filter(S.isMale).update({updated: true});

    db.end().each(function () {
      if (S.isMale(this)) {
        ok(this.updated, 'Expect updated item.');
      } else {
        ok(!this.updated, 'Expect untouched item.');
      }
    });
  });

  test('after event', function () {
    expect(3 * S.records().filter(S.isMale).length);

    db = jdb(S.records());
    tmp = {};
    db.each(function (r) { tmp[r._id] = r; });

    db.on('update', function (item, old, diff) {
      equal(item.age, diff.age, 'Expect correct new value.');
      deepEqual(old.age, tmp[item._id].age, 'Expect correct existing value.');
      deepEqual(diff, {age: 10}, 'Expect correct change.');
    });

    db.filter(S.isMale).update({age: 10});
  });
});
