import { readFileSync, statSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../assets/minecraft-1.12.2.json", import.meta.url), "utf8"));
const required = [
  ...[...manifest.textures, manifest.font].map((path) => path.replace(/^assets\//, "")),
  ...manifest.audio.map(({ resource }) => resource),
  "minecraft/fonts/minecraft-ascii.woff2",
  "minecraft/fonts/minecraft-ten.woff2",
  "NOOR_AHMADI_RESUME.pdf",
  "media/minecraft-edit.mp4",
  "media/minecraft-edit-poster.jpg",
];

const missing = required.filter((path) => {
  try {
    const file = statSync(new URL(`../public/${path}`, import.meta.url));
    return !file.isFile() || file.size === 0;
  } catch {
    return true;
  }
});

if (missing.length) {
  console.error(`Missing or empty public assets:\n${missing.join("\n")}`);
  console.error("Restore the listed files. For Minecraft assets, run scripts/import_assets.py and scripts/build_font.py first.");
  process.exit(1);
}

console.log(`Found all ${required.length} required public assets.`);
