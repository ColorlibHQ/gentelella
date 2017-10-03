module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  var banner = [
      '/**',
      '*  Ajax Autocomplete for jQuery, version ' + pkg.version, 
      '*  (c) 2017 Tomas Kirda',
      '*',
      '*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.',
      '*  For details, see the web site: https://github.com/devbridge/jQuery-Autocomplete',
      '*/'].join('\n') + '\n';

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    uglify: {
      options: {
        banner: banner
      },
      build: {
        src: 'src/jquery.autocomplete.js',
        dest: 'dist/jquery.autocomplete.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

  grunt.task.registerTask('build', 'Create release', function() {
    var version = pkg.version,
        src = grunt.file.read('src/jquery.autocomplete.js').replace('%version%', version),
        filePath = 'dist/jquery.autocomplete.js';

    // Update not minimized release version:
    console.log('Updating: ' + filePath);
    grunt.file.write(filePath, src);

    // Minify latest version:
    grunt.task.run('uglify');

    // Update plugin version:
    filePath = 'devbridge-autocomplete.jquery.json';
    src = grunt.file.readJSON(filePath);

    if (src.version !== version){
      src.version = version;
      console.log('Updating: ' + filePath);
      grunt.file.write(filePath, JSON.stringify(src, null, 4));
    } else {
      console.log('No updates for: ' + filePath);
    }

    // Update bower version:
    filePath = 'bower.json';
    src = grunt.file.readJSON(filePath);

    if (src.version !== version){
      src.version = version;
      console.log('Updating: ' + filePath);
      grunt.file.write(filePath, JSON.stringify(src, null, 4));
    } else {
      console.log('No updates for: ' + filePath);
    }
  });
};