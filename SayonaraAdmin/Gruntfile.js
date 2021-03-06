// Generated on 2016-10-22 using generator-angular 0.15.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

  //Require ngconstat for angular constants
  grunt.loadNpmTasks('grunt-ng-constant');

	// Automatically load required Grunt tasks
	require('jit-grunt')(grunt, {
		useminPrepare: 'grunt-usemin',
		ngtemplates: 'grunt-angular-templates'
	});

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: appConfig,

    //Define constants for our build enviornments
    //http://stackoverflow.com/questions/28388143/using-grunt-to-preprocess-and-replace-environment-variables
    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'sayonaraAdminBuildConfig',
      },
      // Environment targets
      development: {
        options: {
          dest: '<%= yeoman.app %>/scripts/sayonaraAdminBuildConfig.js'
        },
        constants: {
          ENV: {
            devApiPort: 8000,
          }
        }
      },
      production: {
        options: {
          dest: '<%= yeoman.dist %>/scripts/sayonaraAdminBuildConfig.js'
        },
        constants: {
          ENV: {
            devApiPort: false,
          }
        }
      }
    },

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			sass: {
			    files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
			    tasks: ['sass:server', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/**/**.html',
					'.tmp/styles/**/**.css',
					'<%= yeoman.app %>/images/**/**.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9001,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: '0.0.0.0',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function(connect) {
						return [
							connect.static('.tmp'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect().use(
								'/app/styles',
								connect.static('./app/styles')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			test: {
				options: {
					port: 9001,
					middleware: function(connect) {
						return [
							connect.static('.tmp'),
							connect.static('test'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= yeoman.dist %>'
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/**/**',
						'!<%= yeoman.dist %>/.git**/**'
					]
				}]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		postcss: {
			options: {
				processors: [
					require('autoprefixer-core')({
						browsers: ['last 1 version']
					})
				]
			},
			server: {
				options: {
					map: true
				},
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '**/**.css',
					dest: '.tmp/styles/'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '**/**.css',
					dest: '.tmp/styles/'
				}]
			}
		},

		// Automatically inject Bower components into the app
		wiredep: {
			app: {
				src: ['<%= yeoman.app %>/index.html'],
				ignorePath: /\.\.\//
			},
			test: {
				devDependencies: true,
				src: '<%= karma.unit.configFile %>',
				ignorePath: /\.\.\//,
				fileTypes: {
					js: {
						block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
						detect: {
							js: /'(.*\.js)'/gi
						},
						replace: {
							js: '\'{{filePath}}\','
						}
					}
				}
			},
			sass: {
				src: ['<%= yeoman.app %>/styles/**/**.{scss,sass}'],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		//Using this conversion guide to node-sass: https://github.com/yeoman/generator-angular/issues/819#issuecomment-100379175
		sass: {
        options: {
            includePaths: [
                'bower_components'
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                src: ['*.scss'],
                dest: '.tmp/styles',
                ext: '.css'
            }]
        },
        server: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                src: ['*.scss'],
                dest: '.tmp/styles',
                ext: '.css'
            }]
        }
    },

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>',
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},

		// Performs rewrites based on the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/**/**.html'],
			css: ['<%= yeoman.dist %>/styles/**/**.css'],
			js: ['<%= yeoman.dist %>/scripts/**/**.js'],
			options: {
				assetsDirs: [
					'<%= yeoman.dist %>',
					'<%= yeoman.dist %>/images',
					'<%= yeoman.dist %>/styles'
				],
				blockReplacements: {
					css: function(block) {
						//Allow relative roots, use the sayonara admin root
						return '<link rel="stylesheet" href="admin/' + block.dest + '"/>';
					},
					js: function(block) {
						return '<script src="admin/' + block.dest + '"></script>';
					}
				},
				patterns: {
					js: [
						[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
					]
				}
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '**/**.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '**/**.svg',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		ngtemplates: {
			dist: {
				options: {
					module: 'sayonaraAdminApp',
					htmlmin: '<%= htmlmin.dist.options %>',
					usemin: 'scripts/scripts.js'
				},
				cwd: '<%= yeoman.app %>',
				src: 'views/**/**.html',
				dest: '.tmp/templateCache.js'
			}
		},

		// ng-annotate tries to make the code safe for minification automatically
		// by using the Angular long form for dependency injection.
		ngAnnotate: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: '*.js',
					dest: '.tmp/concat/scripts'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'*.html',
						'images/**/**.{webp}',
						'styles/fonts/**/**.*'
					]
				}, {
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'scripts/sayonara_components/**'
					]
				}, {
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'scripts/external_libs/**'
					]
				}, {
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'views/templates/**'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: ['generated/*']
				}, {
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>/../bower_components',
					dest: '<%= yeoman.dist %>/bower_components',
					src: [
						'highlightjs/styles/gruvbox*'
					]
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '**/**.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
		    server: [
		        'sass:server',
		        'copy:styles'
		    ],
		    test: [
		        'copy:styles'
		    ],
		    dist: [
		        'sass',
		        'copy:styles',
		        'imagemin',
		        'svgmin'
		    ]
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'test/karma.conf.js',
				singleRun: true
			}
		},

		//String replace for sayonara server, since, we are using a relative path
		replace: {
			dist: {
				src: ['<%= yeoman.dist %>/**/*.html', '<%= yeoman.dist %>/**/*.js'],
				overwrite: true, // overwrite matched source files
				replacements: [{
					from: '<script src="scripts/sayonara_components',
					to: '<script src="admin/scripts/sayonara_components'
				}, {
					from: 'templateUrl: \'views/templates',
					to: 'templateUrl: \'admin/views/templates'
				}, {
					from: 'src="images/',
					to: 'src="admin/images/'
				}]
			}
		}
	});

	//String replace for grunt
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
      'ngconstant:development',
			'wiredep',
			'concurrent:server',
			'postcss:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
    'ngconstant:production',
		'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'postcss',
		'ngtemplates',
		'concat',
		'ngAnnotate',
		'copy:dist',
		'cssmin',
		'uglify',
		'usemin',
		'htmlmin',
		'replace'
	]);

	grunt.registerTask('default', [
		'test',
		'build'
	]);
};
