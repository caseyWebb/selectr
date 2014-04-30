module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      coffee: {
        files: 'src/selectr.coffee',
        tasks: ['coffee', 'coffee_jshint', 'uglify']
      },
      styles: {
        files: 'src/selectr.scss',
        tasks: ['sass', 'autoprefixer', 'cssmin']
      }
    },

    // Javascript
    coffee: {
      compile: {
        options: {
          sourceMap: true
        },
        files: {
          'debug/selectr.js': 'src/selectr.coffee'
        }
      }
    },
    coffee_jshint: {
      options: {
        jshintOptions: ['browser', 'jquery']
      },
      files: {
        src: 'src/selectr.coffee'
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        }
      },
      minify: {
        files: {
          'prod/selectr.min.js': 'debug/selectr.js',
        }      
      }
    },

    // Styles
    sass: {
      compile : {
        files: {
          'debug/selectr.css': 'src/selectr.scss',
          'debug/selectrPolyfill.css': 'src/selectrPolyfill.scss'
        }
      }
    },
    autoprefixer: {
      prefix: {
        src: 'debug/*.css'
      }
    },
    cssmin: {
      minify: {
        files: {
          'prod/selectr.min.css': 'debug/selectr.css',
          'prod/selectrWithPolyfill.min.css': ['debug/selectr.css', 'debug/selectrPolyfill.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffee-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee', 'coffee_jshint', 'uglify', 'sass', 'autoprefixer', 'cssmin']);

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ':' + filepath + ' has ' + action);
  });
};