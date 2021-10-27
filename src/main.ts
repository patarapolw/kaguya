import { pyOutput } from "./py_output";
import { makeMarkdown, search } from "./search";

async function main() {
  let out =
    process.argv.slice(2).join(" ") || "Kaguya wants to be confessed to";
  if (!out) process.exit();

  const d = {
    ...pyOutput(),
    ...(await search(`[DISC] ${out}`)),
  };

  for (const [k, v] of Object.entries(d)) {
    if (/(doujin|darkness)/i.test(v)) {
      delete d[k];
    }
  }

  makeMarkdown(d, out);
}

if (require.main === module) {
  main();
}
