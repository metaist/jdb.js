module.exports = function (grunt) {
  'use strict';
  var path = require('path');

  var pkg = grunt.file.readJSON('package.json'),
      names = { src: pkg.name };

  grunt.initConfig({
    pkg: pkg,
    names: names,
    banner:
      '/*! <%= pkg.title %> v<%= pkg.version %> | ' +
      '(c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | ' +
      '<%= pkg.licenses[0].url %> */',

    // Clean
    clean: ['dist', names.src + '-*.zip'],

    // RequireJS
    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          mainConfigFile: 'lib/config.amd.js',
          name: 'src/<%= names.src %>',
          out: 'dist/<%= names.src %>.js',
          optimize: 'none',
          exclude: ['jquery'],
          skipSemiColonInsertion: true,
          wrap: {
            startFile: 'src/wrap-beg.js',
            endFile: 'src/wrap-end.js'
          },
          onBuildWrite: function(moduleName, path, contents) {
            return contents
              .replace(/^.*\/\/\s*build ignore:line\s*$/igm, '')
              .replace(/\/\*\s*build ignore:start\s*\*\/[\w\W]*?\/\*\s*build ignore:end\s*\*\//ig, '')
              .replace(/define\([^{]*?{/, '')
              .replace(/\}\);[^}\w]*$/, '')
              .replace(/\r?\nreturn .+\n/, '');
          }
        }
      }
    },

    // Concat
    concat: {
      options: {
        banner: '<%= banner %>\n',
        stripBanners: true
      },
      dist: {
        src: ['dist/<%= names.src %>.js'],
        dest: 'dist/<%= names.src %>.js',
        options: {
          process: function (txt, src) {
            return txt.replace(/@VERSION/g, pkg.version);
          }
        }
      }
    },

    // JSON Lint
    jsonlint: {
      all: ['package.json']
    },

    // JSHint
    jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'lib/config*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        ignores: ['src/**/wrap-*.js']
      }
    },

    // QUnit
    qunit: {
      all: ['test/**/*.html']
    },

    // Uglify
    uglify: {
      all: {
        files: {
          'dist/<%= names.src %>.min.js':
            ['dist/<%= names.src %>.js']
        }
      },
      options: {
        preserveComments: false,
        sourceMap: 'dist/<%= names.src %>.min.map',
        sourceMappingURL: '<%= names.src %>.min.map',
        report: 'min',
        beautify: { ascii_only: true },
        banner: '<%= banner %>',
        compress: {
          drop_console: true,
          hoist_funs: false,
          loops: false,
          unused: false
        }
      }
    },

    // Compress
    compress: {
      all: {
        options: {
          archive: [names.src, pkg.version].join('-') + '.zip'
        },
        expand: true,
        flatten: true,
        src: ['README.md', 'dist/**'],
        dest: './' + [names.src, pkg.version].join('-')
      }
    }
  });

  require('load-grunt-tasks')(grunt); // load grunt tasks

  grunt.registerTask('default', ['build', 'test', 'package']);
  grunt.registerTask('build', ['clean', 'requirejs', 'concat']);
  grunt.registerTask('test', ['jsonlint', 'jshint', 'qunit']);
  grunt.registerTask('package', ['uglify', 'compress']);
  grunt.registerTask('dev', ['build', 'uglify', 'test']);
};
