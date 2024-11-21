const esbuild = require("esbuild");

try {
  esbuild.buildSync({
    entryPoints: ["index.js"],
    bundle: true,
    minify: true,
    platform: "node",
    packages: "external",
    outfile: "dist/bundle.js",
  });
  console.log("Build successful!");
} catch (err) {
  console.error("Build failed:", err);
  process.exit(1);
}
