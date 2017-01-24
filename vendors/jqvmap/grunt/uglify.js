module.exports = {
	options: {
		banner: '/*!\n' +
		' * <%= package.author.name %>: <%= package.description %>\n' +
		' * @author <%= package.author.name %> <<%= package.author.email %>>\n' +
		' * @version <%= package.version %>\n' +
		' * @link <%= package.author.url %>\n' +
		' * @license https://github.com/manifestinteractive/jqvmap/blob/master/LICENSE\n' +
		' * @builddate <%= grunt.template.today("yyyy/mm/dd") %>\n' +
		' */\n\n'
	},
	dist: {
		files: {
			'dist/jquery.vmap.min.js': [
				"dist/jquery.vmap.js"
			]
		}
	}
};
