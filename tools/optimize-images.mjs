// Generates responsive WebP variants of every photo in img/ and img/ap/ into img/opt/, plus img/opt/manifest.json,
// which build.mjs reads to write srcset, sizes, width and height on each <img>. The original JPEGs stay in place:
// they are the og:image files for social previews and the fallback if a variant is missing.
//
// Run after adding or replacing a photo, then rebuild:
//   npm install --no-save sharp
//   node tools/optimize-images.mjs
//   node build.mjs
// Existing variants are skipped unless the source is newer; pass --force to redo all of them.
import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";

const SRC_DIRS = ["img", "img/ap"];
const OUT = "img/opt";
// Widths cover phones (1x and 2x), tablets and desktop, up to 2400px for full-bleed photos on large high-density screens.
const WIDTHS = [480, 800, 1200, 1600, 2400];
const QUALITY = 80; // WebP quality: no visible loss on these photos at roughly a quarter of the JPEG weight
// Files in img/ that no page uses (logo source, duplicates, uploads kept as originals); not worth shipping variants for.
// "Palais marocain au bord de l’eau.png" is used through its copy hero-palais.png (the home hero).
const SKIP = new Set(["pexels-jonathanborba-35985212.jpg", "pexels-jonathanborba-35985242.jpg", "pexels-bertellifotografia-16120220.jpg", "IMG_9832.PNG", "508760777.jpg.jpeg", "Palais marocain au bord de l’eau.png", "logo-512.png", "image.png", "image1.png", "image2.png", "a_different_perspective-marrakech-4500910_1920.jpg", "hero-palms.jpg"]);
// Per-photo tuning for full-screen heroes whose source is smaller than a 2x screen needs: Lanczos upscaling, a light
// unsharp mask to restore edge crispness, wider variants and a higher WebP quality. Everything else uses the defaults.
const TUNE = {
  // Start frame of the home hero video: it sits under the video and must match it closely, so it keeps more detail.
  "hero-video-frame.jpg": { quality: 92 },
  "hero-palais.png": { quality: 86, widths: [480, 800, 1200, 1600, 2400, 3200], enlarge: true, sharpen: { sigma: 0.9, m1: 0.6, m2: 2.5 } },
};
const force = process.argv.includes("--force");

mkdirSync(OUT, { recursive: true });
const manifest = {};
let made = 0;
for (const dir of SRC_DIRS) {
  for (const file of readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file) || SKIP.has(file)) continue;
    const src = join(dir, file);
    // Key matches the src used in the HTML, e.g. "img/riad.jpg" or "img/ap/caravan.jpg".
    const key = src.replace(/\\/g, "/");
    const base = (dir === "img" ? "" : parse(dir).name + "-") + parse(file).name;
    const meta = await sharp(src).rotate().metadata();
    // rotate() applies EXIF orientation, so width/height describe the image as displayed.
    const turned = (meta.orientation || 1) >= 5;
    const w = turned ? meta.height : meta.width, h = turned ? meta.width : meta.height;
    const tune = TUNE[file];
    const widths = WIDTHS.filter((x) => x < w);
    if (!widths.length || w <= 2400) widths.push(Math.min(w, 2400));
    const variants = tune?.widths ?? [...new Set(widths)].sort((a, b) => a - b);
    for (const vw of variants) {
      const out = `${OUT}/${base}-${vw}.webp`;
      if (!force && existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs) continue;
      let img = sharp(src).rotate().resize({ width: vw, withoutEnlargement: !tune?.enlarge, kernel: "lanczos3" });
      if (tune?.sharpen) img = img.sharpen(tune.sharpen);
      await img.webp({ quality: tune?.quality ?? QUALITY, effort: 6, smartSubsample: true }).toFile(out);
      made++;
    }
    manifest[key] = { w, h, base: `${OUT}/${base}`, widths: variants };
  }
}
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1) + "\n");
// Square PNG of the brand key (favicon.svg, written by build.mjs) for the Organization logo in structured data.
if (existsSync("favicon.svg")) await sharp("favicon.svg", { density: 600 }).resize(512, 512).flatten({ background: "#ffffff" }).png({ compressionLevel: 9 }).toFile("img/logo-512.png");
console.log(`images: ${Object.keys(manifest).length} sources, ${made} variants written to ${OUT}/`);
