/* Optional cloud sync of progress via Firebase (Google sign-in + Firestore).
 * One document per user: progress/{uid} = { data: JSON string, updated }.
 * On sign-in and whenever the tab regains focus, the cloud copy is merged into local progress;
 * every local save is pushed (debounced). Disabled when firebase-config.js has no apiKey.
 */
import config from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const btn = document.getElementById('sync');

/* Merge two progress objects without losing work done on either device. */
function pick(a, b, f) {
  a = a || {}; b = b || {};
  const out = Object.assign({}, b, a);
  for (const k in a) if (k in b) out[k] = f(a[k], b[k]);
  return out;
}

function merge(local, remote) {
  // A reset or import is a deliberate replace: the newer one wins wholesale.
  if ((remote.resetAt || 0) > (local.resetAt || 0)) return remote;
  if ((local.resetAt || 0) > (remote.resetAt || 0)) return local;
  const out = Object.assign({}, remote, local);
  out.q = pick(local.q, remote.q, (x, y) => (x.c + x.w >= y.c + y.w ? x : y));
  out.best = pick(local.best, remote.best, Math.max);
  out.days = pick(local.days, remote.days, Math.max);
  out.sec = pick(local.sec, remote.sec, (x, y) => [...new Set(x.concat(y))].sort((m, n) => m - n));
  ['known', 'map', 'done'].forEach(k => { out[k] = Object.assign({}, remote[k], local[k]); });
  const seen = new Set();
  out.mocks = (remote.mocks || []).concat(local.mocks || [])
    .filter(m => !seen.has(m.t) && seen.add(m.t)).sort((x, y) => x.t - y.t);
  return out;
}

let lastError = null;

function show(label, title) {
  btn.textContent = label;
  btn.title = title;
}

function fail(e) {
  lastError = e;
  const hint = e.code === 'permission-denied'
    ? ' (Firestore rules do not allow progress/{uid}: publish firestore.rules on this database)'
    : e.code === 'not-found' ? ' (Firestore database not found: check FIREBASE_FIRESTORE_DATABASE_ID)' : '';
  show('[sync!]', 'Sync failed: ' + e.message + hint + '. Click for details.');
}

async function init() {
  if (!config.apiKey || !window.SAA) return;
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(SDK + 'firebase-app.js'),
    import(SDK + 'firebase-auth.js'),
    import(SDK + 'firebase-firestore.js')
  ]);
  const { databaseId, ...options } = config;
  const app = initializeApp(options);
  const a = auth.getAuth(app);
  const db = databaseId ? fs.getFirestore(app, databaseId) : fs.getFirestore(app);
  let user = null, timer = null, busy = false;

  btn.classList.remove('hidden');

  async function push() {
    clearTimeout(timer);
    timer = null;
    if (!user) return;
    show('[sync..]', 'Saving progress to the cloud');
    try {
      await fs.setDoc(fs.doc(db, 'progress', user.uid), {
        data: JSON.stringify(window.SAA.progress()),
        updated: fs.serverTimestamp()
      });
      lastError = null;
      show('[synced]', `Progress synced as ${user.email}. Click to sign out.`);
    } catch (e) {
      fail(e);
    }
  }

  async function pull() {
    if (!user || busy) return;
    busy = true;
    show('[sync..]', 'Loading progress from the cloud');
    try {
      const snap = await fs.getDoc(fs.doc(db, 'progress', user.uid));
      if (snap.exists()) window.SAA.replaceProgress(merge(window.SAA.progress(), JSON.parse(snap.data().data)));
      await push();
    } catch (e) {
      fail(e);
    } finally {
      busy = false;
    }
  }

  window.SAA.onSave(() => {
    if (!user) return;
    clearTimeout(timer);
    timer = setTimeout(push, 1500);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && timer) push();
    if (document.visibilityState === 'visible') pull();
  });

  auth.onAuthStateChanged(a, u => {
    user = u;
    if (u) pull();
    else show('[login]', 'Sign in with Google to sync progress across devices');
  });

  btn.onclick = async () => {
    if (user && lastError) {
      const msg = btn.title.replace('. Click for details.', '');
      if (confirm(msg + `\n\nSigned in as ${user.email}.\nOK = retry sync, Cancel = sign out.`)) pull();
      else auth.signOut(a);
      return;
    }
    if (user) {
      if (confirm(`Signed in as ${user.email}.\nSign out? Progress stays in this browser.`)) auth.signOut(a);
      return;
    }
    const provider = new auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(a, provider);
    } catch (e) {
      if (e.code === 'auth/popup-blocked') auth.signInWithRedirect(a, provider);
      else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') alert('Sign-in failed: ' + e.message);
    }
  };
}

init().catch(e => {
  btn.classList.remove('hidden');
  show('[sync!]', 'Cloud sync unavailable: ' + e.message);
});
