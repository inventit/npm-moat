module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
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
          filter: '/npm-moat/lib/',
          captureFile: './doc/coverage.html'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-mocha-chai-sinon");
  grunt.registerTask('default', ['jshint', 'mocha-chai-sinon']);
};