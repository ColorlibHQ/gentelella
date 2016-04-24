module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		cfg: {
			filename: 'easypiechart',
			vanillaExportName: 'EasyPieChart'
		},

		dirs: {
			tmp: 'tmp',
			src: 'src',
			dest: 'dist',
			docs: 'docs',
			test: 'test',
			demo: 'demo'
		},

		clean: {
			all: ['<%= dirs.dest %>/', '<%= dirs.tmp %>/'],
			tmp: ['<%= dirs.tmp %>/']
		},

		concat: {
			vanilla: {
				src: [
					'<%= dirs.src %>/renderer/canvas.js',
					'<%= dirs.src %>/<%= cfg.filename %>.js'
				],
				dest: '<%= dirs.tmp %>/<%= cfg.filename %>.js'
			},
			jquery: {
				src: [
					'<%= dirs.src %>/renderer/canvas.js',
					'<%= dirs.src %>/<%= cfg.filename %>.js',
					'<%= dirs.src %>/jquery.plugin.js'
				],
				dest: '<%= dirs.tmp %>/jquery.<%= cfg.filename %>.js'
			},
			angular: {
				src: [
					'<%= dirs.src %>/angular.directive.js',
					'<%= dirs.src %>/renderer/canvas.js',
					'<%= dirs.src %>/<%= cfg.filename %>.js'
				],
				dest: '<%= dirs.tmp %>/angular.<%= cfg.filename %>.js'
			}
		},

		usebanner: {
			options: {
				position: 'top',
				banner: '/**!\n' +
						' * <%= pkg.name %>\n' +
						' * <%= pkg.description %>\n' +
						' *\n' +
						' * @license <%= pkg.license %>\n'+
						' * @author <%= pkg.author.name %> <<%= pkg.author.email %>> (<%= pkg.author.url %>)\n' +
						' * @version <%= pkg.version %>\n' +
						' **/\n'
			},
			files: {
				src: [
					'<%= dirs.dest %>/<%= cfg.filename %>.js',
					'<%= dirs.dest %>/jquery.<%= cfg.filename %>.js',
					'<%= dirs.dest %>/angular.<%= cfg.filename %>.js'
				]
			}
		},

		uglify: {
			dist: {
				options: {
					report: 'gzip',
					preserveComments: 'some'
				},
				files: {
					'dist/<%= cfg.filename %>.min.js': ['dist/<%= cfg.filename %>.js'],
					'dist/jquery.<%= cfg.filename %>.min.js': ['dist/jquery.<%= cfg.filename %>.js'],
					'dist/angular.<%= cfg.filename %>.min.js': ['dist/angular.<%= cfg.filename %>.js']
				}
			}
		},

		watch: {
			gruntfile: {
				files: ['Gruntfile.js']
			},
			scripts: {
				files: '<%= dirs.src %>/**/*.js',
				tasks: ['default'],
				options: {
					debounceDelay: 250
				}
			},
			less: {
				files: '<%= dirs.demo %>/*.less',
				tasks: ['less'],
				options: {
					debounceDelay: 250
				}
			},
			readme: {
				files: '<%= dirs.docs %>/**/*.md',
				tasks: ['readme'],
				options: {
					debounceDelay: 250
				}
			}
		},

		jshint: {
			files: [
				'<%= dirs.src %>/**/*.js',
				'<%= dirs.test %>/**/*.js'
			],
			options: {}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.coffee'
			},
			ci: {
				configFile: 'karma.conf.coffee',
				singleRun: true,
				browsers: ['PhantomJS']
			}
		},

		less: {
			demo: {
				files: {
					'<%= dirs.demo %>/style.css': ['<%= dirs.demo %>/style.less']
				}
			}
		},

		umd: {
			vanilla: {
				src: '<%= dirs.tmp %>/<%= cfg.filename %>.js',
				dest: '<%= dirs.dest %>/<%= cfg.filename %>.js',
				objectToExport: '<%= cfg.vanillaExportName %>',
				globalAlias: '<%= cfg.vanillaExportName %>'
			},
			jquery: {
				src: '<%= dirs.tmp %>/jquery.<%= cfg.filename %>.js',
				dest: '<%= dirs.dest %>/jquery.<%= cfg.filename %>.js',
				deps: {
					'default': ['$'],
					amd: ['jquery'],
					cjs: ['jquery'],
					global: ['jQuery']
				}
			},
			angular: {
				src: '<%= dirs.tmp %>/angular.<%= cfg.filename %>.js',
				dest: '<%= dirs.dest %>/angular.<%= cfg.filename %>.js',
				deps: {
					'default': ['angular'],
					amd: ['angular'],
					cjs: ['angular'],
					global: ['angular']
				}
			}
		}
	});

	// load all installed grunt tasks
	require('load-grunt-tasks')(grunt);

	// task defiinitions
	grunt.registerTask('default', [
		'clean:all',
		'jshint',
		'concat',
		'umd',
		'usebanner',
		'uglify',
		'clean:tmp',
		'readme'
	]);

	grunt.registerTask('test', ['karma:unit']);
	grunt.registerTask('all', ['default', 'less']);
};
