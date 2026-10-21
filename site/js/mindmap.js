/* Lightweight horizontal mind map: collapsible nodes, pan, zoom, detail panel. No dependencies.
 * Node shape: { label, detail?, link?, color?, children?: [] }
 */
(function () {
  const PALETTE = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#14b8a6', '#eab308', '#ec4899', '#6366f1', '#84cc16', '#06b6d4', '#f43f5e'];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  class MindMap {
    constructor(host, root, opts) {
      this.host = host;
      this.root = root;
      this.opts = Object.assign({ initialDepth: 2, gapX: 46, gapY: 8 }, opts || {});
      this.scale = 1; this.tx = 30; this.ty = 30;
      this.showDetails = false;

      host.innerHTML = `
        <div class="mm-wrap">
          <div class="mm-toolbar">
            <button data-act="expand" title="Expand every branch">Expand all</button>
            <button data-act="collapse" title="Show only main branches">Collapse</button>
            <button data-act="details" title="Show explanations inside nodes">Show details</button>
            <span class="mm-sep"></span>
            <button data-act="zoomout" title="Zoom out">&minus;</button>
            <button data-act="zoomin" title="Zoom in">+</button>
            <button data-act="fit" title="Fit to screen">Fit</button>
            <button data-act="full" title="Fullscreen">Fullscreen</button>
          </div>
          <div class="mm-viewport"><div class="mm-canvas"><svg class="mm-links" xmlns="http://www.w3.org/2000/svg"></svg></div></div>
          <aside class="mm-panel hidden"><button class="mm-close" title="Close">&times;</button><div class="mm-panel-body"></div></aside>
          <div class="mm-hint"><span class="mm-hint-mouse">Drag to pan &middot; scroll to zoom &middot; click a node to expand / read &middot; double-click to expand a whole branch</span><span class="mm-hint-touch">Drag to pan &middot; pinch to zoom &middot; tap to expand / read &middot; double-tap to expand a branch</span></div>
        </div>`;
      this.wrap = host.querySelector('.mm-wrap');
      this.viewport = host.querySelector('.mm-viewport');
      this.canvas = host.querySelector('.mm-canvas');
      this.svg = host.querySelector('.mm-links');
      this.panel = host.querySelector('.mm-panel');

      this.prepare(root, 0, null, 0);
      this.bind();
      this.render();
      this.fit();
    }

    prepare(n, depth, parent, idx) {
      n.depth = depth;
      n.parent = parent;
      n.color = n.color || (depth === 0 ? '#f59e0b' : depth === 1 ? PALETTE[idx % PALETTE.length] : parent.color);
      n.children = n.children || [];
      n.collapsed = n.children.length > 0 && depth >= this.opts.initialDepth;
      n.children.forEach((c, i) => this.prepare(c, depth + 1, n, i));
    }

    eachNode(n, fn) { fn(n); n.children.forEach(c => this.eachNode(c, fn)); }

    render(anchor) {
      const before = anchor && anchor.x != null ? { x: anchor.x, y: anchor.y } : null;
      this.canvas.querySelectorAll('.mm-node').forEach(e => e.remove());

      const visible = [];
      const walk = n => { visible.push(n); if (!n.collapsed) n.children.forEach(walk); };
      walk(this.root);

      const frag = document.createDocumentFragment();
      for (const n of visible) {
        const el = document.createElement('div');
        const kids = n.children.length;
        el.className = 'mm-node d' + Math.min(n.depth, 3) + (kids ? ' has-kids' : '') + (n.collapsed ? ' collapsed' : '') + (n.detail ? ' has-detail' : '');
        el.style.setProperty('--c', n.color);
        el.innerHTML =
          `<div class="mm-label">${esc(n.label)}</div>` +
          (this.showDetails && n.detail ? `<div class="mm-detail">${esc(n.detail)}</div>` : '') +
          (kids ? `<span class="mm-toggle">${n.collapsed ? kids : '&minus;'}</span>` : '');
        el._node = n;
        n.el = el;
        frag.appendChild(el);
      }
      this.canvas.appendChild(frag);
      for (const n of visible) { n.w = n.el.offsetWidth; n.h = n.el.offsetHeight; }

      const { gapX, gapY } = this.opts;
      const shift = (n, d) => { n.y += d; if (!n.collapsed) n.children.forEach(c => shift(c, d)); };
      const layout = (n, x, top) => {
        n.x = x;
        const kids = n.collapsed ? [] : n.children;
        if (!kids.length) { n.y = top; return top + n.h; }
        const gap = n.depth === 0 ? gapY * 3 : n.depth === 1 ? gapY * 1.5 : gapY;
        let y = top;
        const cx = x + n.w + gapX;
        kids.forEach(c => { y = layout(c, cx, y) + gap; });
        const kidsBottom = y - gap;
        const first = kids[0], last = kids[kids.length - 1];
        n.y = (first.y + first.h / 2 + last.y + last.h / 2) / 2 - n.h / 2;
        if (n.y < top) {
          const d = top - n.y;
          shift(n, d);
          return Math.max(kidsBottom + d, n.y + n.h);
        }
        return Math.max(kidsBottom, n.y + n.h);
      };
      layout(this.root, 0, 0);

      let maxX = 0, maxY = 0, paths = '';
      for (const n of visible) {
        n.el.style.transform = `translate(${n.x}px, ${n.y}px)`;
        maxX = Math.max(maxX, n.x + n.w);
        maxY = Math.max(maxY, n.y + n.h);
        if (n.parent) {
          const p = n.parent;
          const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = n.x, y2 = n.y + n.h / 2, mx = (x1 + x2) / 2;
          const sw = n.depth === 1 ? 3 : n.depth === 2 ? 2 : 1.4;
          paths += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" stroke="${n.color}" stroke-width="${sw}" fill="none" stroke-opacity="0.75"/>`;
        }
      }
      this.bounds = { w: maxX, h: maxY };
      this.canvas.style.width = maxX + 'px';
      this.canvas.style.height = maxY + 'px';
      this.svg.setAttribute('width', maxX);
      this.svg.setAttribute('height', maxY);
      this.svg.innerHTML = paths;

      if (before) {
        this.tx += (before.x - anchor.x) * this.scale;
        this.ty += (before.y - anchor.y) * this.scale;
      }
      this.apply();
    }

    apply() { this.canvas.style.transform = `translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`; }

    zoomAt(px, py, factor) {
      const s = Math.min(3, Math.max(0.12, this.scale * factor));
      this.tx = px - (px - this.tx) * (s / this.scale);
      this.ty = py - (py - this.ty) * (s / this.scale);
      this.scale = s;
      this.apply();
    }

    /* readable=true keeps text legible (min zoom) and centers on the root; false fits everything. */
    fit(readable) {
      const vw = this.viewport.clientWidth, vh = this.viewport.clientHeight;
      if (!vw || !vh || !this.bounds) return;
      let s = Math.max(0.12, Math.min(1.1, (vw - 60) / this.bounds.w, (vh - 70) / this.bounds.h));
      if (readable !== false) s = Math.max(s, Math.min(0.8, (vw - 60) / this.bounds.w), 0.6);
      this.scale = s;
      const w = this.bounds.w * s, h = this.bounds.h * s;
      this.tx = w <= vw ? (vw - w) / 2 : 20;
      const r = this.root;
      this.ty = h <= vh - 50 ? Math.max(50, (vh - h) / 2) : vh / 2 - (r.y + r.h / 2) * s;
      this.apply();
    }

    showPanel(n) {
      if (!n.detail && !n.link) { this.panel.classList.add('hidden'); return; }
      const path = [];
      for (let p = n.parent; p; p = p.parent) path.unshift(p.label);
      this.panel.querySelector('.mm-panel-body').innerHTML =
        `<div class="mm-path">${path.map(esc).join(' / ')}</div>` +
        `<h3 style="--c:${n.color}">${esc(n.label)}</h3>` +
        (n.detail ? `<p>${esc(n.detail)}</p>` : '') +
        (n.link ? `<a class="btn small" href="${n.link}">Open ${esc(n.label)}</a>` : '');
      this.panel.classList.remove('hidden');
    }

    bind() {
      this.host.querySelector('.mm-toolbar').addEventListener('click', e => {
        const act = e.target.closest('button') && e.target.closest('button').dataset.act;
        if (!act) return;
        if (act === 'expand') { this.eachNode(this.root, n => { n.collapsed = false; }); this.render(); this.fit(); }
        if (act === 'collapse') { this.eachNode(this.root, n => { n.collapsed = n.depth >= 1 && n.children.length > 0; }); this.render(); this.fit(); }
        if (act === 'details') {
          this.showDetails = !this.showDetails;
          this.wrap.classList.toggle('mm-show-details', this.showDetails);
          e.target.textContent = this.showDetails ? 'Hide details' : 'Show details';
          this.render(); this.fit();
        }
        if (act === 'zoomin') this.zoomAt(this.viewport.clientWidth / 2, this.viewport.clientHeight / 2, 1.2);
        if (act === 'zoomout') this.zoomAt(this.viewport.clientWidth / 2, this.viewport.clientHeight / 2, 1 / 1.2);
        if (act === 'fit') this.fit(false);
        if (act === 'full') {
          if (document.fullscreenElement) document.exitFullscreen();
          else if (this.wrap.requestFullscreen) this.wrap.requestFullscreen();
        }
      });
      const onFull = () => setTimeout(() => this.fit(), 60);
      document.addEventListener('fullscreenchange', onFull);
      this.panel.querySelector('.mm-close').addEventListener('click', () => this.panel.classList.add('hidden'));

      this.canvas.addEventListener('click', e => {
        const el = e.target.closest('.mm-node');
        if (!el || this.moved) return;
        const n = el._node;
        if (n.children.length) { n.collapsed = !n.collapsed; this.render(n); }
        this.showPanel(n);
      });
      this.canvas.addEventListener('dblclick', e => {
        const el = e.target.closest('.mm-node');
        if (!el) return;
        const n = el._node;
        this.eachNode(n, c => { c.collapsed = false; });
        this.render(n);
      });

      // One pointer pans; two pointers (touch) pinch-zoom around their midpoint.
      const pts = new Map();
      let drag = null, pinch = null;
      const rect = () => this.viewport.getBoundingClientRect();
      const pinchState = () => {
        const [a, b] = [...pts.values()];
        const r = rect();
        return { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2 - r.left, my: (a.y + b.y) / 2 - r.top };
      };
      this.viewport.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 1) {
          drag = { x: e.clientX, y: e.clientY, tx: this.tx, ty: this.ty };
          this.moved = false;
        } else if (pts.size === 2) {
          drag = null;
          pinch = pinchState();
          this.moved = true;
        }
      });
      const move = e => {
        if (!pts.has(e.pointerId)) return;
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch && pts.size >= 2) {
          const now = pinchState();
          this.tx += now.mx - pinch.mx;
          this.ty += now.my - pinch.my;
          this.zoomAt(now.mx, now.my, now.dist / pinch.dist);
          pinch = now;
          return;
        }
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!this.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
        if (!this.moved) { this.moved = true; this.viewport.classList.add('dragging'); }
        this.tx = drag.tx + dx; this.ty = drag.ty + dy;
        this.apply();
      };
      window.addEventListener('pointermove', move);
      const end = e => {
        if (!pts.has(e.pointerId)) return;
        pts.delete(e.pointerId);
        if (pts.size < 2) pinch = null;
        if (pts.size === 1) {
          const [p] = [...pts.values()];
          drag = { x: p.x, y: p.y, tx: this.tx, ty: this.ty };
          return;
        }
        if (pts.size === 0) {
          drag = null;
          this.viewport.classList.remove('dragging');
          setTimeout(() => { this.moved = false; }, 0);
        }
      };
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
      // Global listeners outlive the map's DOM; the router calls destroy() on navigation.
      this.destroy = () => {
        document.removeEventListener('fullscreenchange', onFull);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
        if (document.fullscreenElement === this.wrap) document.exitFullscreen();
      };
      this.viewport.addEventListener('wheel', e => {
        e.preventDefault();
        const r = this.viewport.getBoundingClientRect();
        this.zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
      }, { passive: false });
    }
  }

  window.MindMap = MindMap;
})();
