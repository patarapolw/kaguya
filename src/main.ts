import { makeMarkdown, search } from "./search";

async function main() {
  let out = process.argv.slice(2).join(" ");
  if (!out) process.exit();

  const d = await search(`[DISC] ${out}`);

  for (const k of Object.keys(d)) {
    if (/doujin/.test(k)) {
      delete d[k];
    }
  }

  makeMarkdown(d, out);
}

if (require.main === module) {
  main();
}
