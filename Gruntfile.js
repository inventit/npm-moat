module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        beautify: {
          beautify: true,
          indent_level: 0
        },
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */'
      },
      dist: {
        files: [{
          expand: true,
          cwd: './src',
          src: '**/*.js',
          dest: 'lib'
        }]
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    'mocha-chai-sinon': {
      build: {
        src: ['./test/**/*.test.js'],
        options: {
          ui: 'bdd',
          reporter: 'spec'
        }
      },
      coverage: {
        src: ['./test/**/*.test.js'],
        options: {
          ui: 'bdd',
          reporter: 'html-cov',
          quiet: true,
          filter: '/npm-moat/src/',
          captureFile: './docs/coverage.html'
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'docs/jsdoc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-mocha-chai-sinon");
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('build', ['jshint', 'mocha-chai-sinon', 'uglify']);
  grunt.registerTask('default', ['build', 'jsdoc']);
};