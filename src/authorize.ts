import crypto from "crypto";
import fs from "fs";
import qs from "querystring";
import readline from "readline";

import axios from "axios";
import open from "open";

import secret from "../secret.json";

interface IAuthorizeParams {
  client_id: string;
  redirect_uri: string;
  duration: "temporary" | "permanent";
  /**
   * Scope Values: identity, edit, flair, history, modconfig, modflair, modlog, modposts, modwiki, mysubreddits,
   * privatemessages, read, report, save, submit, subscribe, vote, wikiedit, wikiread.
   *
   * Space-separated
   */
  scope: string;
}

async function authorize(
  outputPath: string,
  params: Partial<IAuthorizeParams> = {}
) {
  const state = crypto.randomBytes(64).toString("hex");
  console.log(`Using state: ${state}`);

  open(
    `https://www.reddit.com/api/v1/authorize?${qs.stringify({
      ...Object.assign(
        {
          client_id: secret.client_id,
          redirect_uri: secret.redirect_uri,
          duration: "temporary",
          scope: "read",
        },
        params
      ),
      response_type: "code",
      state,
    })}`
  );

  const rl = readline.createInterface(process.stdin, process.stdout);

  const code = (await new Promise((resolve, reject) => {
    rl.question("Please paste the redirected url: ", (url) => {
      if (url.startsWith(secret.redirect_uri)) {
        const u = new URL(url);
        console.log(u.searchParams);
        const state0 = u.searchParams.get("state");
        const code = u.searchParams.get("code");
        state0 === state ? resolve(code) : reject(state0);
      }
    });
  })) as string | null;

  rl.close();

  const r = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    qs.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: secret.redirect_uri,
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${secret.client_id}:${secret.client_secret}`
        ).toString("base64")}`,
      },
    }
  );

  fs.writeFileSync(outputPath, JSON.stringify(r.data, null, 2));
}

authorize("token.json", {
  scope: "identity read",
}).catch(console.error);
