'use strict';

module.exports = function (grunt){
  grunt.initConfig({
    // Run JSHint linting.
    jshint: {
      files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    // Run Stylus compilation.
    stylus: {
      build: {
        options: {
          compress: true,
          paths: ['public/stylesheets']
        },
        files: {
          '.build/stylesheets/app.css': 'public/stylesheets/*.styl'
        }
      }
    },
    // Copy compiled assets to .build
    copyto: {
      build: {
        files: [
          { cwd: 'public', src: ['**/*'], dest: '.build/' }
        ],
        options: {
          ignore: [
            'public/stylesheets/**/*',
            'public/javascripts/**/*',
            'public/templates/**/*'
          ]
        }
      }
    },
    // Clean compiled assets.
    clean: {
      'build': '.build'
    },
    // Run tests.
    mochacli: {
      src: ['test/*.js'],
      options: {
        globals: ['chai'],
        timeout: 6000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      }
    }
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-copy-to');

  // Register task aliases.
  grunt.registerTask('default', ['clean', 'build']);
  grunt.registerTask('build', ['jshint', 'stylus', 'copyto']);
  grunt.registerTask('test', ['jshint', 'mochacli']);
};
