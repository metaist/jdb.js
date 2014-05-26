define([
  './core',
  './events',
  './alter',
  './filter',
  './sort',
  './select'
], function (jdb) {
  'use strict'; // build ignore:line
  if (window) { window.jdb = jdb; }
  return jdb;
});
