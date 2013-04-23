'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            main: {
                src: ['src/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {
                singleRun: true
            },
            debug: {
                singleRun: false
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
                }
            }
        },
        regarde: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['uglify']
            }
        },
        bumpup: ['package.json', 'component.json'],
        exec: {
            release_start: {
                command: 'git flow release start <%= pkg.version %>'
            },
            release_finish: {
                command: 'git flow release finish <%= pkg.version %>'
            }
        }
    });

    grunt.registerTask('bump', function (type) {
        type = type ? type : 'patch';
        grunt.task.run('bumpup:' + type);

        var pkg = grunt.file.readJSON('package.json');

        exec('git commit -a -m "Started release ' + pkg.version + '"', function (error, stdout, stderr) {
            if (error) {
                console.log(stderr);
            } else {
                console.log(stdout);
            }
        });
    });

    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('test-start', ['karma:debug:start']);
    grunt.registerTask('test-run', ['karma:debug:run']);
    grunt.registerTask('build', ['test', 'uglify']);
    grunt.registerTask('default', ['build']);

};
