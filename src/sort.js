define(['./_', './core'], function (_, jdb) {
  // SORT - sort records //
  'use strict'; // build ignore:line
  var fn = {};  // build ignore:line
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

  /* build ignore:start */
  _.extend(jdb.fn, fn);
  return fn;
  /* build ignore:end */
});
