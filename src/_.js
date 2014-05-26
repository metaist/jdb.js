define(function () {
  // Mashup of jQuery (1.11.0) and Underscore (1.6.0) functions. MIT License.
  'use strict';  // build ignore:line

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

  /* build ignore:start */
  window._ = _; // for debugging only
  return _;
  /* build ignore:end */
});
