import { build, context } from "esbuild";

const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  outdir: "dist",
};

if (process.argv[2] == "dev") {
  const ctx = await context(config);
  ctx.watch();
} else {
  await build({
    ...config,
    minify: true,
  });
}
