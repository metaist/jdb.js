define(['./_', './core'], function (_, jdb) {
  // SELECT - pick fields //
  'use strict'; // build ignore:line
  var fn = {};  // build ignore:line

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

  /* build ignore:start */
  _.extend(jdb.fn, fn);
  return fn;
  /* build ignore:end */
});
