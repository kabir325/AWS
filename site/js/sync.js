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

function show(label, title) {
  btn.textContent = label;
  btn.title = title;
}

async function init() {
  if (!config.apiKey || !window.SAA) return;
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(SDK + 'firebase-app.js'),
    import(SDK + 'firebase-auth.js'),
    import(SDK + 'firebase-firestore.js')
  ]);
  const app = initializeApp(config);
  const a = auth.getAuth(app);
  const db = fs.getFirestore(app);
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
      show('[synced]', `Progress synced as ${user.email}. Click to sign out.`);
    } catch (e) {
      show('[sync!]', 'Sync failed: ' + e.message);
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
      show('[sync!]', 'Sync failed: ' + e.message);
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
