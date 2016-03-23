module.exports = function(grunt) {
    grunt.initConfig({
        clean: ["build"],
        copy: {
            main: {
                files: [
                    {expand: true, src: ["public/**"], dest: "build"},
                    {expand: true, src: ["server/**"], dest: "build"}
                ]
            }
        },
        ts: {
            server: {
                files: [
                    {src: ["build/server/**/*.ts"]}
                ],
                options: {
                    module: "commonjs"
                }
            },
            frontend: {
                files: [
                    {src: ["build/public/**/*.ts"]}
                ],
                options: {
                    module: "amd"
                }
            }
        },
        less: {
            main: {
                files: [{expand: true, src: ["build/public/css/*.less"], ext: ".css"}]
            }
        },
        focus: {
            include: ["ts", "less", "lib", "others"]
        },
        watch: {
            ts: {
                files: ["public/js/**", "server/**"],
                tasks: ["copy", "typescript"]
            },
            less: {
                files: ["public/css/**"],
                tasks: ["copy", "less"]
            },
            lib: {
                files: ["public/lib/**"],
                tasks: ["default"]
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

    grunt.registerTask("default", ["copy", "typescript", "less"]);
    grunt.registerTask("dev", ["default", "focus"]);

};