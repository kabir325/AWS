/* Writes site/js/firebase-config.js from FIREBASE_* environment variables (set in Vercel).
 * Without FIREBASE_API_KEY it leaves the committed file untouched, so local use keeps working.
 * Usage: node tools/write-firebase-config.js
 */
const fs = require('fs');
const path = require('path');

const env = process.env;
if (!env.FIREBASE_API_KEY) {
  console.log('FIREBASE_API_KEY not set: keeping committed site/js/firebase-config.js');
  process.exit(0);
}

const config = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  databaseId: env.FIREBASE_FIRESTORE_DATABASE_ID
};
const missing = Object.keys(config).filter(k => k !== 'databaseId' && !config[k]);
if (missing.length) {
  console.error('Missing Firebase environment variables for: ' + missing.join(', '));
  process.exit(1);
}
if (!config.databaseId) delete config.databaseId;

const out = path.resolve(__dirname, '..', 'site', 'js', 'firebase-config.js');
fs.writeFileSync(out, '/* Generated at build time by tools/write-firebase-config.js from FIREBASE_* env vars. */\n' +
  'export default ' + JSON.stringify(config, null, 2) + ';\n');
console.log('Wrote site/js/firebase-config.js for project ' + config.projectId);
