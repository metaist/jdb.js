/*! jdb v0.0.1 | (c) 2014 metaist | http://opensource.org/licenses/MIT */
(function (factory) { 
  if ('function' === typeof define && define.amd) {
    define(['jquery'], factory); // register anonymous AMD module
  } else { factory(jQuery); } // browser globals
}(function ($) {

  // Mashup of jQuery (1.11.0) and Underscore (1.6.0) functions. MIT License.

  // Baseline setup
  // --------------

  // underscore.js:17
  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // underscore.js:20
  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype,
      ObjProto = Object.prototype;
      //FuncProto = Function.prototype;

  // underscore.js:23
  // Create quick reference variables for speed access to core prototypes.
  var
  //  push = ArrayProto.push,
      slice = ArrayProto.slice,
  //  concat = ArrayProto.concat,
      toString = ObjProto.toString,
      hasOwn = ObjProto.hasOwnProperty;

  // jquery.js:54
  var
    indexOf = ArrayProto.indexOf;

  // underscore.js:31
  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    //nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys;
    //nativeBind         = FuncProto.bind;

  var _ = {};

  // Collection Functions
  // --------------------

  // Expose out a way to end `each` loops.
  _.END_LOOP = breaker;

  // underscore.js:64; jquery.js:355 (compromised)
  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iterator, context) {
    if (null === obj || void 0 === obj) { return obj; }
    var i, length, thisVar;
    if (obj.length === +obj.length) { // array-like
      for (i = 0, length = obj.length; i < length; i++) {
        thisVar = context || obj[i];
        if (breaker === iterator.call(thisVar, obj[i], i, obj)) { return; }
      }
    } else { // object-like
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        thisVar = context || obj[keys[i]];
        if (breaker === iterator.call(thisVar, obj[keys[i]], keys[i], obj)) { return; }
      }
    }

    return obj;
  };

  // underscore.js:82
  // Return the results of applying the iterator to each element.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [], thisVar;
    if (null === obj || void 0 === obj) return results;
    _.each(obj, function(value, index, list) {
      thisVar = context || value;
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  // Array Functions
  // ---------------

  // (custom)
  // Expose Prototype Array Methods
  _.each('concat push slice sort splice'.split(' '), function () {
    _[this] = ArrayProto[this];
  });

  // jquery.js:437 (renamed)
  // Return the position of element within the array; -1 otherwise.
  // Delegate to the native `indexOf` method.
  _.indexOf = function(elem, arr, i) {
    return (null === arr || void 0 === arr) ? -1 : indexOf.call(arr, elem, i);
  };

  // (custom)
  // Return true if the item appears in the array; false otherwise.
  _.inArray = function (elem, arr, i) {
    return _.indexOf(elem, arr, i) > -1;
  };

  // jquery.js:459
  // Combine the elements in `second` into `first`.
  _.merge = function(first, second) {
    var len = +second.length,
      j = 0,
      i = first.length;

    while (j < len) { first[i++] = second[j++]; }

    // Support: IE<9
    // Workaround casting of .length to NaN on otherwise arraylike objects
    // (e.g., NodeLists)
    if (len !== len) {
      while (void 0 !== second[j]) { first[i++] = second[j++]; }
    }

    first.length = i;
    return first;
  };

  // Object Functions
  // ----------------

  // underscore.js:790
  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // underscore:842
  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    _.each(slice.call(arguments, 1), function(source) {
      if (source) { for (var prop in source) { obj[prop] = source[prop]; } }
    });
    return obj;
  };

  // underscore.js:911
  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;  // jshint ignore:line
    // Compare `[[Class]]` names.
    var type = _.type(a);
    if (type !== _.type(b)) return false;
    switch (type) {
      // Strings, numbers, dates, and booleans are compared by value.
      case 'string':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case 'number':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b); // jshint ignore:line
      case 'date':
      case 'boolean':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case 'regexp':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor)) &&
                             ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if ('array' === type) {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // underscore.js:1003
  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // underscore.js:1081
  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwn.call(obj, key);
  };

  // (custom)
  // Get a property using a dot-notation.
  _.dot = function (obj, key) {
    if (!key) { return void 0; }
    var result = obj;
    _.each(key.split('.'), function (field) {
      if (_.has(result, field)) {
        result = result[field];
      } else {
        result = void 0;
        return _.END_LOOP;
      }//end if: check dotted field
    });
    return result;
  };


  // Utility Functions
  // -----------------

  // underscore.js:1105
  _.noop = function(){};

  // underscore.js:1094
  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // underscore.js:1099
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  // underscore.js:1107
  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Type Functions
  // --------------

  var knownTypes = {};

  // jquery.js:574
  // Populate the known classes.
  _.each(
    'Boolean Number String Function Array Date RegExp Object Error'.split(' '),
    function (t) {
      knownTypes['[object ' + t + ']'] = t.toLowerCase();
      _['is' + t] = function (obj) { return _.isType(obj, t); };
    });

  // jquery:321
  // Return a string indicating the type of the object.
  _.type = function (obj) {
    if (_.isNullish(obj)) { return obj + ''; }
    var t = typeof obj;
    return 'object' === t || 'function' === t ?
           knownTypes[toString.call(obj)]  || 'object' : t;
  };

  // (custom)
  // Return true if object is one of the given types.
  _.isType = function (obj, t) {
    if (arguments.length > 2) {
      return _.inArray(_.type(obj), arguments.slice(1));
    } else { return t.toLowerCase() === _.type(obj); }
  };

  // (custom)
  _.isNull = function (obj) {
    return null === obj;
  };

  _.isUndefined = function (obj) {
    return void 0 === obj;
  };

  _.isMissing = _.isNullish = function (obj) {
    return null === obj || void 0 === obj;
  };

  _.isTruthy = function (obj) {
    return !_.isFalsy(obj);
  };

  _.isFalsy = function (obj) {
    if (_.isArray(obj)) { return 0 === obj.length; }
    if (_.isObject(obj)) { return 0 === _.keys(obj).length; }
    return _.inArray(obj, [0, false, null, void 0]);
  };

  // (custom)
  _.toArray = function (item) {
    if (_.isArray(item)) { return item; }
    if (_.has(item, 'length')) { return _.merge([], item); }
    return [item];
  };

  // (custom)
  _.toBoolean = function (item) {
    return !!item;
  };

  


  // CORE - constructor //

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
    version: '0.0.1',
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




  // EVENTS - data event callbacks //


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

  


  // ALTER - insert, update, remove //


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

  


  // FILTER - find and sort rows //


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

  


  // SORT - sort records //


  var
    rsortdesc = / desc$/i,
    rsortsuffix = / (a|de)sc$/i;

  // Sort this record set in place.
  fn.sort = function (compare) {
    switch(_.type(compare)) {
    case 'array': // multiple items
      var self = this;
      _.each(compare, function(f) { self.sort(f); });
      break;
    case 'function': // traditional sort
      _.sort.call(this, compare);
      break;
    case 'string': // single field
      var op = rsortdesc.test(compare) ? '<' : '>', fn;
      compare = compare.replace(rsortsuffix, '');
      _.sort.call(this, function (a, b) {
        var x = a[compare], y = b[compare];
        return x === y ? 0 : jdb.cmp[op](x, y) ? 1 : -1;
      });
      break;
    }//end switch: sorted
    return this;
  };

  


  // SELECT - pick fields //


  // Iterate over each record.
  fn.each = function (iterator) { return _.each(this, iterator); };

  // Map a function over each record.
  fn.map = function (iterator) { return _.map(this, iterator); };

  // Get the selected objects as an array.
  fn.get = function (num) {
    return null === num || void 0 === num ?
           _.slice.call(this) : // array
           (num < 0 ? this[num + this.length] : this[num]); // single
  };

  // Return an index.
  fn.index = function (field) {
    var result = {}, key;
    this.each(function (record) {
      switch(_.type(field)) {
      case 'undefined': /* falls through */
      case 'null':
        key = record[jdb.options.id];
        break;
      case 'string':
        key = record[field];
        break;
      case 'function':
        key = field.call(record, record);
        break;
      }//end switch: item indexed

      if (_.has(result, key)) { throw new RangeError('Duplicate key: ' + key);
      } else { result[key] = record; }
    });

    return result;
  };

  /**
    Select fields from each record.
    Control _id field:
      db.select(false)
      db.select(false, 'field')
      db.select(false, ['field1', 'field2'])
      db.select(true)

    Single Field:
      db.select('field') // include
      db.select('!field') // exclude

    Multiple Fields:
      db.select(['field1', 'field2'])
      db.select(['!_id', 'field1'])

    Mongo-style Syntax:
    @see http://docs.mongodb.org/manual/tutorial/project-fields-from-query-results/
      db.select({field1: 1, field2: 1}) // include
      db.select({field1: 0, field2: 0}) // exclude
      db.select({_id: 0, field: 1}) // exclude _id, but include other fields
  */
  fn.select = function (fields, options) {
    var
      rules = {},
      opts = {
        addId: true,
        addMode: true
      };

    if (_.isBoolean(fields)) { // (boolean)
      opts.addId = fields;
      fields = [];
    } else if (_.isBoolean(options)) { // (any, boolean)
      opts.addId = options;
    } else { // (any, any)
      _.extend(opts, options);
    }//end if: param matching
    rules[jdb.options.id] = opts.addId;

    var add_field = function (field, include) {
      if (_.isUndefined(include)) {
        include = ('!' !== field[0]);
        if (!include) { field = field.substring(1); }
      }//end if: process field name

      include = _.toBoolean(include);
      if (include) { opts.addMode = false; }
      rules[field] = include;
    };

    switch (_.type(fields)) {
    case 'string':
      add_field(fields);
      break;
    case 'array':
      _.each(fields, function (v) { add_field(v); });
      break;
    case 'object':
      _.each(fields, function (v, k) { add_field(k, v); });
      break;
    }//end switch

    return this.map(function (record) {
      var item = {};
      _.each(record, function (value, field) {
        if ((opts.addMode && false !== rules[field]) ||
            (!opts.addMode && true === rules[field])) {
          item[field] = value;
        }//end if: field added
      });//all fields
      if (rules[jdb._ID]) { item[jdb._ID] = record[jdb._ID]; }
      return item;
    });//all records
  };

  



  if (window) { window.jdb = jdb; }
  return jdb;

}));
