
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            dev: {
                dest: 'public/lib',
                options: {
                    expand: true,
                    keepExpandedHierarchy: false,
                    packageSpecific: {
                        angular: {
                            files: [ 'angular.min.js' ]
                        },
                        'angular-local-storage': {
                            files: [ 'dist/angular-local-storage.min.js' ]
                        },
                        'angular-route': {
                            files: [ 'dist/angular-route.min.js' ]
                        },
                        bootstrap: {
                            expand: false,
                            files: [
                                'dist/css/bootstrap.min.css',
                                'dist/css/bootstrap.css.map',
                                'dist/css/bootstrap-theme.css',
                                'dist/css/bootstrap-theme.css.map',
                                'dist/js/bootstrap.min.js',
                                'dist/js/npm.js',
                                'dist/fonts/glyphicons-halflings-regular.eot',
                                'dist/fonts/glyphicons-halflings-regular.svg',
                                'dist/fonts/glyphicons-halflings-regular.ttf',
                                'dist/fonts/glyphicons-halflings-regular.woff',
                                'dist/fonts/glyphicons-halflings-regular.woff2',
                            ],
                            fonts_dest: 'public/lib/bootstrap/fonts',
                            css_dest: 'public/lib/bootstrap/css',
                            map_dest: 'public/lib/bootstrap/css',
                            js_dest: 'public/lib/bootstrap/js',
                        },
                        jquery: {
                            files: [ 'dist/jquery.min.js' ]
                        },
                        'bootstrap-select': {
                            files: [
                                'dist/css/bootstrap-select.css',
                                'dist/css/bootstrap-select.css.map',
                                'dist/js/bootstrap-select.js',
                            ]
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower');

    grunt.registerTask('default', [ 'bower' ]);
}