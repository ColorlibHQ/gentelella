module.exports = function(grunt)
{
	var gtx = require('gruntfile-gtx').wrap(grunt);
		gtx.loadAuto();

	var gruntConfig = require('./grunt');
		gruntConfig.package = require('./package.json');

	gtx.config(gruntConfig);

	gtx.alias('build', ['shell:lint', 'clean:dist', 'concat:dist', 'uglify:dist', 'test']);

	gtx.alias('release', ['build', 'bump-commit']);
	gtx.alias('release-major', ['bump-only:major', 'release']);
	gtx.alias('release-minor', ['bump-only:minor', 'release']);
	gtx.alias('release-patch', ['bump-only:patch', 'release']);

  gtx.alias('test', ['shell:lint', 'qunit:dist']);

	gtx.finalise();
};
