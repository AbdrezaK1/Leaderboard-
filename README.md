# Signup Cup

Live leaderboard for The Signup Cup.

## Google Sheet Ranking

The leaderboard reads from a public Google Sheet and refreshes automatically in the browser every 5 seconds.

1. Share the Google Sheet as `Anyone with the link` and `Viewer`.
2. Copy `.env.example` to `.env.local`.
3. Set `GOOGLE_SHEET_URL` to the Google Sheet URL.
4. Run the app.

The sheet should include one column for the LC/team name and one column for signups/scores. Header names like `LC`, `Name`, `Team`, `Signups`, `Score`, or `Total` are detected automatically.

The app also has a manual refresh endpoint:

```text
http://localhost:3001/api/revalidate?secret=change-this-secret
```

Change `REVALIDATE_SECRET` in `.env.local` before deploying.

## EXPA To Google Sheets

To make Google Sheets retrieve data from EXPA directly, use the Apps Script in:

```text
google-sheets/expa-sync.gs
```

Setup:

1. Open your Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Paste the contents of `google-sheets/expa-sync.gs`.
4. Open `Project Settings > Script properties`.
5. Add these properties:

```text
EXPA_API_URL=https://your-expa-or-gis-api-url
EXPA_TOKEN=your_private_token
```

Optional properties:

```text
AUTH_HEADER=Authorization
AUTH_PREFIX=Bearer
ITEMS_PATH=data
LC_PATH=person.home_lc.name
CAMPAIGN_UTM_CAMPAIGN=DZA-Signup-cup
CAMPAIGN_UTM_SOURCE=Instagram
CAMPAIGN_UTM_MEDIUM=OrganicSocialMedia
CAMPAIGN_UTM_TERM=Nlds
CAMPAIGN_UTM_CONTENT=General
LEADERBOARD_SHEET_NAME=Leaderboard
RAW_SHEET_NAME=Raw_EXPA
```

Run `syncExpaToLeaderboard` once, approve permissions, then use the `Signup Cup` menu in the Sheet to sync manually or create a 1-minute trigger.

The default campaign filter matches this Signup Cup URL:

```text
https://aiesec.org/?utm_source=Instagram&utm_medium=OrganicSocialMedia&utm_campaign=DZA-Signup-cup&utm_term=Nlds&utm_content=General
```

If EXPA stores campaign data in known fields, add a comma-separated `CAMPAIGN_FIELD_PATHS` property to make matching stricter and faster, for example:

```text
CAMPAIGN_FIELD_PATHS=utm_campaign,utm_source,utm_medium,utm_term,utm_content
```

The script writes a `Leaderboard` sheet with:

```text
LC | Signup
```

That is the same format the website already reads.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```
