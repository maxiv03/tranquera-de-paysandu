// Downloads the Pexels photos listed in scripts/photos.json and writes optimized WebP files to
// public/images/. Lots: public/images/lots/<category>-NN.webp (4:3). Covers: 16:9.
// Prints the credits table for CREDITS.md. Run: node scripts/import-photos.mjs
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "scripts", "photos.json"), "utf8"));

async function download(id) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Photo ${id}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function optimize(id, file, width, height) {
  const out = join(root, "public", "images", `${file}.webp`);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(await download(id))
    .resize(width, height, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 70, effort: 6 })
    .toFile(out);
  return { file: `${file}.webp`, kb: Math.round(statSync(out).size / 1024) };
}

const jobs = [
  ...manifest.covers.map((p) => ({
    ...p,
    width: 1600,
    height: 900,
    use: "Auction cover",
  })),
  ...Object.entries(manifest.lots).flatMap(([category, photos]) =>
    photos.map((p, i) => ({
      ...p,
      file: `lots/${category}-${String(i + 1).padStart(2, "0")}`,
      width: 1200,
      height: 900,
      use: `Lots: ${category}`,
    })),
  ),
];

const rows = [];
let total = 0;
for (const job of jobs) {
  const { file, kb } = await optimize(job.id, job.file, job.width, job.height);
  total += kb;
  rows.push(
    `| \`${file}\` | [Photo ${job.id}](https://www.pexels.com/photo/${job.id}/) | ${job.author} | ${job.use} |`,
  );
  process.stderr.write(`✓ ${file} ${kb} KB\n`);
}

console.log("| File (`public/images/`) | Original | Author | Used for |");
console.log("| --- | --- | --- | --- |");
console.log(rows.join("\n"));
process.stderr.write(`\n${jobs.length} photos, ${Math.round(total / 1024)} MB total\n`);
