import qs from "querystring";

import axios from "axios";

// @ts-ignore
import token from "../token.json";

export class RedditAPI {
  api = axios.create({
    baseURL: "https://oauth.reddit.com",
    headers: {
      Authorization: `bearer ${token.access_token}`,
    },
  });

  async search(q: string, after?: string) {
    return this.api
      .get(
        `/search?${qs.stringify({
          q,
          after,
        })}`
      )
      .then(
        (r) =>
          r.data as {
            kind: "Listing";
            data: {
              after?: string;
              children: {
                kind: "t3";
                data: {
                  subreddit: string;
                  title: string;
                  id: string;
                };
              }[];
            };
          }
      );
  }
}
