# jdb.js  [![Build Status](https://travis-ci.org/metaist/jdb.js.svg?branch=master)](https://travis-ci.org/metaist/jdb.js)
[Latest Release] - [Documentation] - [Issues]

_[jQuery] for [JSON] objects._

[Latest Release]: https://github.com/metaist/jdb.js/releases/latest
[Documentation]: https://github.com/metaist/jdb.js/wiki
[Issues]: https://github.com/metaist/jdb.js/issues

## Why?
I need something like [jQuery] for [JSON] objects that's between
[localStorage] and [IndexedDB] and acts like a client-side event-driven
cache. 

[jQuery]: http://jquery.com/
[JSON]: http://www.json.org/
[localStorage]: http://dev.w3.org/html5/webstorage/
[IndexedDB]: http://www.w3.org/TR/IndexedDB/

## Usage
Store a bunch of records.
```javascript
var db = jdb([{id: 1, name: 'John Smith', gender: 'M'},
              {id: 2, name: 'Jane Doe', gender: 'F'}]);
// db is an array-like object with two records
```

Find a record.
```javascript
db.find({id: 2}); // returns a jdb object with only one record
```

Listen for events.
```javascript
db
  .on('beforeinsert', function (records) { /* filter what to insert */})
  .on('insert', function(record) { /* do something with each record */ })
  .on('afterinsert', function (records) { /* all inserted records */});
```

Add/Remove/Update/Merge records.
```javascript
db.insert(records); // insert one or more records
db.find({id: 1}).remove(); // remove the selected records
db.find({id: 2}).update({name: 'Jane Smith'}); // udpate the selected records
db.merge({id: 1, name: 'John Smith', gender: 'M'}); // insert or update
```

Read more in the [documentation].

## Influenced By
  - [Meteor] - clients pretend to have access to the database;
    changes in the data update the view
  - [Knockout] - [observables][ko-1] auto-update the view
  - [mongoDB] - server-side JavaScript database
  - [TaffyDB] - client-side JavaScript database

I really like how [Meteor] brings [mongoDB] and an eventually-consistent
approach to the front-end, but I can't always use [Node] on the server.
[Knockout] is close, but I wanted to split out the data-binding and templating
from the View-Model. [TaffyDB] is almost what I want, but the events occur
before the database is updated and it's [hard to extend][taffy-1].

What I really want is [jQuery] for [JSON] objects.

[Meteor]: https://www.meteor.com/
[Node]: http://nodejs.org/
[Knockout]: http://knockoutjs.com/
[mongoDB]: http://www.mongodb.org/
[TaffyDB]: http://www.taffydb.com/

[ko-1]: http://knockoutjs.com/documentation/observables.html
[taffy-1]: https://github.com/typicaljoe/taffydb/blob/master/taffy.js

## License
Licened under the [MIT License].

[MIT License]: http://opensource.org/licenses/MIT
