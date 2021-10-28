import fs from "fs";

import { RedditAPI } from "./shared";

const PREFIX = process.env["PREFIX"] || "[DISC]";

export async function search(q: string) {
  const api = new RedditAPI();
  const out: Record<string, string> = {};

  let after: string | undefined;
  while (true) {
    const d = await api.search(q, { after });

    d.data.children.map((c) => {
      // if (!c.data.title.startsWith(PREFIX.trim())) return
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
  let md = `Created At: ${new Date().toISOString()}\n\n`;

  const sorted = new Map<
    number,
    {
      id: string;
      title: string;
    }[]
  >();

  Object.entries(d).map(([id, title]) => {
    const i = Number(/\d+([.]\d+)?/.exec(title)?.[0]);
    if (!i) return;

    const prev = sorted.get(i) || [];
    prev.push({ id, title });
    sorted.set(i, prev);
  });

  const max = Math.max(...sorted.keys());

  Array(max)
    .fill(null)
    .map((_, i) => {
      if (!sorted.get(i + 1)) {
        sorted.set(i + 1, []);
      }
    });
  [...sorted]
    .sort(([k1], [k2]) => k1 - k2)
    .map(([i, d]) => {
      md += `- Chapter ${i}\n`;
      if (!d.length) {
        md += `  - **missing**\n`;
      }

      d.map(({ id, title }) => {
        md += `  - ${title} <https://redd.it/${id}>\n`;
      });
    });

  fs.writeFileSync(`out/${out}.md`, md);
}

if (require.main === module) {
  let out = process.argv.slice(2).join(" ");
  if (!out) process.exit();

  search(`${PREFIX} ${out}`).then((d) => {
    makeMarkdown(d, out);
  });
}
