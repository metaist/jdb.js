var require = {
  baseUrl: '..',

  paths: {
    // Dependency Management
    'css': 'lib/require-css-0.1.2/css.min',
    'order': 'lib/require-order-1.0.5/order',

    // Layout
    'jquery': 'lib/jquery-1.11.0/jquery.min',

    // Unit Testing
    'blanket': 'lib/blanket-1.1.5/blanket.min',
    'qunit': 'lib/qunit-1.14.0/qunit-1.14.0'
  },

  shim: {
    // Unit Testing
    'blanket': ['qunit'],
    'qunit': {
      deps: ['css!lib/qunit-1.14.0/qunit-1.14.0'],
      exports: 'QUnit'
    }
  }
};
