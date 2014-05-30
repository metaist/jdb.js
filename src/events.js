define(['./_', './core'], function (_, jdb) {
  // EVENTS - data event callbacks //
  'use strict'; // build ignore:line
  var fn = {};  // build ignore:line

  var
    rnotwhite = (/\S+/g), //jquery.js:3028
    rbefore = (/^before/i);

  // Attach an event handler.
  fn.on = function (events, callback) {
    var db = this._root || this;
    _.each(events.match(rnotwhite), function (event) {
      event = event.toLowerCase();
      if (!_.inArray(callback, db._on[event])) {
        db._on[event].push(callback);
      }//end if: added callback
    });
    return db;
  };

  // Remove one or more event handlers.
  fn.off = function (events, callback) {
    var db = this._root || this;
    _.each(events.match(rnotwhite), function (event) {
      event = event.toLowerCase();
      if (!callback) { // clear all
        db._on[event] = {};
      } else { // clear one callback
        var pos = db._on[event].indexOf(callback);
        if (pos > -1) { db._on[event].splice(pos, 1); }
      }//end if: removed callback
    });
    return db;
  };

  // Trigger an event handler.
  fn.trigger = function (events, items, args) {
    var
      db = this._root || this,
      result = this;
    args = args || [];

    _.each(events.match(rnotwhite), function (name) {
      name = name.toLowerCase();
      if (!rbefore.test(name)) {
        args.unshift(items);
        _.each(db._on[name], function (f) { f.apply(items, args); });
      } else { // special before events
        args.unshift(null);
        for(var i = 0, L = db._on[name].length; i < L; i++) {
          args[0] = items;
          items = db._on[name][i].apply(items, args);
          if (_.isFalsy(items)) { items = []; }
        }//end for
        result = items;
      }//end if: callbacks fired
    });

    return result;
  };

  /* build ignore:start */
  _.extend(jdb.fn, fn);
  return fn;
  /* build ignore:end */
});
