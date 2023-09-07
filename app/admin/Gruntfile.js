/*** Amend ***/

module.exports = function (grunt) {

	grunt.initConfig({

		uglify: {
			options: {
				mangle: false,
				report: 'min',
				banner: '/* Gerado em ' + new Date() + ' */ \n'
			},
			plugins: {
				files: {
					'js/vendor.js': ['js/libs/*.js', 'js/plugins/*.js']
				}
			}
		},

		cssmin: {
			add_banner: {
				options: {
					banner: '/*  Gerado em ' + new Date() + ' */ \n'
				},
				files: {
					'css/vendor.css': ['css/plugins/*.css']
				},
				keepSpecialComments: '0'
			}
		}

	});


	/*grunt.registerTask('watch:test', function() {
		// Configuração de watch manual
		var config = {
			options: {
				interrupt: true
			},
			css: {
				files: ['css/dev/*'],
				tasks: ['cssmin']
			},
			jscore: {
				files: [ 'js/dev/cms.js' , 'js/dev/core.js'],
				tasks: ['uglify:core']
			},
			jsplugins : {
				files: [ 'js/dev/libs/*.js' , 'js/dev/plugins/*.js' ],
				tasks: ['uglify:plugins']
			}
		};

		grunt.config('watch', config);
		grunt.task.run('watch');
	});
	*/


	// Plugins do Grunt
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');


	// Tarefas que serão executadas
	grunt.registerTask('default', ['uglify', 'cssmin']);


	// Tarefa para Watch

};