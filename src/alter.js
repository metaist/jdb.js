define(['./_', './core'], function (_, jdb) {
  // ALTER - insert, update, remove //
  'use strict'; // build ignore:line
  var fn = {};  // build ignore:line

  var guid = new Date().getTime();

  // Insert new records or update existing records.
  fn.merge = fn.upsert = function (items, options) {
    var
      db = this,
      altered = [],
      opts = {
        field: 'id',
        events: jdb.options.events
      };

    switch(_.type(options)) {
    case 'string':
      opts.field = options;
      break;
    case 'boolean':
      opts.events = options;
      break;
    case 'object':
      _.extend(opts, options);
      break;
    }//end switch: have options

    if (opts.events) { items = db.trigger('beforemerge', items); }//before

    var process = function (item) {
      var records, criteria = {};
      criteria[opts.field] = item[opts.field];
      records = db.find(criteria);
      if (records.length) {
        records.update(item, {events: opts.events});
      } else {
        records.insert(item, {events: opts.events});
      }//end if: update or insert

      if (opts.events) {
        altered.concat(records.get());
        db.trigger('merge', records);
      }//during
    };

    switch(_.type(items)) {
    case 'array': // multiple
      _.each(items, process);
      break;
    case 'object': // single
      process(items);
      break;
    }//end switch: processed items

    if (opts.events) { db.trigger('aftermerge', altered); }//after

    return this;
  };

  // Add records.
  fn.insert = fn.add = function (items, options) {
    var
      db = this,
      altered = [],
      opts = _.extend({events: jdb.options.events}, options);

    if (_.isBoolean(options)) { opts.events = options; }

    items = _.toArray(items); // ensure array
    if (opts.events) { items = db.trigger('beforeinsert', items); }//before

    _.each(items, function (item) {
      var clone = _.extend({}, item);
      clone[jdb.options.id] = ++guid;

      db.push(clone);
      altered.push(clone);
      if (db._root) { db._root.push(clone); } // add in the top-most level
      if (opts.events) { db.trigger('insert', clone); }//during
    });

    if (opts.events) { db.trigger('afterinsert', altered); } //after

    return this;
  };

  // Update the selected records.
  fn.update = fn.set = function (changes, options) {
    var
      db = this,
      altered = [],
      items = this.get(),
      opts = _.extend({events: jdb.options.events}, options),
      diff;

    if (_.isBoolean(options)) { opts.events = options; }

    if (opts.events) { items = db.trigger('beforeupdate', items, [changes]); }
    _.each(items, function (item) {
      diff = {};
      _.each(changes, function (v, k) {
        if (_.isFunction(v)) { v = v.call(item, item); }
        if (v !== item[k]) {
          diff[k] = v;
          item[k] = v;
        }//end if: set new value
      });

      if (opts.events && _.isTruthy(diff)) {
        altered.push(item);
        db.trigger('update', item, [item, diff]);
      }//after
    });

    if (opts.events) { db.trigger('afterupdate', altered); }//after

    return this;
  };

  // Remove the selected records.
  fn.remove = fn.del = function (options) {
    var
      db = this,
      altered = [],
      items = this.get(),
      opts = _.extend({events: jdb.options.events}, options),
      item, idx, ids = [];

    if (_.isBoolean(options)) { opts.events = options; }

    if (opts.events) { items = db.trigger('beforeremove', items); }//before
    _.each(items, function (item) { item[jdb.options.id] = null; }); // mark it null

    var isFirst = true;
    var clean = function (collection) {
      idx = collection.length;
      while (idx--) {
        item = collection[idx];
        if (null === item[jdb.options.id]) {
          collection.splice(idx, 1);
          if (isFirst && opts.events) {
            altered.push(item);
            collection.trigger('remove', item);
          }//after (only once)
        }//end if: removed
      }//end while: removed from collection
    };

    var set = this;
    while(set) {
      clean(set);
      set = set._prev;
      isFirst = false;
    }//end while: cleaned the chain

    if (opts.events) { db.trigger('afterremove', altered); }//after

    return this;
  };

  /* build ignore:start */
  _.extend(jdb.fn, fn);
  return fn;
  /* build ignore:end */
});
