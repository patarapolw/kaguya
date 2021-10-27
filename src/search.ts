import fs from "fs";

import yaml from "js-yaml";

import { RedditAPI } from "./shared";
import { out } from "./var";

async function search(q: string) {
  const api = new RedditAPI();
  const out: {
    title: string;
    url: string;
  }[] = [];

  let after: string | undefined;
  while (true) {
    const d = await api.search(q, after);

    out.push(
      ...d.data.children.map((c) => ({
        title: c.data.title,
        url: `https://redd.it/${c.data.id}`,
      }))
    );

    after = d.data.after;
    if (!after) {
      break;
    }

    console.log(after);
  }

  return out;
}

if (require.main === module) {
  search(process.argv[2] || `[DISC] ${out}`).then((d) => {
    const s = (a: typeof d[0]) => Number(/\d+/.exec(a.title)?.[0]);
    fs.writeFileSync(
      `out/${out}.yaml`,
      yaml.dump(d.sort((a, b) => s(a) - s(b)))
    );
  });
}
