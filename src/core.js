define(['./_'], function (_) {
  // CORE - constructor //
  'use strict'; // build ignore:line

  /*jshint newcap:false*/

  // A list of records.
  var jdb = function (records) {
    if (records instanceof jdb) { return records; }
    if (!(this instanceof jdb)) { return new jdb(records); }

    var self = this;
    self._root = null; // initial set
    self._prev = null; // filter stack
    self._on = {};

    _.each('insert update merge remove'.split(' '), function (name) {
      self._on['before' + name] = [];
      self._on['after' + name] = [];
      self._on[name] = [];
    });

    if (records) { self.insert(records, false); }
    return self;
  };

  jdb.options = {
    id: '_id', // name of the id field
    events: true // default for calling events
  };

  var fn = jdb.fn = jdb.prototype = {
    version: '@VERSION',
    constructor: jdb,
    concat: _.concat,
    push: _.push,
    //slice: _.slice,
    //sort: _.sort,
    splice: _.splice,
    indexOf: _.indexOf,
    length: 0
  };

  // Create a new object with new identifiers.
  fn.clone = function () {
    return new jdb(this.get());
  };

  return jdb; // build ignore:line
});
