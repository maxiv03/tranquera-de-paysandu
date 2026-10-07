// Compresses a source clip for the web: muted H.264 MP4 (960px wide, fast start) plus a WebP poster.
// Sources are listed in CREDITS.md. Usage:
//   node scripts/optimize-video.mjs <input.mp4> <name> [startSeconds] [durationSeconds] [crf]
// Higher crf = smaller file (28 default; detailed footage like grass from above needs ~32).
// Writes public/videos/<name>.mp4 and public/videos/<name>-poster.webp
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const [input, name, start = "0", duration = "14", crf = "28"] = process.argv.slice(2);
if (!input || !name) {
  console.error(
    "Usage: node scripts/optimize-video.mjs <input.mp4> <name> [start] [duration] [crf]",
  );
  process.exit(1);
}

const outDir = join(import.meta.dirname, "..", "public", "videos");
mkdirSync(outDir, { recursive: true });
const video = join(outDir, `${name}.mp4`);
const poster = join(outDir, `${name}-poster.webp`);

execFileSync(ffmpeg, [
  "-v",
  "error",
  "-y",
  "-ss",
  start,
  "-t",
  duration,
  "-i",
  input,
  "-vf",
  "scale=960:-2,fps=25",
  "-c:v",
  "libx264",
  "-profile:v",
  "main",
  "-preset",
  "slow",
  "-crf",
  crf,
  "-pix_fmt",
  "yuv420p",
  "-an",
  "-movflags",
  "+faststart",
  video,
]);

// Poster: first frame of the optimized clip, so it matches what plays.
const frame = execFileSync(
  ffmpeg,
  [
    "-v",
    "error",
    "-i",
    video,
    "-frames:v",
    "1",
    "-f",
    "image2pipe",
    "-vcodec",
    "png",
    "-",
  ],
  { maxBuffer: 32 * 1024 * 1024 },
);
await sharp(frame).webp({ quality: 65 }).toFile(poster);

const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`;
console.log(`✓ ${name}.mp4 ${kb(video)} · poster ${kb(poster)}`);
