// Generates the local placeholder images used by the seed (public/images/**).
// Deterministic: running it again produces the same files. Run: node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "public", "images");

// Small seeded PRNG so every run draws the same landscapes.
function random(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const palettes = {
  dawn: {
    sky: ["#f4e9cc", "#f7f3ea"],
    far: "#a9b88f",
    mid: "#6f8a5c",
    near: "#3b5d44",
    cattle: "#2a2420",
  },
  noon: {
    sky: ["#dfe7e4", "#f7f3ea"],
    far: "#b7c39a",
    mid: "#7f9862",
    near: "#2e4a36",
    cattle: "#1e1a17",
  },
  dusk: {
    sky: ["#ecc9a0", "#f4e9cc"],
    far: "#b59a6a",
    mid: "#7c6a45",
    near: "#4a4630",
    cattle: "#231c16",
  },
};

// One head of cattle in a 100×64 box, facing right.
const cow = `<symbol id="cow" viewBox="0 0 100 64"><path d="M18 18Q20 12 30 12H72Q80 12 84 16L92 14Q97 14 98 19L97 27Q96 31 91 31H87Q84 40 80 42V60H75L74 44H60L58 60H53L52 44H38L36 60H31L30 44Q24 43 22 38V60H17V34Q15 28 18 18Z"/><path d="M18 20Q10 24 10 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></symbol>`;

// Herd size and scale per lot category: many small calves, fewer large cows.
const herds = {
  calves: { count: [7, 10], scale: [0.55, 0.75] },
  steers: { count: [5, 7], scale: [0.85, 1.05] },
  heifers: { count: [5, 8], scale: [0.75, 0.95] },
  cows: { count: [3, 5], scale: [1.05, 1.25] },
  fair: { count: [6, 9], scale: [0.7, 0.95] },
};

function hill(rand, width, height, baseY, amplitude) {
  const points = [];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    points.push([(width / steps) * i, baseY + (rand() - 0.5) * amplitude]);
  }
  let d = `M0 ${height}L${points[0][0]} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += `C${cx.toFixed(1)} ${y0.toFixed(1)} ${cx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return `${d}L${width} ${height}Z`;
}

function landscape({ seed, width, height, palette, herd, corral = false }) {
  const rand = random(seed);
  const p = palettes[palette];
  const horizon = height * 0.46;
  const [minCount, maxCount] = herds[herd].count;
  const [minScale, maxScale] = herds[herd].scale;
  const count = minCount + Math.floor(rand() * (maxCount - minCount + 1));

  const cattle = Array.from({ length: count }, () => {
    const depth = rand(); // 0 = far, 1 = near
    const scale =
      (minScale + rand() * (maxScale - minScale)) * (0.55 + depth * 0.6) * (width / 800);
    const w = 100 * scale;
    const x = rand() * (width - w);
    const y = height * (0.6 + depth * 0.25) - 64 * scale;
    const flip = rand() > 0.5;
    const transform = flip
      ? ` transform="translate(${(2 * x + w).toFixed(1)} 0) scale(-1 1)"`
      : "";
    return {
      depth,
      svg: `<use href="#cow" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(64 * scale).toFixed(1)}"${transform}/>`,
    };
  })
    .sort((a, b) => a.depth - b.depth)
    .map((c) => c.svg)
    .join("");

  // A farm gate on the left, or corral rails across the scene for saleyard covers.
  const postY = height * 0.62;
  const gate = corral
    ? Array.from(
        { length: 3 },
        (_, i) =>
          `<rect x="0" y="${(height * (0.7 + i * 0.07)).toFixed(1)}" width="${width}" height="${(height * 0.018).toFixed(1)}"/>`,
      ).join("") +
      Array.from(
        { length: 9 },
        (_, i) =>
          `<rect x="${((width / 8) * i - 6).toFixed(1)}" y="${(height * 0.66).toFixed(1)}" width="12" height="${(height * 0.34).toFixed(1)}"/>`,
      ).join("")
    : `<rect x="${width * 0.06}" y="${postY - height * 0.16}" width="${width * 0.016}" height="${height * 0.24}"/><rect x="${width * 0.3}" y="${postY - height * 0.16}" width="${width * 0.016}" height="${height * 0.24}"/>` +
      [0, 1, 2, 3]
        .map(
          (i) =>
            `<rect x="${width * 0.06}" y="${(postY - height * 0.14 + i * height * 0.045).toFixed(1)}" width="${width * 0.256}" height="${height * 0.012}"/>`,
        )
        .join("") +
      `<path d="M${width * 0.07} ${(postY + height * 0.01).toFixed(1)}L${width * 0.31} ${(postY - height * 0.13).toFixed(1)}" stroke="${p.near}" stroke-width="${height * 0.012}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>${cow}</defs>
<rect width="${width}" height="${height}" fill="url(#sky)"/>
<circle cx="${(width * (0.6 + rand() * 0.3)).toFixed(1)}" cy="${(height * 0.2).toFixed(1)}" r="${(height * 0.07).toFixed(1)}" fill="#fffdf8" opacity="0.7"/>
<path d="${hill(rand, width, height, horizon, height * 0.08)}" fill="${p.far}"/>
<path d="${hill(rand, width, height, horizon + height * 0.08, height * 0.1)}" fill="${p.mid}"/>
<path d="${hill(rand, width, height, horizon + height * 0.2, height * 0.06)}" fill="${p.near}"/>
<g fill="${p.cattle}" color="${p.cattle}">${cattle}</g>
<g fill="#5b4632" opacity="0.9">${gate}</g>
</svg>
`;
}

function avatar({ initials, background }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
<rect width="160" height="160" fill="${background}"/>
<circle cx="80" cy="64" r="30" fill="#f7f3ea" opacity="0.18"/>
<path d="M28 160C32 122 54 104 80 104S128 122 132 160Z" fill="#f7f3ea" opacity="0.18"/>
<text x="80" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="56" font-weight="700" fill="#f7f3ea">${initials}</text>
</svg>
`;
}

function write(path, content) {
  mkdirSync(join(root, path, ".."), { recursive: true });
  writeFileSync(join(root, path), content);
}

const variants = ["dawn", "noon", "dusk"];
let seed = 1;
for (const category of ["calves", "steers", "heifers", "cows"]) {
  variants.forEach((palette, i) => {
    write(
      `lots/${category}-${i + 1}.svg`,
      landscape({
        seed: seed++ * 7919,
        width: 800,
        height: 600,
        palette,
        herd: category,
      }),
    );
  });
}

write(
  "auctions/screen-1.svg",
  landscape({ seed: 101, width: 1200, height: 630, palette: "noon", herd: "steers" }),
);
write(
  "auctions/screen-2.svg",
  landscape({ seed: 202, width: 1200, height: 630, palette: "dawn", herd: "heifers" }),
);
write(
  "auctions/fair-1.svg",
  landscape({
    seed: 303,
    width: 1200,
    height: 630,
    palette: "dusk",
    herd: "fair",
    corral: true,
  }),
);
write(
  "auctions/fair-2.svg",
  landscape({
    seed: 404,
    width: 1200,
    height: 630,
    palette: "noon",
    herd: "fair",
    corral: true,
  }),
);

write("agents/martin-olivera.svg", avatar({ initials: "MO", background: "#2e4a36" }));
write("agents/lucia-pereyra.svg", avatar({ initials: "LP", background: "#8f5a34" }));
write("agents/federico-sosa.svg", avatar({ initials: "FS", background: "#4a4630" }));

console.log("✓ placeholders written to public/images");
