module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        lifecycle: {
            validate: [
                'jshint'
            ],
            compile: [],
            test: [
                'karma:phantom'
            ],
            'package': [
                'concat',
                'uglify'
            ],
            'integration-test': [],
            verify: [],
            install: [],
            deploy: []
        },
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
            phantom: {
                singleRun: true,
                browsers: ['PhantomJS']
            },
            debug: {
                singleRun: false
            }
        },

        concat: {
            options: {
                banner: ['/**! ',
                    ' * <%= pkg.name %> v<%= pkg.version %>',
                    ' * Copyright (c) 2013 <%= pkg.author.name %>. <%= pkg.homepage %>',
                    ' * License: MIT',
                    ' */\n'].join('\n')
            },
            scripts: {
                src: [
                    'src/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: ['/**! ',
                    ' * <%= pkg.name %> v<%= pkg.version %>',
                    ' * Copyright (c) 2013 <%= pkg.author.name %>. <%= pkg.homepage %>',
                    ' * License: MIT',
                    ' */\n'].join('\n')
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.scripts.dest %>']
                }
            }
        },
        regarde: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
        bumpup: ['package.json', 'bower.json'],
        exec: {
            release_start: {
                command: 'git flow release start <%= pkg.version %>'
            },
            release_finish: {
                command: 'git flow release finish <%= pkg.version %>'
            }
        }
    });

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('bump', function (type) {
        type = type ? type : 'patch';
        grunt.task.run('bumpup:' + type);
    });

    grunt.registerTask('test-phantom', ['karma:phantom']);
    grunt.registerTask('test-start', ['karma:debug:start']);
    grunt.registerTask('test-run', ['karma:debug:run']);
    grunt.registerTask('build', ['install']);
    grunt.registerTask('default', ['install']);

};
