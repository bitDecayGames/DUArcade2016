module.exports = function(grunt) {
    grunt.initConfig({
        clean: ["build"],
        copy: {
            main: {
                files: [
                    {expand: true, src: ["public/**", "!public/js/**", "!public/css/**"], dest: "build"}
                ]
            }
        },
        ts: {
            server: {
                files: [
                    {src: ["server/**/*.ts"], dest: "build/server"}
                ],
                module: "commonjs"
            },
            frontend: {
                files: [
                    {src: ["public/js/**/*.ts", "public/lib/**/*.ts"], dest: "build/public"}
                ],
                out: "build/public/js/app.js"
            }
        },
        less: {
            main: {
                files: [{expand: true, src: ["public/css/*.less"], dest: "build", ext: ".css"}]
            }
        },
        focus: {
            include: ["frontendTs", "backendTs", "less", "others"]
        },
        watch: {
            frontendTs: {
                files: ["public/js/**"],
                tasks: ["ts:frontend"]
            },
            backendTs: {
                files: ["server/**"],
                tasks: ["ts:server"]
            },
            less: {
                files: ["public/css/**"],
                tasks: ["less"]
            },
            others: {
                files: ["public/**", "!public/js/**", "!public/css/**"],
                tasks: ["copy"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-focus');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("typescript", ["ts:server", "ts:frontend"]);

    grunt.registerTask("default", ["clean", "copy", "typescript", "less"]);
    grunt.registerTask("dev", ["default", "focus"]);

};