const { join } = require("path")

require("esbuild").buildSync({
    entryPoints: [join(__dirname, "../src/index.ts")],
    outfile: join(__dirname, "../dist/index.js"),
    bundle: true,
    minify: true,
    platform: "node",
    external: Object.keys(require("../package.json").dependencies)
})
