import fs from "fs";

export function pyOutput() {
  const txt = fs.readFileSync("assets/py_output.txt", "utf8");
  return txt
    .split("\n")
    .map((line) => {
      const [r1, r2] = line.split(" | ");
      return {
        id: /[^/]+$/.exec(r1!)?.[0]?.trim()!,
        c: Number(r2),
      };
    })
    .filter(({ id, c }) => id && c)
    .reduce(
      (prev, { id, c }) => ({
        ...prev,
        [id]: `Chapter ${c}`,
      }),
      {} as Record<string, string>
    );
}

if (require.main === module) {
  console.log(pyOutput());
}
