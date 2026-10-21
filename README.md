# AWS SAA-C03 Revision Kit

Last-minute revision material for the AWS Certified Solutions Architect - Associate (SAA-C03) exam.

## What is inside

| Path | What it is |
| --- | --- |
| `site/index.html` | Offline study website: docs, mind maps, quizzes, mock exams, flashcards, cheat sheet |
| `docs/` | The same content as Markdown, one file per service, plus `cheat-sheet.md` and `scenarios.md` |
| `site/data/*.js` | Single source of truth for all content |
| `tools/build-docs.js` | Validates the data and regenerates `docs/` |

## Using the website

Double-click `site/index.html` (no server or internet needed). Features:

- **Documentation** per service: every component explained, plus exam tips. Print to PDF from any service page.
- **Mind map** per service and a **global mind map** of everything. Drag to pan, scroll to zoom, click to expand, double-click to expand a whole branch, "Show details" to see explanations on the map, "Fullscreen" for revision sessions.
- **Quiz** per service in practice mode (instant explanation) or exam mode (score at the end).
- **Mock exams**: full 65 questions / 130 minutes, half mock, quick 20, scenario drill, and focus sets by domain or category. Questions are weighted by the official domain percentages.
- **Review mistakes**: every question you got wrong last time, plus your weakest services.
- **Flashcards**: every concept plus "keyword -> service" cards; mark what you know.
- **Cheat sheet**: exam strategy, keyword-to-service table, comparison tables, numbers to remember, all exam tips.
- **Search** (press `/`): jumps straight to a concept inside the docs.

Progress (scores, mistakes, known flashcards) is saved in the browser's local storage.

## Hosting (Vercel)

The site is fully static: no backend, no database, no npm dependencies. `vercel.json` tells Vercel to serve the `site/` folder and to run `node tools/build-docs.js` as the build step, so a deploy fails if the data is invalid.

Progress is stored per browser in local storage; use **progress -> export / import json** to move it between devices, or turn on cloud sync below.

## Cloud sync (optional, Firebase)

Signing in with Google syncs progress across devices through Firestore (one document per user at `progress/{uid}`). Sync is off until `site/js/firebase-config.js` has an `apiKey`.

1. Firebase console -> your project -> **Build -> Authentication -> Get started -> Sign-in method -> Google -> Enable**.
2. **Authentication -> Settings -> Authorized domains -> Add domain**: your Vercel domain (e.g. `aws-xyz.vercel.app`). `localhost` is there by default.
3. **Build -> Firestore Database -> Create database** (production mode, any region), then **Rules**: paste `firestore.rules` and **Publish**.
4. **Project settings -> Your apps -> Add app -> Web (</>)**, copy the `firebaseConfig` values into `site/js/firebase-config.js`, commit and push.

Merging: answers keep whichever device has more attempts, best scores take the max, reviewed sections / known cards / done topics are combined. **reset all** and **import json** replace the cloud copy too.

## Editing content

1. Edit or add entries in `site/data/*.js` (shape documented at the top of `site/data/_init.js`).
2. Run `node tools/build-docs.js` to validate (answer indexes, domains, "Choose TWO" wording, ASCII only) and regenerate `docs/`.
3. Reload the website.

## Note on accuracy

Content reflects the SAA-C03 exam guide and AWS behavior as of 2025-2026. Where AWS changed a limit recently (for example SQS message size or gp3 maximums), both the classic exam figure and the newer value are mentioned. Always prefer the official exam guide if in doubt.
