// Generates the agent avatars (initials) used by the seed: public/images/agents/*.svg.
// The agents are fictional, so they get initials instead of photos of real people.
// Run: node scripts/generate-avatars.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "public", "images", "agents");

function avatar({ initials, background }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
<rect width="160" height="160" fill="${background}"/>
<circle cx="80" cy="64" r="30" fill="#f7f3ea" opacity="0.18"/>
<path d="M28 160C32 122 54 104 80 104S128 122 132 160Z" fill="#f7f3ea" opacity="0.18"/>
<text x="80" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="56" font-weight="700" fill="#f7f3ea">${initials}</text>
</svg>
`;
}

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "martin-olivera.svg"), avatar({ initials: "MO", background: "#2e4a36" }));
writeFileSync(join(dir, "lucia-pereyra.svg"), avatar({ initials: "LP", background: "#8f5a34" }));
writeFileSync(join(dir, "federico-sosa.svg"), avatar({ initials: "FS", background: "#4a4630" }));

console.log("✓ agent avatars written to public/images/agents");
