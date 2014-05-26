(function (factory) { 'use strict';
  if ('function' === typeof define && define.amd) {
    define(['jquery'], factory); // register anonymous AMD module
  } else { factory(jQuery); } // browser globals
}(function ($) {
