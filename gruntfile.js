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
        watch: {
            dev: {
                files: ["public/**", "server/**"],
                tasks: ["default"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("typescript", ["ts:server", "ts:frontend"]);

    grunt.registerTask("default", ["clean", "copy", "typescript"]);
    grunt.registerTask("dev", ["default", "watch:dev"]);

};