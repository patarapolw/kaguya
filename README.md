## Formatted output

See [/docs](/docs).

## Reddit API scraping

- Create `/secret.json` with credentials from <https://www.reddit.com/prefs/apps>. See <https://github.com/reddit-archive/reddit/wiki/OAuth2>.

```json
{
  "client_id": "<CLIENT_ID>",
  "client_secret": "<CLIENT_SECRET>",
  "redirect_uri": "<REDIRECT_URI>"
}
```

- Authorize first (i.e. create `/token.json` programmatically) by running `yarn ts src/authorize.ts`
- Run either
  - `yarn ts src/search.ts <KEYWORDS>` (e.g. `yarn ts src/search.ts kaguya talk`)
  - `yarn ts src/main.ts` for main manga
- See the output in [/out](/out).
