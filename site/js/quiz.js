/* Quiz engine: practice mode (instant feedback) and exam mode (timer, flags, navigator, results). */
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LETTERS = 'ABCDEFGH';

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function prepare(q) {
    const correct = new Set(Array.isArray(q.a) ? q.a : [q.a]);
    return { src: q, order: shuffle(q.o.map((_, i) => i)), correct, multi: correct.size > 1, chosen: new Set(), flagged: false, done: false };
  }

  function isRight(item) {
    if (item.chosen.size !== item.correct.size) return false;
    for (const c of item.chosen) if (!item.correct.has(c)) return false;
    return true;
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function optionsHtml(item, reveal) {
    return item.order.map((orig, pos) => {
      const sel = item.chosen.has(orig);
      let cls = 'opt' + (sel ? ' selected' : '');
      if (reveal) {
        if (item.correct.has(orig)) cls += ' correct';
        else if (sel) cls += ' wrong';
      }
      return `<button class="${cls}" data-orig="${orig}" ${reveal ? 'disabled' : ''}>
        <span class="opt-key">${LETTERS[pos]}</span><span class="opt-text">${esc(item.src.o[orig])}</span></button>`;
    }).join('');
  }

  function metaHtml(item, ctx) {
    const svc = ctx.serviceName(item.src.svc);
    return `<div class="q-meta">
      <span class="chip">${esc(svc)}</span>
      ${item.src.d ? `<span class="chip dom d${item.src.d}">${esc(ctx.domainName(item.src.d))}</span>` : ''}
      ${item.multi ? `<span class="chip warn">Choose ${item.correct.size}</span>` : ''}
    </div>`;
  }

  function toggle(item, orig) {
    if (item.multi) {
      if (item.chosen.has(orig)) item.chosen.delete(orig);
      else if (item.chosen.size < item.correct.size) item.chosen.add(orig);
    } else {
      item.chosen.clear();
      item.chosen.add(orig);
    }
  }

  /* ---------- Practice mode ---------- */
  function runPractice(host, questions, ctx, opts) {
    const items = questions.map(prepare);
    let idx = 0, score = 0;

    function view() {
      const item = items[idx];
      const ready = item.multi ? item.chosen.size === item.correct.size : item.chosen.size === 1;
      host.innerHTML = `
        <div class="quiz">
          <div class="quiz-head">
            <div><b>${esc(opts.title)}</b> <span class="muted">Practice mode</span></div>
            <div class="quiz-stats"><span>Question ${idx + 1} / ${items.length}</span><span class="good">Score ${score}</span></div>
          </div>
          <div class="progress"><div style="width:${(idx / items.length) * 100}%"></div></div>
          <div class="q-card">
            ${metaHtml(item, ctx)}
            <div class="q-text">${esc(item.src.q)}</div>
            <div class="opts">${optionsHtml(item, item.done)}</div>
            ${item.done ? `<div class="explain ${isRight(item) ? 'ok' : 'bad'}">
                <b>${isRight(item) ? 'Correct' : 'Not quite'}</b>
                <div>Answer: ${item.order.filter(o => item.correct.has(o)).map(o => LETTERS[item.order.indexOf(o)]).join(', ')}</div>
                <p>${esc(item.src.e)}</p></div>` : ''}
            <div class="q-actions">
              <button class="btn ghost" data-act="quit">End quiz</button>
              ${item.done
                ? `<button class="btn primary" data-act="next">${idx === items.length - 1 ? 'See results' : 'Next question'}</button>`
                : `<button class="btn primary" data-act="check" ${ready ? '' : 'disabled'}>Check answer</button>`}
            </div>
          </div>
          <div class="kbd-hint">Keys: A-E or 1-5 to select, Enter to check / continue</div>
        </div>`;
    }

    function check() {
      const item = items[idx];
      if (item.done) return;
      const ready = item.multi ? item.chosen.size === item.correct.size : item.chosen.size === 1;
      if (!ready) return;
      item.done = true;
      const ok = isRight(item);
      if (ok) score++;
      ctx.record(item.src.id, ok);
      view();
    }

    function next() {
      if (idx < items.length - 1) { idx++; view(); }
      else finish();
    }

    function finish() {
      cleanup();
      const answered = items.filter(i => i.done);
      showResults(host, answered.length ? answered : items, ctx, Object.assign({}, opts, { mode: 'practice' }));
    }

    function onClick(e) {
      const opt = e.target.closest('.opt');
      if (opt && !items[idx].done) { toggle(items[idx], +opt.dataset.orig); view(); return; }
      const act = e.target.closest('[data-act]') && e.target.closest('[data-act]').dataset.act;
      if (act === 'check') check();
      if (act === 'next') next();
      if (act === 'quit') finish();
    }

    function onKey(e) {
      if (!document.body.contains(host) || e.target.tagName === 'INPUT') return;
      const item = items[idx];
      const k = e.key.toUpperCase();
      let pos = LETTERS.indexOf(k);
      if (pos < 0 && /^[1-8]$/.test(k)) pos = +k - 1;
      if (pos >= 0 && pos < item.order.length && !item.done) { toggle(item, item.order[pos]); view(); }
      if (e.key === 'Enter') { e.preventDefault(); item.done ? next() : check(); }
    }

    function cleanup() { host.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); }

    host.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    ctx.onLeave(cleanup);
    view();
  }

  /* ---------- Exam mode ---------- */
  function runExam(host, questions, ctx, opts) {
    const items = questions.map(prepare);
    let idx = 0;
    let remaining = opts.minutes ? opts.minutes * 60 : 0;
    let timer = null;

    function navHtml() {
      return items.map((it, i) => {
        const cls = ['nav-cell', i === idx ? 'cur' : '', it.chosen.size ? 'ans' : '', it.flagged ? 'flag' : ''].join(' ');
        return `<button class="${cls}" data-goto="${i}">${i + 1}</button>`;
      }).join('');
    }

    function view() {
      const item = items[idx];
      const answered = items.filter(i => i.chosen.size).length;
      host.innerHTML = `
        <div class="quiz exam">
          <div class="quiz-head">
            <div><b>${esc(opts.title)}</b> <span class="muted">Exam mode</span></div>
            <div class="quiz-stats">
              <span>Answered ${answered} / ${items.length}</span>
              ${opts.minutes ? `<span class="timer ${remaining < 300 ? 'low' : ''}">${fmtTime(remaining)}</span>` : ''}
            </div>
          </div>
          <div class="exam-body">
            <div class="q-card">
              <div class="q-top">
                <span class="muted">Question ${idx + 1} of ${items.length}</span>
                <button class="btn ghost small ${item.flagged ? 'flagged' : ''}" data-act="flag">${item.flagged ? 'Flagged' : 'Flag for review'}</button>
              </div>
              ${item.multi ? `<div class="q-meta"><span class="chip warn">Choose ${item.correct.size}</span></div>` : ''}
              <div class="q-text">${esc(item.src.q)}</div>
              <div class="opts">${optionsHtml(item, false)}</div>
              <div class="q-actions">
                <button class="btn ghost" data-act="prev" ${idx === 0 ? 'disabled' : ''}>Previous</button>
                <button class="btn ghost" data-act="next" ${idx === items.length - 1 ? 'disabled' : ''}>Next</button>
                <button class="btn primary" data-act="submit">Submit exam</button>
              </div>
            </div>
            <aside class="navigator">
              <div class="nav-title">Navigator</div>
              <div class="nav-grid">${navHtml()}</div>
              <div class="nav-legend"><span class="nav-cell ans"></span>Answered <span class="nav-cell flag"></span>Flagged</div>
            </aside>
          </div>
          <div class="kbd-hint">Keys: A-E / 1-5 select, arrows move between questions, F flags</div>
        </div>`;
    }

    function tick() {
      remaining--;
      const t = host.querySelector('.timer');
      if (t) { t.textContent = fmtTime(Math.max(0, remaining)); t.classList.toggle('low', remaining < 300); }
      if (remaining <= 0) { alert('Time is up. Your exam will be submitted.'); submit(true); }
    }

    function submit(force) {
      const unanswered = items.filter(i => !i.chosen.size).length;
      const flagged = items.filter(i => i.flagged).length;
      if (!force) {
        let msg = 'Submit the exam now?';
        if (unanswered) msg += `\n${unanswered} question(s) are unanswered.`;
        if (flagged) msg += `\n${flagged} question(s) are flagged for review.`;
        if (!confirm(msg)) return;
      }
      cleanup();
      items.forEach(it => { it.done = true; ctx.record(it.src.id, isRight(it)); });
      const used = opts.minutes ? opts.minutes * 60 - Math.max(0, remaining) : null;
      showResults(host, items, ctx, Object.assign({}, opts, { mode: 'exam', usedSec: used }));
    }

    function onClick(e) {
      const opt = e.target.closest('.opt');
      if (opt) { toggle(items[idx], +opt.dataset.orig); view(); return; }
      const go = e.target.closest('[data-goto]');
      if (go) { idx = +go.dataset.goto; view(); return; }
      const act = e.target.closest('[data-act]') && e.target.closest('[data-act]').dataset.act;
      if (act === 'prev' && idx > 0) { idx--; view(); }
      if (act === 'next' && idx < items.length - 1) { idx++; view(); }
      if (act === 'flag') { items[idx].flagged = !items[idx].flagged; view(); }
      if (act === 'submit') submit(false);
    }

    function onKey(e) {
      if (!document.body.contains(host) || e.target.tagName === 'INPUT') return;
      const item = items[idx];
      const k = e.key.toUpperCase();
      if (e.key === 'ArrowRight' && idx < items.length - 1) { idx++; view(); return; }
      if (e.key === 'ArrowLeft' && idx > 0) { idx--; view(); return; }
      if (k === 'F') { item.flagged = !item.flagged; view(); return; }
      let pos = LETTERS.indexOf(k);
      if (pos < 0 && /^[1-8]$/.test(k)) pos = +k - 1;
      if (pos >= 0 && pos < item.order.length) { toggle(item, item.order[pos]); view(); }
    }

    function cleanup() {
      if (timer) clearInterval(timer);
      timer = null;
      host.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    }

    host.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    ctx.onLeave(cleanup);
    if (opts.minutes) timer = setInterval(tick, 1000);
    view();
  }

  /* ---------- Results ---------- */
  function showResults(host, items, ctx, opts) {
    const total = items.length;
    const right = items.filter(isRight).length;
    const pct = total ? right / total : 0;
    const scaled = Math.round(100 + 900 * pct);
    const pass = scaled >= 720;

    const byDomain = {}, bySvc = {};
    items.forEach(it => {
      const ok = isRight(it);
      const d = it.src.d || 0;
      (byDomain[d] = byDomain[d] || { r: 0, n: 0 }).n++;
      if (ok) byDomain[d].r++;
      const s = it.src.svc;
      (bySvc[s] = bySvc[s] || { r: 0, n: 0 }).n++;
      if (ok) bySvc[s].r++;
    });

    ctx.saveResult({ title: opts.title, scope: opts.scope, pct, n: total, mode: opts.mode });

    const domRows = Object.keys(byDomain).filter(d => d !== '0').sort().map(d => {
      const v = byDomain[d], p = Math.round((v.r / v.n) * 100);
      return `<div class="bar-row"><span>${esc(ctx.domainName(+d))}</span>
        <div class="bar"><div class="${p >= 72 ? 'ok' : 'bad'}" style="width:${p}%"></div></div><b>${v.r}/${v.n}</b></div>`;
    }).join('');

    const svcRows = Object.entries(bySvc).sort((a, b) => a[1].r / a[1].n - b[1].r / b[1].n).map(([s, v]) => {
      const p = Math.round((v.r / v.n) * 100);
      return `<tr><td>${esc(ctx.serviceName(s))}</td><td>${v.r}/${v.n}</td><td><span class="pill ${p >= 72 ? 'ok' : 'bad'}">${p}%</span></td></tr>`;
    }).join('');

    const review = items.map((it, i) => {
      const ok = isRight(it);
      const opt = it.order.map((orig, pos) => {
        const c = it.correct.has(orig), sel = it.chosen.has(orig);
        return `<li class="${c ? 'correct' : ''} ${sel && !c ? 'wrong' : ''}">
          <span class="opt-key">${LETTERS[pos]}</span> ${esc(it.src.o[orig])}
          ${sel ? '<em>(your answer)</em>' : ''}</li>`;
      }).join('');
      return `<details class="rev ${ok ? 'ok' : 'bad'}" ${ok ? '' : 'open'}>
        <summary><span class="pill ${ok ? 'ok' : 'bad'}">${ok ? 'Correct' : it.chosen.size ? 'Wrong' : 'Skipped'}</span>
          <span class="rev-n">Q${i + 1}</span> ${esc(it.src.q)}</summary>
        <ul class="rev-opts">${opt}</ul>
        <p class="rev-exp">${esc(it.src.e)}</p>
        <div class="muted small">${esc(ctx.serviceName(it.src.svc))}${it.src.d ? ' &middot; ' + esc(ctx.domainName(it.src.d)) : ''}</div>
      </details>`;
    }).join('');

    host.innerHTML = `
      <div class="results">
        <div class="score-card ${pass ? 'pass' : 'fail'}">
          <div class="score-big">${Math.round(pct * 100)}%</div>
          <div>
            <div class="score-title">${esc(opts.title)}</div>
            <div>${right} of ${total} correct${opts.usedSec != null ? ` &middot; time used ${fmtTime(opts.usedSec)}` : ''}</div>
            ${opts.mode === 'exam' ? `<div class="scaled">Approx. scaled score <b>${scaled}</b> / 1000 &middot; <b>${pass ? 'PASS' : 'BELOW 720'}</b></div>
              <div class="muted small">AWS scaling is not linear; treat this as a rough indicator. Aim for 80%+ on mocks.</div>` : ''}
          </div>
        </div>
        <div class="actions-row">
          <button class="btn primary" data-act="retry">Try again (reshuffled)</button>
          ${items.some(i => !isRight(i)) ? '<button class="btn ghost" data-act="retry-wrong">Retry only the ones I missed</button>' : ''}
          <a class="btn ghost" href="#/review">Review all mistakes</a>
        </div>
        ${domRows ? `<h3>By exam domain</h3><div class="bars">${domRows}</div>` : ''}
        ${Object.keys(bySvc).length > 1 ? `<h3>By service (weakest first)</h3><table class="tbl"><thead><tr><th>Service</th><th>Score</th><th></th></tr></thead><tbody>${svcRows}</tbody></table>` : ''}
        <h3>Question review</h3>
        <div class="filter-row"><label><input type="checkbox" id="onlyWrong"> Show only incorrect</label></div>
        <div class="review-list">${review}</div>
      </div>`;

    host.querySelector('[data-act="retry"]').onclick = () => start(host, items.map(i => i.src), ctx, opts);
    const rw = host.querySelector('[data-act="retry-wrong"]');
    if (rw) rw.onclick = () => start(host, items.filter(i => !isRight(i)).map(i => i.src), ctx, Object.assign({}, opts, { title: opts.title + ' (missed)', mode: 'practice', minutes: 0 }));
    host.querySelector('#onlyWrong').onchange = e => {
      host.querySelectorAll('.rev.ok').forEach(el => { el.style.display = e.target.checked ? 'none' : ''; });
    };
    window.scrollTo(0, 0);
  }

  function start(host, questions, ctx, opts) {
    const qs = shuffle(questions);
    if (opts.mode === 'exam') runExam(host, qs, ctx, opts);
    else runPractice(host, qs, ctx, opts);
  }

  window.Quiz = { start, shuffle };
})();
