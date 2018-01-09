module.exports = function(grunt) {

    grunt.initConfig({
    
        pkg: grunt.file.readJSON('package.json'),
        
        uglify: {
            options: {
                mangle: false
            },
            
            build: {
                files: { 'public/js/code.min.js' : ['src/js/main.js', 'src/js/**/*.js'] }
            },
            
            libs: {
                files: { 'public/js/code.libs.min.js' : ['node_modules/angular/angular.min.js', 'node_modules/angular-resource/angular-resource.min.js', 'node_modules/angular-ui-router/release/angular-ui-router.min.js', 'node_modules/js-sha256/build/sha256.min.js', 'node_modules/angular-cookies/angular-cookies.min.js']}
            }
        },
        
        sass: {
            build: {
                files: { 'src/css/code.css' : 'src/sass/*.scss'}
            }
        },
        
        cssmin: {
            build: {
                files: { 'public/css/code.min.css' : 'src/css/*.css'}
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
      grunt.loadNpmTasks('grunt-sass');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.registerTask('default', ['sass', 'cssmin', 'uglify', 'watch']);
};