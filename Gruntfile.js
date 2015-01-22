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
          'build/selectr.js': 'src/selectr.coffee'
        }
      }
    },
    coffee_jshint: {
      options: {
        jshintOptions: ['browser', 'jquery'],
        globals: ['console']
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
          'dist/selectr.min.js': 'build/selectr.js',
        }
      }
    },

    // Styles
    sass: {
      compile : {
        files: {
          'build/selectr.css': 'src/selectr.scss',
          'build/selectrPolyfill.css': 'src/selectrPolyfill.scss'
        }
      }
    },
    autoprefixer: {
      prefix: {
        src: 'build/*.css'
      }
    },
    cssmin: {
      minify: {
        files: {
          'dist/selectr.min.css': 'build/selectr.css',
          'dist/selectrWithPolyfill.min.css': ['build/selectr.css', 'build/selectrPolyfill.css']
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