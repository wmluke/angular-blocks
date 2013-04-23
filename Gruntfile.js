var exec = require('child_process').exec;

module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            },
            grunt: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js']
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
            options: {
                banner: ['/**! ',
                         ' * @license <%= pkg.name %> v<%= pkg.version %>',
                         ' * Copyright (c) 2013 <%= pkg.author.name %>. <%= pkg.homepage %>',
                         ' * License: MIT',
                         ' */\n'].join('\n')
            },
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
    });

    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('test-start', ['karma:debug:start']);
    grunt.registerTask('test-run', ['karma:debug:run']);
    grunt.registerTask('build', ['jshint', 'test', 'uglify']);
    grunt.registerTask('default', ['build']);

};
