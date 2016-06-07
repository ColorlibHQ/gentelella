module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-release')

  grunt.initConfig
    pkg: '<json:package.json>'

    coffee:
      all:
        src: 'src/starrr.coffee'
        dest: 'dist/starrr.js'
        options:
          bare: true

    sass:
      all:
        files:
          'dist/starrr.css': 'src/starrr.scss'
        options:
          sourcemap: 'none'

    watch:
      all:
        files: ['src/starrr.coffee', 'src/starrr.scss']
        tasks: 'default'

  grunt.registerTask 'default', ['coffee:all', 'sass:all']
