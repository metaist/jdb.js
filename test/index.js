define(function (require) {
  var $ = require('jquery');
  $.getJSON('../package.json', function (pkg) {
    $('title').text(pkg.name + ' ' + pkg.version);
  });

  window.xtest = $.noop;
  require([
    'order!test-create.js',
    'order!test-events.js',
    'order!test-insert.js',
    'order!test-update.js',
    'order!test-merge.js',
    'order!test-remove.js',
    'order!test-filter.js',
    'order!test-sort.js',
    'order!test-select.js'
  ], function () {
    QUnit.load();
    QUnit.start();
  });
});
