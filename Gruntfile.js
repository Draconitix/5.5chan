module.exports = function(grunt) {

    grunt.initConfig({
    
        pkg: grunt.file.readJSON('package.json'),
        
        uglify: {
            options: {
                mangle: false
            },
            
            build: {
                files: { 'dist/js/code.min.js' : ['src/js/main.js', 'src/js/**/*.js'] }
            },
            
            libs: {
                files: { 'dist/js/code.libs.min.js' : ['node_modules/angular/angular.min.js', 'node_modules/angular-resource/angular-resource.min.js', 'node_modules/angular-ui-router/release/angular-ui-router.min.js', 'node_modules/js-sha256/build/sha256.min.js', 'node_modules/angular-cookies/angular-cookies.min.js']}
            }
        },
        
        less: {
            build: {
                files: { 'src/css/code.css' : 'src/less/*.less'}
            }
        },
        
        cssmin: {
            build: {
                files: { 'dist/css/code.min.css' : 'src/css/*.css'}
            }
        },
        
        watch: {
            stylesheets: {
                files: ['src/less/*.less', 'src/css/*.css'],
                tasks: ['less', 'cssmin']
            },
            
            scripts: {
                files: ['src/js/main.js', 'src/js/**/*.js'],
                tasks: ['uglify:build']
            }
        }
    
    });
    
    // Tasks
    
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-less');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.registerTask('default', ['less', 'cssmin', 'uglify', 'watch']);
};