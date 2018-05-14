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
                files: { 'public/js/code.libs.min.js' : ['node_modules/jquery/dist/jquery.min.js', 'node_modules/angular/angular.min.js', 'node_modules/angular-resource/angular-resource.min.js', 'node_modules/angular-ui-router/release/angular-ui-router.min.js', 'node_modules/js-sha256/build/sha256.min.js', 'node_modules/angular-cookies/angular-cookies.min.js', 'node_modules/angular-jwt/dist/angular-jwt.min.js', 'node_modules/ui-cropper/compile/minified/ui-cropper.js', 'node_modules/ng-dialog/js/ngDialog.min.js', 'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js']}
            }
        },
        
        less: {
            build: {
                files: { 'src/css/code.css' : 'src/less/*.less'}
            }
        },
        
        cssmin: {
            build: {
                files: { 'public/css/code.min.css' : 'src/css/*.css'}
            },
            libs: {
                files: { 'public/css/code.libs.min.css' : ['node_modules/ng-dialog/css/ngDialog.min.css', 'node_modules/ng-dialog/css/ngDialog-theme-default.min.css', 'node_modules/ui-cropper/compile/minified/ui-cropper.css', 'node_modules/perfect-scrollbar/css/perfect-scrollbar.css'] }
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
        },
        
        exec: {
            batfile: "start bin/startup.bat"
        }
    
    });
    
    // Tasks
    
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-less');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-exec');
      grunt.registerTask('default', ['less', 'cssmin', 'uglify', 'watch']);
      grunt.registerTask('chat', ['exec']);
};