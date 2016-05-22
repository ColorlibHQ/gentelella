module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			development: {
				options: {
					compress: true,
					paths: './vendors'
				},
				files: {
					'./production/css/gentelella.min.css': './resources/less/gentelella.less'
				}
			}
		},

		copy: {
			main: {
				files: [{
					expand: true,
					flatten: true,
					src: [
						'./vendors/fontawesome/fonts/*',
						'./vendors/bootstrap/fonts/*'
					],
					dest: './production/fonts/'
				},
				{
					expand: true,
					cwd: './resources/images/', 
					src: [
						'**'
					],
					dest: './production/images/'
				}]
			}
		},

		uglify: {
			options: {
				mangle: false,
				compress: true,
				beautify: false
			},
			javascript: {
				files: {
					'./production/js/gentelella.min.js': [
						'./vendors/jquery/dist/jquery.js',
						'./vendors/bootstrap/dist/js/bootstrap.js',
						'./vendors/parsleyjs/dist/parsley.js',
						'./vendors/fastclick/lib/fastclick.js',
						'./vendors/nprogress/nprogress.js',
						'./vendors/Chart.js/dist/Chart.js',
						'./vendors/jquery-sparkline/dist/jquery.sparkline.js',

						'./vendors/Flot/jquery.flot.js',
						'./vendors/Flot/jquery.flot.pie.js',
						'./vendors/Flot/jquery.flot.time.js',
						'./vendors/Flot/jquery.flot.stack.js',
						'./vendors/Flot/jquery.flot.resize.js',
						'./resources/javascript/flot/jquery.flot.orderBars.js',
						'./resources/javascript/flot/date.js',
						'./resources/javascript/flot/jquery.flot.spline.js',
						'./resources/javascript/flot/curvedLines.js',

						'./vendors/autosize/dist/autosize.js',
						'./vendors/gauge.js/dist/gauge.js',
						'./vendors/bootstrap-progressbar/bootstrap-progressbar.js',
						'./vendors/bootstrap-wysiwyg/src/bootstrap-wysiwyg.js',
						'./vendors/cropper/dist/cropper.js',
						'./vendors/moment/moment.js',
						'./vendors/iCheck/icheck.js',

						'./vendors/datatables.net/js/jquery.dataTables.js',
						'./vendors/datatables.net-bs/js/dataTables.bootstrap.js',
						'./vendors/datatables.net-buttons/js/dataTables.buttons.js',
						'./vendors/datatables.net-buttons/js/buttons.flash.js',
						'./vendors/datatables.net-buttons/js/buttons.html5.js',
						'./vendors/datatables.net-buttons/js/buttons.print.js',
						'./vendors/datatables.net-buttons-bs/js/buttons.bootstrap.js',
						'./vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.js',
						'./vendors/datatables.net-keytable/js/dataTables.keyTable.js',
						'./vendors/datatables.net-responsive/js/dataTables.responsive.js',
						'./vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js',
						'./vendors/datatables.net-scroller/js/dataTables.scroller.js',

						'./vendors/devbridge-autocomplete/dist/jquery.autocomplete.js',
						'./vendors/dropzone/dist/dropzone.js',
						'./vendors/echarts/dist/echarts.js',
						'./vendors/echarts/map/js/world.js',
						'./vendors/fullcalendar/dist/fullcalendar.js',
						'./vendors/google-code-prettify/src/prettify.js',
						'./vendors/ion.rangeSlider/js/ion.rangeSlider.js',
						'./vendors/jquery.easy-pie-chart/dist/jquery.easypiechart.js',
						'./vendors/jquery.hotkeys/jquery.hotkeys.js',
						'./vendors/jquery.inputmask/dist/jquery.inputmask.bundle.js',
						'./vendors/jquery-knob/js/jquery.knob.js',
						'./vendors/jQuery-Smart-Wizard/js/jquery.smartWizard.js',
						'./vendors/jquery.tagsinput/src/jquery.tagsinput.js',
						'./vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
						'./vendors/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
						'./vendors/morris.js/morris.js',
						'./vendors/jszip/dist/jszip.js',
						'./vendors/pdfmake/build/pdfmake.js',
						'./vendors/pdfmake/build/vfs_fonts.js',
						'./vendors/pnotify/dist/pnotify.js',
						'./vendors/pnotify/dist/pnotify.buttons.js',
						'./vendors/pnotify/dist/pnotify.nonblock.js',
						'./vendors/raphael/raphael.js',
						'./vendors/select2/dist/js/select2.full.js',
						'./vendors/starrr/dist/starrr.js',
						'./vendors/switchery/dist/switchery.js',
						'./vendors/validator/validator.js',

						'./vendors/skycons/skycons.js',
						'./resources/javascript/datepicker/daterangepicker.js',
						'./resources/javascript/maps/gdp-data.js',
						'./resources/javascript/maps/jquery-jvectormap-2.0.3.min.js',
						'./resources/javascript/maps/jquery-jvectormap-us-aea-en.js',
						'./resources/javascript/maps/jquery-jvectormap-world-mill-en.js',
						'./resources/javascript/custom.js'
					]
				}
			}
		},

		devUpdate: {
		    main: {
		        options: {
					semver: false,
					packages: {
						devDependencies: true,
						dependencies: true
					}
		        }
		    }
		}

	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-dev-update');
	grunt.registerTask('default', ['less', 'copy', 'uglify']);
};
