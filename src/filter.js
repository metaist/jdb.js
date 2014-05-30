define(['./_', './core'], function (_, jdb) {
  // FILTER - find and sort rows //
  'use strict'; // build ignore:line
  var fn = {};  // build ignore:line

  // Get a subset of the items. (Similar to Array#slice)
  // See: http://api.jquery.com/slice/
  fn.slice = function (start, end) {
    var db = this, obj;
    obj = jdb(_.slice.call(db, start, end));
    obj._root = this._root || this;
    obj._prev = this;
    return obj;
  };

  // Get the item at the given index.
  // See: http://api.jquery.com/eq/
  fn.eq = function (num) {
    if (_.isMissing(num)) { return this.slice(0, 0); }
    return this.slice(num, num + 1);
  };

  // Get the first n items.
  fn.first = function (num) {
    if (_.isMissing(num)) { num = 1; }
    return this.slice(0, num);
  };

  // Get the last n items.
  fn.last = function (num) {
    if (_.isMissing(num)) { num = 1; }
    return this.slice(-num);
  };

  // Return a previous record set.
  fn.end = function () { return this._prev || this; };

  // Comparison operators.
  // See: http://docs.mongodb.org/manual/reference/operator/query/#query-selectors
  jdb.cmp = { // not on the prototype
    '<': function (a, b) { return a < b; },
    '<=': function (a, b) { return a <= b; },
    '=': function (a, b) { return _.isEqual(a, b); },
    '>': function (a, b) { return a > b; },
    '>=': function (a, b) { return a >= b; },
    'regex': function (a, b) { return b.test(a); },
    'in': function (a, b) {
      var result = false;
      if (_.isArray(a)) {
        _.each(a, function (t) {
          result = result || jdb.cmp['in'](t, b);
          if (result) { return _.END_LOOP; }
        });
        return result;
      }//end if: processed array

      _.each(b, function (t) {
        switch(_.type(t)) {
        case 'regexp':
          result = result || t.test(a);
          break;
        default:
          result = result || jdb.cmp['='](a, t);
        }//end switch
        if (result) { return _.END_LOOP; }
      });
      return result;
    },
  };

  // Internal field checker.
  var check_field = function (obj, a, op, b) {
    var result = true, neg = false;
    if ('!' === op[0]) {
      neg = true;
      op = op.substring(1);
    }//end if: check invert

    if (!_.has(jdb.cmp, op)) { throw new TypeError('No operator: ' + op); }
    result = jdb.cmp[op].call(obj, a, b);

    return neg ? !result : result;
  };

  // Internal filter function.
  // See: http://docs.mongodb.org/manual/tutorial/query-documents/
  jdb.test = function (item, rule) {
    var result = false;

    switch (_.type(rule)) {
    case 'array': // OR
      result = false;
      _.each(rule, function (subrule) {
        result = result || jdb.test(item, subrule);
        if (result) { return _.END_LOOP; } // short-circuit
      });
      break;
    case 'object': // AND
      result = true;
      _.each(rule, function (subrule, field) {
        switch (_.type(subrule)) {
        case 'object': // common: {field: {op: val}}
          _.each(subrule, function (val, op) {
            result = result && check_field(item, item[field], op, val);
            if (!result) { return _.END_LOOP; } // short-circuit
          });
          break;
        case 'array': // shorthand: {field: [val, val]}
          result = result && check_field(item, item[field], 'in', subrule);
          break;
        case 'regexp': // shorthand: {field: /regex/}
          result = result && check_field(item, item[field], 'regex', subrule);
          break;
        case 'function': // custom: {field: function (item, val) { return true; })
          result = result && subrule.call(item, item, item[field]);
          break;
        default: // shorthand: {field: val}
          result = result && check_field(item, item[field], '=', subrule);
        }//end switch: field checked
        if (!result) { return _.END_LOOP; } // short-circuit
      });
      break;
    }//end switch: rule checked
    return result;
  };

  // Filter records by selector.
  fn.filter = fn.find = function (selector) {
    var db = this,
      rows = [],
      item, test, idx = db.length;

    if (!selector) { return this; }
    if (!_.isFunction(selector)) {
      var criteria = selector;
      selector = function (item) { return jdb.test(item, criteria); };
    }//end if: have a selector

    var obj = jdb();
    obj._root = this._root || this;
    obj._prev = this;

    db.each(function (item) {
      if (true === selector.call(item, item)) { obj.push(item); }
    });

    return obj;
  };

  /* build ignore:start */
  _.extend(jdb.fn, fn);
  return fn;
  /* build ignore:end */
});
