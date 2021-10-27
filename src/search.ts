import fs from "fs";

import { RedditAPI } from "./shared";

export async function search(q: string) {
  const api = new RedditAPI();
  const out: Record<string, string> = {};

  let after: string | undefined;
  while (true) {
    const d = await api.search(q, after);

    d.data.children.map((c) => {
      out[c.data.id] = c.data.title;
    });

    after = d.data.after;
    if (!after) {
      break;
    }

    console.log(after);
  }

  return out;
}

export function makeMarkdown(d: Record<string, string>, out: string) {
  const s = (a: string) => Number(/\d+/.exec(a)?.[0]);
  fs.writeFileSync(
    `out/${out}.md`,
    `
Created At: ${new Date().toISOString()}
${Object.entries(d)
  .sort(([, a], [, b]) => s(a) - s(b))
  .map(
    ([id, title]) => `
${title} <https://redd.it/${id}>
`
  )
  .join("")}
`
  );
}

if (require.main === module) {
  let out = process.argv.slice(2).join(" ");
  if (!out) process.exit();

  search(`[DISC] ${out}`).then((d) => {
    makeMarkdown(d, out);
  });
}
