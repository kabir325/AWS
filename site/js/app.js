(function () {
  const A = window.AWS;
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = n => String(n).padStart(2, '0');
  const pctTxt = p => Math.round(p * 100) + '%';

  const catById = Object.fromEntries(A.categories.map(c => [c.id, c]));
  const ordered = A.categories.flatMap(c => A.services.filter(s => s.cat === c.id));
  const svcById = Object.fromEntries(ordered.map(s => [s.id, s]));
  const activeCats = A.categories.filter(c => ordered.some(s => s.cat === c.id));

  const allQuestions = [];
  ordered.forEach(s => s.q.forEach((q, i) => allQuestions.push(Object.assign({}, q, { id: s.id + '#' + i, svc: s.id }))));
  A.scenarios.forEach((q, i) => allQuestions.push(Object.assign({}, q, { id: 'scenario#' + i, svc: 'scenario' })));
  const qById = Object.fromEntries(allQuestions.map(q => [q.id, q]));

  const cardsBySvc = Object.fromEntries(ordered.map(s => [s.id, s.s.flatMap((sec, k) => sec.i.map((it, j) =>
    ({ id: `${s.id}-${k}-${j}`, front: it[0], ctx: `${s.name} / ${sec.h}`, back: it[1] })))]));
  const kwCards = A.cheats.keywords.map((kw, i) => ({ id: 'kw-' + i, front: kw[0], ctx: 'keyword -> service', back: kw[1] }));
  const allCards = ordered.flatMap(s => cardsBySvc[s.id]).concat(kwCards);

  const DOMAIN_SHORT = { 1: 'secure', 2: 'resilient', 3: 'performant', 4: 'cost' };
  const dayKey = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  /* ---------- Progress store (localStorage) ---------- */
  const Store = {
    key: 'saa-revision-v1',
    data: null,
    get() {
      if (!this.data) {
        try { this.data = JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { this.data = {}; }
        ['q', 'best', 'known', 'sec', 'map', 'done', 'days'].forEach(k => { this.data[k] = this.data[k] || {}; });
        this.data.mocks = this.data.mocks || [];
      }
      return this.data;
    },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* storage full or disabled */ } },
    touch() { const d = this.get(), k = dayKey(new Date()); d.days[k] = (d.days[k] || 0) + 1; },
    record(id, ok) {
      const r = this.get().q[id] = this.get().q[id] || { c: 0, w: 0 };
      if (ok) r.c++; else r.w++;
      r.last = ok ? 1 : 0;
      this.touch();
      this.save();
    }
  };

  /* ---------- Progress model ----------
   * Topic % = 40% sections reviewed + 10% mind map opened + 30% quiz best (80% = full) + 20% flashcards known.
   * Marking a topic as done sets it to 100%.
   */
  function prog(s) {
    const d = Store.get();
    const secTotal = s.s.length;
    const secDone = (d.sec[s.id] || []).filter(i => i < secTotal).length;
    const map = d.map[s.id] ? 1 : 0;
    const best = d.best[s.id];
    const cards = cardsBySvc[s.id];
    const known = cards.filter(c => d.known[c.id]).length;
    const done = !!d.done[s.id];
    let pct = 0.4 * (secDone / secTotal) + 0.1 * map + 0.3 * Math.min(1, (best || 0) / 0.8) + 0.2 * (known / cards.length);
    if (done) pct = 1;
    return { secDone, secTotal, map, best, known, cardsTotal: cards.length, done, pct, status: done ? 'done' : pct > 0 ? 'wip' : 'todo' };
  }

  function overall(list) {
    const ps = (list || ordered).map(prog);
    return {
      pct: ps.reduce((n, p) => n + p.pct, 0) / ps.length,
      done: ps.filter(p => p.done).length,
      wip: ps.filter(p => p.status === 'wip').length,
      total: ps.length,
      secDone: ps.reduce((n, p) => n + p.secDone, 0),
      secTotal: ps.reduce((n, p) => n + p.secTotal, 0)
    };
  }

  function qStats() {
    const d = Store.get();
    const ids = Object.keys(d.q).filter(id => qById[id]);
    const c = ids.filter(id => d.q[id].last).length;
    return { attempted: ids.length, correct: c, acc: ids.length ? c / ids.length : 0 };
  }

  function streak() {
    const days = Store.get().days;
    const d = new Date();
    if (!days[dayKey(d)]) d.setDate(d.getDate() - 1);
    let n = 0;
    while (days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  const glyph = st => `<span class="st st-${st}">${st === 'done' ? '[x]' : st === 'wip' ? '[~]' : '[ ]'}</span>`;
  const asciiBar = (p, n) => { const f = Math.round(p * (n || 20)); return '[' + '#'.repeat(f) + '-'.repeat((n || 20) - f) + ']'; };
  const bar = (p, cls) => `<div class="pbar ${cls || ''}"><div style="width:${Math.round(p * 100)}%"></div></div>`;
  const level = p => p >= 0.8 ? 'ok' : p >= 0.6 ? 'mid' : 'bad';

  function ring(p, label, size) {
    const r = 52, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 120 120" width="${size || 132}" height="${size || 132}">
      <circle cx="60" cy="60" r="${r}" class="ring-bg"/>
      <circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p)).toFixed(1)}" transform="rotate(-90 60 60)"/>
      <text x="60" y="60" class="ring-t">${pctTxt(p)}</text><text x="60" y="80" class="ring-s">${esc(label)}</text></svg>`;
  }

  function heatmap(weeks) {
    const days = Store.get().days;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const start = new Date(now); start.setDate(now.getDate() - (weeks - 1) * 7 - now.getDay());
    let cells = '';
    for (let i = 0; i < weeks * 7; i++) {
      const day = new Date(start); day.setDate(start.getDate() + i);
      const k = dayKey(day), n = days[k] || 0;
      const lvl = day > now ? 'x' : n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
      cells += `<i class="l${lvl}" title="${k}: ${n} action(s)"></i>`;
    }
    return `<div class="heat">${cells}</div>
      <div class="heat-legend">less <i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i> more</div>`;
  }

  /* ---------- Router ---------- */
  let leaveFns = [];
  let currentSvc = null;
  let pendingAnchor = null;

  const ctx = {
    serviceName: id => id === 'scenario' ? 'Cross-service scenario' : (svcById[id] ? svcById[id].name : id),
    domainName: d => A.domains[d] || 'General',
    record: (id, ok) => Store.record(id, ok),
    onLeave: fn => leaveFns.push(fn),
    saveResult: r => {
      const d = Store.get();
      if (r.scope && svcById[r.scope] && r.n >= 3) d.best[r.scope] = Math.max(d.best[r.scope] || 0, r.pct);
      if (r.scope === 'mock') d.mocks.push({ t: Date.now(), pct: r.pct, n: r.n, title: r.title });
      Store.save();
      refresh();
    }
  };

  function refresh() {
    renderSidebar();
    renderStatus();
    const el = $('#checklist');
    if (el && currentSvc) el.innerHTML = checklistHtml(currentSvc);
  }

  function route() {
    leaveFns.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    leaveFns = [];
    currentSvc = null;
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const main = $('#main');
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
    const [p0, p1, p2] = parts;
    if (!p0) viewHome(main);
    else if (p0 === 's' && svcById[p1]) viewService(main, svcById[p1], p2 || 'docs');
    else if (p0 === 'map') viewGlobalMap(main);
    else if (p0 === 'progress') viewProgress(main);
    else if (p0 === 'mock') viewMock(main);
    else if (p0 === 'cheat') viewCheat(main);
    else if (p0 === 'cards') viewCards(main, null);
    else if (p0 === 'review') viewReview(main);
    else viewHome(main);
    highlightNav();
    renderStatus();
  }

  /* ---------- Sidebar & status bar ---------- */
  function renderSidebar() {
    const nav = $('#sidebar');
    const scroll = nav.scrollTop;
    nav.innerHTML = `
      <div class="nav-section">
        <a href="#/" data-nav=""><span class="ico">~</span>dashboard</a>
        <a href="#/progress" data-nav="progress"><span class="ico">%</span>progress</a>
        <a href="#/map" data-nav="map"><span class="ico">*</span>global mind map</a>
        <a href="#/mock" data-nav="mock"><span class="ico">&gt;</span>mock exams</a>
        <a href="#/cheat" data-nav="cheat"><span class="ico">#</span>cheat sheet</a>
        <a href="#/cards" data-nav="cards"><span class="ico">=</span>flashcards</a>
        <a href="#/review" data-nav="review"><span class="ico">!</span>review mistakes</a>
      </div>
      ${activeCats.map(c => {
        const list = ordered.filter(s => s.cat === c.id);
        const o = overall(list);
        return `<div class="nav-cat">
          <div class="nav-cat-title" style="--c:${c.color}"><span class="dot"></span><span class="nm">${esc(c.name)}</span><span class="cnt">${o.done}/${o.total}</span></div>
          <div class="nav-cat-bar" style="--c:${c.color}">${bar(o.pct)}</div>
          ${list.map(s => {
            const p = prog(s);
            return `<a href="#/s/${s.id}" data-nav="s/${s.id}" class="svc-link" style="--p:${Math.round(p.pct * 100)}%">
              ${glyph(p.status)}<span class="nm">${esc(s.name)}</span><span class="pc">${p.pct ? pctTxt(p.pct) : ''}</span></a>`;
          }).join('')}
        </div>`;
      }).join('')}`;
    nav.scrollTop = scroll;
    highlightNav();
  }

  function highlightNav() {
    const h = location.hash.replace(/^#\/?/, '');
    document.querySelectorAll('#sidebar a').forEach(a => {
      const n = a.dataset.nav;
      a.classList.toggle('active', n === '' ? h === '' : h === n || h.startsWith(n + '/'));
    });
  }

  function renderStatus() {
    const o = overall(), q = qStats(), d = Store.get();
    const known = allCards.filter(c => d.known[c.id]).length;
    const best = d.mocks.length ? Math.max(...d.mocks.map(m => m.pct)) : null;
    const where = location.hash.replace(/^#\/?/, '') || 'dashboard';
    $('#statusbar').innerHTML = `
      <span class="sb-mode">NORMAL</span>
      <span class="sb-item">~/${esc(where)}</span>
      <span class="sb-grow"></span>
      <span class="sb-item">progress <b>${pctTxt(o.pct)}</b></span>
      <span class="sb-item">topics <b>${o.done}/${o.total}</b></span>
      <span class="sb-item">sections <b>${o.secDone}/${o.secTotal}</b></span>
      <span class="sb-item">q <b>${q.attempted}/${allQuestions.length}</b> acc <b>${q.attempted ? pctTxt(q.acc) : '--'}</b></span>
      <span class="sb-item">cards <b>${known}/${allCards.length}</b></span>
      <span class="sb-item">best mock <b>${best != null ? pctTxt(best) : '--'}</b></span>
      <span class="sb-item sb-streak">streak <b>${streak()}d</b></span>`;
  }

  function stars(n) { return '<span class="stars" title="Exam importance">' + '&#9632;'.repeat(n) + '<span class="off">' + '&#9632;'.repeat(3 - n) + '</span></span>'; }

  function serviceTree(s, withStatus) {
    return {
      label: (withStatus ? (prog(s).done ? '[x] ' : prog(s).pct ? '[~] ' : '[ ] ') : '') + s.name,
      color: catById[s.cat].color,
      detail: s.tag,
      children: s.s.map(sec => ({
        label: sec.h,
        children: sec.i.map(it => ({ label: it[0], detail: it[1], children: (it[2] || []).map(c => ({ label: c[0], detail: c[1] })) }))
      })).concat(s.tips && s.tips.length ? [{ label: 'Exam tips', color: '#facc15', children: s.tips.map(t => ({ label: t })) }] : [])
    };
  }

  function nextUp(skipId) {
    return ordered.filter(s => !prog(s).done && s.id !== skipId).sort((a, b) => b.imp - a.imp || prog(b).pct - prog(a).pct)[0];
  }

  /* ---------- Dashboard ---------- */
  function viewHome(main) {
    const d = Store.get();
    const o = overall(), q = qStats();
    const known = allCards.filter(c => d.known[c.id]).length;
    const best = d.mocks.length ? Math.max(...d.mocks.map(m => m.pct)) : null;
    const last = d.last && svcById[d.last];
    const nxt = nextUp(last && last.id);

    main.innerHTML = `
      <section class="term">
        <div class="term-head"><span class="tdots"><i></i><i></i><i></i></span><span>saa-c03 :: mission control</span><span class="term-r">session ${new Date().toLocaleDateString()}</span></div>
        <div class="term-body">
          <div><span class="tp">$</span> aws certify status --exam ${A.exam.code}</div>
          <div class="to"><span class="tk">exam     </span> ${A.exam.questions} questions (${A.exam.scored} scored) | ${A.exam.minutes} min | pass ${A.exam.passScaled}/1000 | ~2 min/question</div>
          <div class="to"><span class="tk">domains  </span> ${Object.keys(A.domains).map(k => `${DOMAIN_SHORT[k]} ${A.domainWeights[k]}%`).join(' | ')}</div>
          <div class="to"><span class="tk">progress </span> <span class="tbar">${asciiBar(o.pct, 30)}</span> ${pctTxt(o.pct)} <span class="tdim">(${o.done}/${o.total} topics done, ${o.wip} in progress)</span></div>
          <div class="to"><span class="tk">practice </span> ${q.attempted}/${allQuestions.length} questions | accuracy ${q.attempted ? pctTxt(q.acc) : '--'} | best mock ${best != null ? pctTxt(best) : '--'} | streak ${streak()}d</div>
          <div><span class="tp">$</span> <span class="cursor">_</span></div>
        </div>
        <div class="term-actions">
          ${last ? `<a class="btn primary" href="#/s/${last.id}">&gt; resume: ${esc(last.name)}</a>` : ''}
          ${nxt ? `<a class="btn ${last ? '' : 'primary'}" href="#/s/${nxt.id}">&gt; next up: ${esc(nxt.name)}</a>` : '<span class="btn ok">all topics done</span>'}
          <a class="btn" href="#/mock">&gt; run mock exam</a>
          <a class="btn" href="#/map">&gt; global mind map</a>
          <a class="btn" href="#/cheat">&gt; cheat sheet</a>
        </div>
      </section>

      <section class="dash">
        <div class="panel ring-panel">
          <div class="panel-t">overall readiness</div>
          <div class="ring-row">${ring(o.pct, 'complete')}
            <div class="kv">
              <div><span>topics done</span><b>${o.done} / ${o.total}</b></div>
              <div><span>in progress</span><b>${o.wip}</b></div>
              <div><span>sections reviewed</span><b>${o.secDone} / ${o.secTotal}</b></div>
              <div><span>questions</span><b>${q.attempted} / ${allQuestions.length}</b></div>
              <div><span>accuracy</span><b class="${q.attempted ? level(q.acc) : ''}">${q.attempted ? pctTxt(q.acc) : '--'}</b></div>
              <div><span>cards known</span><b>${known} / ${allCards.length}</b></div>
              <div><span>mocks taken</span><b>${d.mocks.length}${best != null ? ` (best ${pctTxt(best)})` : ''}</b></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-t">activity <span class="muted">last 20 weeks &middot; streak ${streak()} day(s)</span></div>
          ${heatmap(20)}
          <div class="panel-t mt">mock history</div>
          ${d.mocks.length ? `<div class="spark">${d.mocks.slice(-24).map(m => `<i class="${m.pct >= 0.72 ? 'ok' : 'bad'}" style="height:${Math.max(6, Math.round(m.pct * 100))}%" title="${new Date(m.t).toLocaleString()} - ${pctTxt(m.pct)} (${m.n}Q)"></i>`).join('')}<span class="spark-line" title="72% pass line"></span></div>`
            : '<div class="muted small">No mocks yet. <a href="#/mock">Run one</a>.</div>'}
        </div>
        <div class="panel">
          <div class="panel-t">progress by category</div>
          <div class="cat-bars">${activeCats.map(c => {
            const oc = overall(ordered.filter(s => s.cat === c.id));
            return `<div class="cat-bar" style="--c:${c.color}"><span class="nm">${esc(c.name)}</span>${bar(oc.pct)}<b>${pctTxt(oc.pct)}</b><span class="muted small">${oc.done}/${oc.total}</span></div>`;
          }).join('')}</div>
          <div class="panel-t mt">exam domains</div>
          <div class="domains">${Object.keys(A.domains).map(k => `<div class="domain d${k}" style="flex:${A.domainWeights[k]}" title="${esc(A.domains[k])}"><b>${A.domainWeights[k]}%</b><span>${DOMAIN_SHORT[k]}</span></div>`).join('')}</div>
        </div>
      </section>

      ${activeCats.map(c => {
        const list = ordered.filter(s => s.cat === c.id);
        const oc = overall(list);
        return `<section class="cat-block">
          <h2 class="sec-h" style="--c:${c.color}"><span class="dot"></span>${esc(c.name)}<span class="muted small">${esc(c.blurb)}</span><span class="cat-count">${oc.done}/${oc.total} done &middot; ${pctTxt(oc.pct)}</span></h2>
          <div class="svc-grid">
            ${list.map(s => {
              const p = prog(s);
              return `<a class="svc-card st-${p.status}" href="#/s/${s.id}" style="--c:${c.color}">
                <div class="svc-card-top">${glyph(p.status)}<b>${esc(s.name)}</b>${stars(s.imp)}</div>
                <p>${esc(s.tag)}</p>
                <div class="svc-card-meta"><span>sec ${p.secDone}/${p.secTotal}</span><span>map ${p.map ? 'ok' : '--'}</span><span>quiz ${p.best != null ? pctTxt(p.best) : '--'}</span><span>cards ${p.known}/${p.cardsTotal}</span></div>
                <div class="svc-card-foot">${bar(p.pct)}<b>${pctTxt(p.pct)}</b></div>
              </a>`;
            }).join('')}
          </div>
        </section>`;
      }).join('')}`;
  }

  /* ---------- Service page ---------- */
  function checklistHtml(s) {
    const p = prog(s);
    return `
      <span class="ck ${p.secDone === p.secTotal ? 'ok' : ''}" title="Tick sections in Documentation">${p.secDone === p.secTotal ? '[x]' : '[ ]'} sections ${p.secDone}/${p.secTotal}</span>
      <span class="ck ${p.map ? 'ok' : ''}" title="Open the mind map tab">${p.map ? '[x]' : '[ ]'} mind map</span>
      <span class="ck ${p.best >= 0.8 ? 'ok' : ''}" title="Score 80% or more in the quiz">${p.best >= 0.8 ? '[x]' : '[ ]'} quiz ${p.best != null ? pctTxt(p.best) : '--'} / 80%</span>
      <span class="ck ${p.known === p.cardsTotal ? 'ok' : ''}" title="Mark flashcards as known">${p.known === p.cardsTotal ? '[x]' : '[ ]'} cards ${p.known}/${p.cardsTotal}</span>
      <span class="ck-bar">${bar(p.pct, 'thick')}<b>${pctTxt(p.pct)}</b></span>
      <button class="btn ${p.done ? 'ok' : 'primary'}" data-act="toggle-done">${p.done ? '[x] topic done (undo)' : 'mark topic as done'}</button>`;
  }

  function viewService(main, s, tab) {
    currentSvc = s;
    const d = Store.get();
    d.last = s.id;
    if (tab === 'map' && !d.map[s.id]) { d.map[s.id] = 1; Store.touch(); }
    Store.save();

    const c = catById[s.cat];
    const i = ordered.indexOf(s);
    const prev = ordered[i - 1], next = ordered[i + 1];
    const tabs = [['docs', 'docs'], ['map', 'mind-map'], ['quiz', `quiz[${s.q.length}]`], ['cards', `flashcards[${cardsBySvc[s.id].length}]`]];
    main.innerHTML = `
      <div class="svc-head" style="--c:${c.color}">
        <div class="crumbs"><a href="#/">~</a>/${esc(c.id)}/<span>${esc(s.id)}</span></div>
        <div class="svc-title"><h1>${esc(s.name)}</h1>${stars(s.imp)}</div>
        <p class="lead">${esc(s.tag)}</p>
        <div class="checklist" id="checklist">${checklistHtml(s)}</div>
        <div class="tabs">${tabs.map(([k, l]) => `<a class="tab ${k === tab ? 'active' : ''}" href="#/s/${s.id}/${k}">./${l}</a>`).join('')}</div>
      </div>
      <div id="tab-body"></div>
      <div class="pager">
        ${prev ? `<a class="btn" href="#/s/${prev.id}/${tab}">&lt;- ${esc(prev.name)}</a>` : '<span></span>'}
        ${next ? `<a class="btn" href="#/s/${next.id}/${tab}">${esc(next.name)} -&gt;</a>` : '<span></span>'}
      </div>`;

    $('#checklist').addEventListener('click', e => {
      if (!e.target.closest('[data-act="toggle-done"]')) return;
      if (d.done[s.id]) delete d.done[s.id];
      else { d.done[s.id] = Date.now(); Store.touch(); }
      Store.save();
      refresh();
    });

    const body = $('#tab-body');
    if (tab === 'map') {
      body.innerHTML = '<div class="mm-host svc"></div>';
      const mm = new window.MindMap($('.mm-host', body), serviceTree(s), { initialDepth: 2 });
      ctx.onLeave(() => mm.destroy());
    } else if (tab === 'quiz') {
      quizIntro(body, s.q.map((q, k) => qById[s.id + '#' + k]), s.name + ' quiz', s.id);
    } else if (tab === 'cards') {
      viewCards(body, s);
    } else {
      renderDocs(body, s);
    }
    refresh();
  }

  function renderDocs(body, s) {
    const d = Store.get();
    const done = new Set(d.sec[s.id] || []);
    body.innerHTML = `
      <div class="toc">
        ${s.s.map((sec, k) => `<a href="javascript:void 0" data-jump="sec-${k}" class="${done.has(k) ? 'on' : ''}"><span class="n">${pad2(k + 1)}</span>${esc(sec.h)}</a>`).join('')}
        <a href="javascript:void 0" data-jump="sec-tips"><span class="n">!!</span>exam tips</a>
        <span class="toc-grow"></span>
        <button class="btn small" data-act="all-sec">mark all reviewed</button>
        <button class="btn small" onclick="window.print()">print / pdf</button>
      </div>
      <div class="docs">
        ${s.s.map((sec, k) => `
          <section class="doc-sec ${done.has(k) ? 'reviewed' : ''}" id="sec-${k}">
            <div class="doc-sec-h">
              <h2><span class="n">${pad2(k + 1)}</span>${esc(sec.h)}</h2>
              <button class="sec-check ${done.has(k) ? 'on' : ''}" data-sec="${k}">${done.has(k) ? '[x] reviewed' : '[ ] mark reviewed'}</button>
            </div>
            <dl>${sec.i.map((it, j) => `
              <div class="doc-item" id="${s.id}-${k}-${j}">
                <dt>${esc(it[0])}</dt><dd>${esc(it[1])}
                ${it[2] ? `<dl class="sub">${it[2].map(cc => `<div class="doc-item"><dt>${esc(cc[0])}</dt><dd>${esc(cc[1])}</dd></div>`).join('')}</dl>` : ''}
                </dd></div>`).join('')}
            </dl>
          </section>`).join('')}
        <section class="doc-sec tips" id="sec-tips">
          <div class="doc-sec-h"><h2><span class="n">!!</span>exam tips</h2></div>
          <ul>${s.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        </section>
      </div>`;

    const setSec = (k, on) => {
      const list = new Set(d.sec[s.id] || []);
      if (on) list.add(k); else list.delete(k);
      d.sec[s.id] = [...list].sort((a, b) => a - b);
    };
    body.onclick = e => {
      const jump = e.target.closest('[data-jump]');
      if (jump) { const el = document.getElementById(jump.dataset.jump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const chk = e.target.closest('[data-sec]');
      const all = e.target.closest('[data-act="all-sec"]');
      if (!chk && !all) return;
      if (chk) setSec(+chk.dataset.sec, !(d.sec[s.id] || []).includes(+chk.dataset.sec));
      else s.s.forEach((_, k) => setSec(k, true));
      Store.touch();
      Store.save();
      const keep = window.scrollY;
      renderDocs(body, s);
      window.scrollTo(0, keep);
      refresh();
    };

    if (pendingAnchor) {
      const el = document.getElementById(pendingAnchor);
      pendingAnchor = null;
      if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); }
    }
  }

  function quizIntro(host, questions, title, scope) {
    const d = Store.get();
    const done = questions.filter(q => d.q[q.id]).length;
    const best = scope && d.best[scope];
    host.innerHTML = `
      <div class="panel quiz-intro">
        <div class="panel-t">${esc(title)}</div>
        <pre class="term-mini">$ quiz --topic ${esc(scope || 'mixed')}
  questions : ${questions.length}
  attempted : ${done}
  best      : ${best != null ? pctTxt(best) : '--'}   (80% marks the quiz checkbox)</pre>
        <div class="row-actions">
          <button class="btn primary" data-mode="practice">&gt; practice mode (instant feedback)</button>
          <button class="btn" data-mode="exam">&gt; exam mode (timed, score at end)</button>
        </div>
      </div>`;
    host.querySelectorAll('[data-mode]').forEach(b => b.onclick = () =>
      window.Quiz.start(host, questions, ctx, { title, scope, mode: b.dataset.mode, minutes: b.dataset.mode === 'exam' ? Math.ceil(questions.length * 2) : 0 }));
  }

  /* ---------- Global mind map ---------- */
  function viewGlobalMap(main) {
    const tree = {
      label: 'AWS SAA-C03',
      detail: 'Click a category to see its services, click a service to see its sections. [x] done, [~] in progress, [ ] not started.',
      children: activeCats.map(c => {
        const oc = overall(ordered.filter(s => s.cat === c.id));
        return {
          label: `${c.name}  ${oc.done}/${oc.total}`,
          color: c.color,
          detail: c.blurb,
          children: ordered.filter(s => s.cat === c.id).map(s => {
            const t = serviceTree(s, true);
            t.link = '#/s/' + s.id + '/map';
            delete t.color;
            return t;
          })
        };
      })
    };
    main.innerHTML = `
      <div class="page-head"><h1>global mind map</h1>
      <p class="lead">Every service and concept in one tree, with your status on each topic. Toggle "Show details" for a full-text map.</p></div>
      <div class="mm-host tall"></div>`;
    const mm = new window.MindMap($('.mm-host', main), tree, { initialDepth: 2 });
    ctx.onLeave(() => mm.destroy());
  }

  /* ---------- Progress page ---------- */
  function viewProgress(main, filter) {
    filter = filter || 'all';
    const o = overall(), q = qStats(), d = Store.get();
    const rows = ordered.map(s => ({ s, p: prog(s) })).filter(r => filter === 'all' || r.p.status === filter);
    main.innerHTML = `
      <div class="page-head"><h1>progress tracker</h1>
      <p class="lead">Each topic is scored from four signals: sections reviewed (40%), mind map opened (10%), best quiz score with 80% counting as full (30%), and flashcards known (20%). Marking a topic as done sets it to 100%.</p></div>
      <section class="dash">
        <div class="panel ring-panel"><div class="panel-t">overall</div><div class="ring-row">${ring(o.pct, 'complete')}
          <div class="kv">
            <div><span>done</span><b>${o.done} / ${o.total}</b></div>
            <div><span>in progress</span><b>${o.wip}</b></div>
            <div><span>not started</span><b>${o.total - o.done - o.wip}</b></div>
            <div><span>sections</span><b>${o.secDone} / ${o.secTotal}</b></div>
            <div><span>accuracy</span><b>${q.attempted ? pctTxt(q.acc) : '--'}</b></div>
          </div></div></div>
        <div class="panel"><div class="panel-t">activity</div>${heatmap(20)}</div>
        <div class="panel"><div class="panel-t">backup</div>
          <p class="muted small">Progress lives in this browser's local storage. Export it to move between browsers or machines.</p>
          <div class="row-actions">
            <button class="btn" data-act="export">export json</button>
            <label class="btn">import json<input type="file" accept="application/json" data-act="import" hidden></label>
            <button class="btn danger" data-act="reset">reset all</button>
          </div>
        </div>
      </section>
      <div class="filters">
        ${[['all', 'all'], ['todo', '[ ] not started'], ['wip', '[~] in progress'], ['done', '[x] done']].map(([k, l]) =>
          `<button class="btn small ${filter === k ? 'primary' : ''}" data-filter="${k}">${l}</button>`).join('')}
        <span class="muted small">${rows.length} topic(s)</span>
      </div>
      <div class="panel flush"><div class="tbl-wrap"><table class="tbl prog-tbl">
        <thead><tr><th></th><th>topic</th><th>category</th><th>imp</th><th>sections</th><th>map</th><th>quiz best</th><th>cards</th><th>progress</th><th></th></tr></thead>
        <tbody>${rows.map(({ s, p }) => `<tr class="st-${p.status}">
          <td class="c-st">${glyph(p.status)}</td>
          <td class="c-topic"><a href="#/s/${s.id}">${esc(s.name)}</a></td>
          <td class="c-cat"><span class="dot" style="background:${catById[s.cat].color}"></span>${esc(catById[s.cat].name)}</td>
          <td class="c-imp">${stars(s.imp)}</td>
          <td class="c-sec" data-l="sections"><div class="cell-bar">${bar(p.secDone / p.secTotal)}<span>${p.secDone}/${p.secTotal}</span></div></td>
          <td class="c-map" data-l="map">${p.map ? '<span class="okc">ok</span>' : '<span class="muted">--</span>'}</td>
          <td class="c-quiz" data-l="quiz">${p.best != null ? `<span class="pill ${level(p.best)}">${pctTxt(p.best)}</span>` : '<span class="muted">--</span>'}</td>
          <td class="c-cards" data-l="cards"><div class="cell-bar">${bar(p.known / p.cardsTotal)}<span>${p.known}/${p.cardsTotal}</span></div></td>
          <td class="c-prog"><div class="cell-bar wide">${bar(p.pct, 'thick')}<b>${pctTxt(p.pct)}</b></div></td>
          <td class="c-act"><button class="btn small ${p.done ? 'ok' : ''}" data-done="${s.id}">${p.done ? '[x] done' : 'mark done'}</button></td>
        </tr>`).join('')}</tbody></table></div></div>`;

    main.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => viewProgress(main, b.dataset.filter));
    main.querySelectorAll('[data-done]').forEach(b => b.onclick = () => {
      const id = b.dataset.done;
      if (d.done[id]) delete d.done[id]; else { d.done[id] = Date.now(); Store.touch(); }
      Store.save();
      refresh();
      viewProgress(main, filter);
    });
    $('[data-act="export"]', main).onclick = () => {
      const blob = new Blob([JSON.stringify(Store.get(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `saa-progress-${dayKey(new Date())}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('[data-act="import"]', main).onchange = e => {
      const f = e.target.files[0];
      e.target.value = '';
      if (!f) return;
      f.text().then(t => {
        try {
          const data = JSON.parse(t);
          if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('not a progress backup file');
          Store.data = null;
          localStorage.setItem(Store.key, JSON.stringify(data));
          refresh();
          viewProgress(main, filter);
        } catch (err) { alert('Could not import: ' + err.message); }
      });
    };
    $('[data-act="reset"]', main).onclick = () => {
      if (!confirm('Delete ALL progress: sections, done topics, answers, scores, mocks, flashcards and activity?')) return;
      try { localStorage.removeItem(Store.key); } catch (e) { /* storage disabled */ }
      Store.data = null;
      refresh();
      viewProgress(main, filter);
    };
  }

  /* ---------- Mock exams ---------- */
  function pickWeighted(n) {
    const byDomain = { 1: [], 2: [], 3: [], 4: [] };
    window.Quiz.shuffle(allQuestions).forEach(q => (byDomain[q.d] || byDomain[3]).push(q));
    const picked = [];
    [1, 2, 3, 4].forEach(d => picked.push(...byDomain[d].splice(0, Math.floor((n * A.domainWeights[d]) / 100))));
    const rest = window.Quiz.shuffle([].concat(byDomain[1], byDomain[2], byDomain[3], byDomain[4]));
    while (picked.length < n && rest.length) picked.push(rest.pop());
    return picked.slice(0, n);
  }

  function viewMock(main) {
    const d = Store.get();
    main.innerHTML = `
      <div class="page-head"><h1>mock exams</h1>
      <p class="lead">Drawn from all ${allQuestions.length} questions (service questions + cross-service scenarios), weighted by the official domain percentages.</p></div>
      <div class="mock-grid">
        <div class="panel mock-card"><div class="panel-t">full simulation</div><pre class="term-mini">65 questions
130 minutes
navigator + flags
scaled score</pre><button class="btn primary" data-mock="full">&gt; start full mock</button></div>
        <div class="panel mock-card"><div class="panel-t">half mock</div><pre class="term-mini">32 questions
65 minutes
exam mode</pre><button class="btn primary" data-mock="half">&gt; start half mock</button></div>
        <div class="panel mock-card"><div class="panel-t">quick 20</div><pre class="term-mini">20 questions
untimed
explanations after each</pre><button class="btn primary" data-mock="quick">&gt; start quick practice</button></div>
        <div class="panel mock-card"><div class="panel-t">scenario drill</div><pre class="term-mini">${A.scenarios.length} architecture scenarios
cross-service
practice mode</pre><button class="btn primary" data-mock="scenario">&gt; start scenarios</button></div>
      </div>
      <div class="panel">
        <div class="panel-t">focus by domain</div>
        <div class="row-actions">${Object.keys(A.domains).map(k => `<button class="btn" data-domain="${k}">${esc(A.domains[k])} [${allQuestions.filter(q => q.d === +k).length}]</button>`).join('')}</div>
        <div class="panel-t mt">focus by category</div>
        <div class="row-actions">${activeCats.map(c => `<button class="btn" data-cat="${c.id}"><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</button>`).join('')}</div>
        <label class="inline"><input type="checkbox" id="focusExam"> use exam mode for focus sets</label>
      </div>
      ${d.mocks.length ? `<div class="panel flush"><div class="panel-t pad">history</div><table class="tbl"><thead><tr><th>date</th><th>exam</th><th>questions</th><th>score</th></tr></thead><tbody>
        ${d.mocks.slice().reverse().map(m => `<tr><td>${new Date(m.t).toLocaleString()}</td><td>${esc(m.title)}</td><td>${m.n}</td><td><span class="pill ${m.pct >= 0.72 ? 'ok' : 'bad'}">${pctTxt(m.pct)}</span></td></tr>`).join('')}
        </tbody></table></div>` : ''}`;

    const run = (qs, title, mode, minutes, scope) => {
      main.innerHTML = '<div id="mock-run"></div>';
      window.Quiz.start($('#mock-run'), qs, ctx, { title, mode, minutes, scope });
    };
    main.querySelectorAll('[data-mock]').forEach(b => b.onclick = () => {
      const k = b.dataset.mock;
      if (k === 'full') run(pickWeighted(65), 'Full mock exam', 'exam', 130, 'mock');
      if (k === 'half') run(pickWeighted(32), 'Half mock exam', 'exam', 65, 'mock');
      if (k === 'quick') run(pickWeighted(20), 'Quick 20', 'practice', 0, 'quick');
      if (k === 'scenario') run(allQuestions.filter(q => q.svc === 'scenario'), 'Scenario drill', 'practice', 0, 'scenario');
    });
    const focusMode = () => ($('#focusExam').checked ? 'exam' : 'practice');
    main.querySelectorAll('[data-domain]').forEach(b => b.onclick = () => {
      const qs = allQuestions.filter(q => q.d === +b.dataset.domain);
      run(qs, A.domains[b.dataset.domain], focusMode(), focusMode() === 'exam' ? qs.length * 2 : 0, 'domain');
    });
    main.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => {
      const ids = new Set(ordered.filter(s => s.cat === b.dataset.cat).map(s => s.id));
      const qs = allQuestions.filter(q => ids.has(q.svc));
      run(qs, catById[b.dataset.cat].name, focusMode(), focusMode() === 'exam' ? qs.length * 2 : 0, 'category');
    });
  }

  /* ---------- Review mistakes ---------- */
  function viewReview(main) {
    const d = Store.get();
    const wrong = allQuestions.filter(q => d.q[q.id] && d.q[q.id].last === 0);
    const perSvc = {};
    allQuestions.forEach(q => {
      const r = d.q[q.id];
      if (!r) return;
      const p = perSvc[q.svc] = perSvc[q.svc] || { c: 0, n: 0 };
      p.n++;
      if (r.last) p.c++;
    });
    const weak = Object.entries(perSvc).sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n).slice(0, 15);
    main.innerHTML = `
      <div class="page-head"><h1>review mistakes</h1>
      <p class="lead">Questions you got wrong the last time you answered them. Answer them correctly to clear them.</p></div>
      <div class="panel">
        <pre class="term-mini">$ grep -c FAILED answers.log
${wrong.length}</pre>
        <div class="row-actions"><button class="btn primary" id="startReview" ${wrong.length ? '' : 'disabled'}>&gt; practice my mistakes</button></div>
      </div>
      ${weak.length ? `<div class="panel flush"><div class="panel-t pad">weakest areas</div><table class="tbl"><thead><tr><th>service</th><th>last results</th><th>score</th><th></th></tr></thead><tbody>
        ${weak.map(([id, v]) => { const p = v.c / v.n; return `<tr><td>${esc(ctx.serviceName(id))}</td><td>${v.c}/${v.n}</td>
          <td><span class="pill ${level(p)}">${pctTxt(p)}</span></td>
          <td>${svcById[id] ? `<a href="#/s/${id}">re-read docs -&gt;</a>` : ''}</td></tr>`; }).join('')}
        </tbody></table></div>` : '<div class="panel muted">No answers recorded yet. Take a quiz or mock exam first.</div>'}`;
    const sb = $('#startReview');
    if (sb) sb.onclick = () => {
      main.innerHTML = '<div id="review-run"></div>';
      window.Quiz.start($('#review-run'), wrong, ctx, { title: 'Mistake review', mode: 'practice', scope: 'review' });
    };
  }

  /* ---------- Flashcards ---------- */
  function viewCards(host, s) {
    const all = s ? cardsBySvc[s.id] : allCards;
    const known = Store.get().known;
    let deck = [], cur = null, flipped = false, seen = 0;

    function reset(includeKnown) {
      deck = window.Quiz.shuffle(all.filter(c => includeKnown || !known[c.id]));
      if (!deck.length) deck = window.Quiz.shuffle(all);
      seen = 0;
      nextCard();
    }
    function nextCard() { cur = deck.shift() || null; flipped = false; draw(); }

    function draw() {
      const kc = all.filter(c => known[c.id]).length;
      const head = s ? '' : `<div class="page-head"><h1>flashcards</h1><p class="lead">All concepts plus keyword-to-service cards. Cards you mark as known are skipped next round and count toward topic progress.</p></div>`;
      host.innerHTML = `${head}
        <div class="fc-wrap">
          <div class="fc-bar"><span>known <b>${kc}/${all.length}</b></span>${bar(kc / all.length)}<span>left this round <b>${deck.length + (cur ? 1 : 0)}</b></span>
            <span class="row-actions"><button class="btn small" data-act="restart">restart (unknown)</button>
            <button class="btn small" data-act="all">restart (all)</button></span></div>
          ${cur ? `
          <div class="fc ${flipped ? 'flipped' : ''}" data-act="flip">
            <div class="fc-inner">
              <div class="fc-face fc-front"><div class="fc-ctx">${esc(cur.ctx)}</div><div class="fc-title">${esc(cur.front)}</div><div class="muted small">click or [space] to flip</div></div>
              <div class="fc-face fc-back"><div class="fc-ctx">${esc(cur.front)}</div><div class="fc-text">${esc(cur.back)}</div></div>
            </div>
          </div>
          <div class="fc-actions">
            <button class="btn" data-act="again">[1] again</button>
            <button class="btn primary" data-act="know">[2] i know this</button>
          </div>` : `<div class="panel"><div class="panel-t">round complete</div><p>You went through ${seen} cards.</p></div>`}
        </div>`;
    }

    function onClick(e) {
      const el = e.target.closest('[data-act]');
      const act = el && el.dataset.act;
      if (act === 'flip') { flipped = !flipped; host.querySelector('.fc').classList.toggle('flipped', flipped); }
      if (act === 'again' && cur) { deck.splice(Math.min(deck.length, 3 + Math.floor(Math.random() * 4)), 0, cur); seen++; nextCard(); }
      if (act === 'know' && cur) { known[cur.id] = 1; Store.touch(); Store.save(); seen++; nextCard(); refresh(); }
      if (act === 'restart') reset(false);
      if (act === 'all') reset(true);
    }
    function onKey(e) {
      if (!document.body.contains(host) || e.target.tagName === 'INPUT') return;
      if (e.key === ' ' && cur) { e.preventDefault(); flipped = !flipped; host.querySelector('.fc').classList.toggle('flipped', flipped); }
      if (e.key === '1' && cur) onClick({ target: host.querySelector('[data-act="again"]') });
      if (e.key === '2' && cur) onClick({ target: host.querySelector('[data-act="know"]') });
    }
    host.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    ctx.onLeave(() => { host.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); });
    reset(false);
  }

  /* ---------- Cheat sheet ---------- */
  function viewCheat(main) {
    const C = A.cheats;
    main.innerHTML = `
      <div class="page-head"><h1>cheat sheet</h1>
      <p class="lead">Everything worth re-reading in the last hour before the exam.</p></div>
      <div class="toc">
        <a href="javascript:void 0" data-jump="ch-strategy"><span class="n">01</span>exam strategy</a>
        <a href="javascript:void 0" data-jump="ch-keywords"><span class="n">02</span>keyword -&gt; service</a>
        <a href="javascript:void 0" data-jump="ch-compare"><span class="n">03</span>comparisons</a>
        <a href="javascript:void 0" data-jump="ch-numbers"><span class="n">04</span>numbers</a>
        <a href="javascript:void 0" data-jump="ch-tips"><span class="n">05</span>all exam tips</a>
        <span class="toc-grow"></span>
        <button class="btn small" onclick="window.print()">print / pdf</button>
      </div>
      <div class="cheat-top">
        <section class="panel" id="ch-strategy"><div class="panel-t">exam strategy</div><ol class="strategy">${C.strategy.map(t => `<li>${esc(t)}</li>`).join('')}</ol></section>
        <section class="panel" id="ch-keywords"><div class="panel-t">if the question says... pick</div>
          <input class="filter" id="kwFilter" placeholder="filter keywords or services...">
          <div class="tbl-wrap scroll"><table class="tbl kw"><tbody>${C.keywords.map(k => `<tr><td>${esc(k[0])}</td><td><b>${esc(k[1])}</b></td></tr>`).join('')}</tbody></table></div></section>
        <section class="panel" id="ch-numbers"><div class="panel-t">numbers to remember</div>
          <input class="filter" id="numFilter" placeholder="filter numbers...">
          <div class="tbl-wrap scroll"><table class="tbl num"><tbody>${C.numbers.map(n => `<tr><td>${esc(n[0])}</td><td><b>${esc(n[1])}</b></td></tr>`).join('')}</tbody></table></div></section>
      </div>
      <section class="compare-grid" id="ch-compare">${C.compare.map(t => `
        <div class="panel flush"><div class="panel-t pad">${esc(t.title)}</div><div class="tbl-wrap"><table class="tbl">
          <thead><tr>${t.cols.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>${t.rows.map(r => `<tr>${r.map((v, i) => i ? `<td>${esc(v)}</td>` : `<td><b>${esc(v)}</b></td>`).join('')}</tr>`).join('')}</tbody>
        </table></div></div>`).join('')}</section>
      <section class="panel" id="ch-tips"><div class="panel-t">all exam tips by service</div>
        <div class="tips-cols">${ordered.map(s => `<div class="tips-blk"><h3><a href="#/s/${s.id}">${esc(s.name)}</a></h3><ul>${s.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div></section>`;
    main.querySelectorAll('[data-jump]').forEach(a => a.onclick = () => document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth' }));
    const filt = (inp, sel) => { inp.oninput = () => { const v = inp.value.toLowerCase(); main.querySelectorAll(sel + ' tr').forEach(tr => { tr.style.display = tr.textContent.toLowerCase().includes(v) ? '' : 'none'; }); }; };
    filt($('#kwFilter'), '.kw');
    filt($('#numFilter'), '.num');
  }

  /* ---------- Search ---------- */
  const searchIndex = [];
  ordered.forEach(s => {
    searchIndex.push({ t: s.name, sub: s.tag, href: '#/s/' + s.id, text: (s.name + ' ' + s.tag).toLowerCase() });
    s.s.forEach((sec, k) => sec.i.forEach((it, j) => searchIndex.push({
      t: it[0], sub: s.name + ' / ' + sec.h, href: '#/s/' + s.id + '/docs', anchor: `${s.id}-${k}-${j}`, text: (it[0] + ' ' + it[1] + ' ' + s.name).toLowerCase()
    })));
  });

  function initSearch() {
    const inp = $('#search'), box = $('#search-results');
    let results = [];
    const close = () => box.classList.add('hidden');
    inp.addEventListener('input', () => {
      const v = inp.value.trim().toLowerCase();
      if (v.length < 2) { close(); return; }
      const words = v.split(/\s+/);
      results = searchIndex.filter(r => words.every(w => r.text.includes(w)))
        .sort((a, b) => (b.t.toLowerCase().includes(v) ? 1 : 0) - (a.t.toLowerCase().includes(v) ? 1 : 0)).slice(0, 14);
      box.innerHTML = results.length
        ? results.map((r, i) => `<a href="${r.href}" data-i="${i}"><b>${esc(r.t)}</b><span>${esc(r.sub)}</span></a>`).join('')
        : '<div class="muted pad">no matches</div>';
      box.classList.remove('hidden');
    });
    box.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a) return;
      const r = results[+a.dataset.i];
      pendingAnchor = r.anchor || null;
      inp.value = '';
      close();
      if (location.hash === r.href) { e.preventDefault(); route(); }
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Escape') { inp.value = ''; close(); inp.blur(); }
      if (e.key === 'Enter' && results[0] && box.querySelector('a')) box.querySelector('a').click();
    });
    document.addEventListener('click', e => { if (!e.target.closest('.search')) close(); });
  }

  /* ---------- Theme, sidebar, boot ---------- */
  const pref = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage disabled */ } }
  };

  function initChrome() {
    if (pref.get('saa-theme') === 'light') document.documentElement.classList.add('light');
    if (pref.get('saa-side') === 'collapsed') document.body.classList.add('side-collapsed');
    $('#theme').onclick = () => {
      document.documentElement.classList.toggle('light');
      pref.set('saa-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    };
    const toggleSide = () => {
      if (matchMedia('(max-width: 860px)').matches) { document.body.classList.toggle('nav-open'); return; }
      document.body.classList.toggle('side-collapsed');
      pref.set('saa-side', document.body.classList.contains('side-collapsed') ? 'collapsed' : 'open');
      window.dispatchEvent(new Event('resize'));
    };
    $('#menu').onclick = toggleSide;
    document.addEventListener('click', e => {
      if (document.body.classList.contains('nav-open') && !e.target.closest('#sidebar') && !e.target.closest('#menu')) {
        document.body.classList.remove('nav-open');
      }
    });
    document.addEventListener('keydown', e => {
      if (document.activeElement.tagName === 'INPUT') return;
      if (e.key === '/') { e.preventDefault(); $('#search').focus(); }
      if (e.key === '[') toggleSide();
    });
  }

  initChrome();
  renderSidebar();
  initSearch();
  window.addEventListener('hashchange', route);
  route();
})();
