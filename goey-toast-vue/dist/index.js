import { reactive as yt, ref as L, defineComponent as G, watch as Q, nextTick as gt, openBlock as W, createElementBlock as R, Fragment as Ke, createElementVNode as A, toDisplayString as ve, onErrorCaptured as Ot, renderSlot as Vt, createCommentVNode as le, normalizeClass as P, onMounted as Je, onUnmounted as Ve, readonly as Se, h as jt, computed as h, unref as T, normalizeStyle as pe, createVNode as te, Transition as Re, withCtx as ke, createBlock as Oe, resolveDynamicComponent as zt, Teleport as Qt, renderList as Yt, watchEffect as qt } from "vue";
import { animate as ae } from "motion";
const _ = yt({
  position: "bottom-right",
  dir: "ltr",
  spring: !0,
  bounce: void 0,
  theme: "light",
  visibleToasts: 3,
  swipeToDismiss: !0,
  closeOnEscape: !0,
  maxQueue: 1 / 0,
  queueOverflow: "drop-oldest",
  showProgress: !1,
  closeButton: !1
}), ie = L(!1), Ge = L(null);
function Ee(s, t = "polite") {
  Ge.value = null, queueMicrotask(() => {
    Ge.value = { message: s, politeness: t };
  });
}
function $t(s) {
  return s === "error" || s === "warning" ? "assertive" : "polite";
}
function Be(s, t) {
  return !t || typeof t != "string" ? s : `${s}: ${t}`;
}
const H = L([]), J = [], Ie = /* @__PURE__ */ new Set(), he = /* @__PURE__ */ new Set();
function Ft(s) {
  Ie.add(s);
}
function Gt() {
  const s = H.value;
  return s.length > 0 ? s[s.length - 1].id : void 0;
}
function Zt() {
  const s = _.visibleToasts;
  for (; J.length > 0 && H.value.length < s; ) {
    const t = J.shift();
    H.value.push(t.toast);
  }
}
function bt(s) {
  const t = _.maxQueue, e = _.queueOverflow;
  if (J.length >= t) {
    if (e === "drop-newest") return !1;
    J.shift();
  }
  return J.push(s), !0;
}
function Ze(s) {
  const t = H.value.findIndex((o) => o.id === s);
  if (t === -1) return;
  const e = H.value[t];
  if (H.value.splice(t, 1), (Ie.has(s) || !he.has(s)) && e._onAutoClose)
    try {
      e._onAutoClose(s);
    } catch {
    }
  if (e._onDismiss)
    try {
      e._onDismiss(s);
    } catch {
    }
  Ie.delete(s), he.delete(s), Zt();
}
function Kt(s, t) {
  const e = H.value.find((r) => r.id === s);
  e && (t.title !== void 0 && (e.title = t.title), t.description !== void 0 && (e.description = t.description), t.type !== void 0 && (e.type = t.type, e.phase = t.type), t.action !== void 0 && (e.action = t.action), "icon" in t && (e.icon = t.icon ?? void 0), t.showTimestamp !== void 0 && (e.showTimestamp = t.showTimestamp), t.title !== void 0 && Ee(
    Be(t.title, t.description),
    t.type ? $t(t.type) : "polite"
  ));
}
function _e(s, t, e) {
  var l;
  const r = (e == null ? void 0 : e.id) ?? Math.random().toString(36).slice(2), o = {
    id: r,
    title: s,
    type: t,
    phase: t,
    description: e == null ? void 0 : e.description,
    action: e == null ? void 0 : e.action,
    icon: e == null ? void 0 : e.icon,
    duration: ((l = e == null ? void 0 : e.timing) == null ? void 0 : l.displayDuration) ?? (e == null ? void 0 : e.duration),
    classNames: e == null ? void 0 : e.classNames,
    fillColor: e == null ? void 0 : e.fillColor,
    borderColor: e == null ? void 0 : e.borderColor,
    borderWidth: e == null ? void 0 : e.borderWidth,
    timing: e == null ? void 0 : e.timing,
    preset: e == null ? void 0 : e.preset,
    spring: e == null ? void 0 : e.spring,
    bounce: e == null ? void 0 : e.bounce,
    showProgress: e == null ? void 0 : e.showProgress,
    showTimestamp: e == null ? void 0 : e.showTimestamp,
    _onDismiss: e == null ? void 0 : e.onDismiss,
    _onAutoClose: e == null ? void 0 : e.onAutoClose
  };
  return Ee(
    Be(s, e == null ? void 0 : e.description),
    $t(t)
  ), H.value.length < _.visibleToasts ? H.value.push(o) : bt({ id: r, type: t, toast: o }), r;
}
function Jt(s) {
  if (s != null && typeof s == "object") {
    const t = Array.isArray(s.type) ? s.type : [s.type], e = new Set(t);
    for (let o = J.length - 1; o >= 0; o--)
      e.has(J[o].type) && J.splice(o, 1);
    const r = H.value.filter((o) => e.has(o.type));
    for (const o of r)
      he.add(o.id), Ze(o.id);
  } else if (s != null) {
    const t = J.findIndex((e) => e.id === s);
    if (t !== -1) {
      J.splice(t, 1);
      return;
    }
    he.add(s), Ze(s);
  } else {
    for (const e of H.value)
      he.add(e.id);
    J.length = 0;
    const t = [...H.value];
    H.value = [];
    for (const e of t) {
      if ((Ie.has(e.id) || !he.has(e.id)) && e._onAutoClose)
        try {
          e._onAutoClose(e.id);
        } catch {
        }
      if (e._onDismiss)
        try {
          e._onDismiss(e.id);
        } catch {
        }
      Ie.delete(e.id), he.delete(e.id);
    }
  }
}
const es = Object.assign(
  (s, t) => _e(s, "default", t),
  {
    success: (s, t) => _e(s, "success", t),
    error: (s, t) => _e(s, "error", t),
    warning: (s, t) => _e(s, "warning", t),
    info: (s, t) => _e(s, "info", t),
    promise: (s, t) => {
      var o, l;
      const e = Math.random().toString(36).slice(2);
      Ee(Be(t.loading, (o = t.description) == null ? void 0 : o.loading), "polite");
      const r = {
        id: e,
        title: t.loading,
        type: "info",
        phase: "loading",
        description: (l = t.description) == null ? void 0 : l.loading,
        classNames: t.classNames,
        fillColor: t.fillColor,
        borderColor: t.borderColor,
        borderWidth: t.borderWidth,
        timing: t.timing,
        preset: t.preset,
        spring: t.spring,
        bounce: t.bounce,
        showTimestamp: t.showTimestamp,
        _onDismiss: t.onDismiss,
        _onAutoClose: t.onAutoClose
      };
      return H.value.length < _.visibleToasts ? H.value.push(r) : bt({ id: e, type: "info", toast: r }), s.then((a) => {
        var d, i, $;
        const f = H.value.find((x) => x.id === e);
        if (!f) return;
        const y = typeof ((d = t.description) == null ? void 0 : d.success) == "function" ? t.description.success(a) : (i = t.description) == null ? void 0 : i.success, u = typeof t.success == "function" ? t.success(a) : t.success;
        f.title = u, f.description = y, f.action = ($ = t.action) == null ? void 0 : $.success, f.phase = "success", f.type = "success", Ee(Be(u, y), "polite");
      }).catch((a) => {
        var d, i, $;
        const f = H.value.find((x) => x.id === e);
        if (!f) return;
        const y = typeof ((d = t.description) == null ? void 0 : d.error) == "function" ? t.description.error(a) : (i = t.description) == null ? void 0 : i.error, u = typeof t.error == "function" ? t.error(a) : t.error;
        f.title = u, f.description = y, f.action = ($ = t.action) == null ? void 0 : $.error, f.phase = "error", f.type = "error", Ee(Be(u, y), "assertive");
      }), e;
    },
    dismiss: Jt,
    update: Kt
  }
), xt = {
  smooth: { bounce: 0.1, spring: !0 },
  bouncy: { bounce: 0.6, spring: !0 },
  subtle: { bounce: 0.05, spring: !0 },
  snappy: { bounce: 0.4, spring: !0 }
}, ts = /* @__PURE__ */ G({
  __name: "AriaLiveAnnouncer",
  setup(s) {
    const t = L(""), e = L("");
    Q(Ge, (o) => {
      o && (o.politeness === "assertive" ? (e.value = "", gt(() => {
        e.value = o.message;
      })) : (t.value = "", gt(() => {
        t.value = o.message;
      })));
    }), Q(t, (o, l, a) => {
      if (!o) return;
      const f = setTimeout(() => {
        t.value = "";
      }, 7e3);
      a(() => clearTimeout(f));
    }), Q(e, (o, l, a) => {
      if (!o) return;
      const f = setTimeout(() => {
        e.value = "";
      }, 7e3);
      a(() => clearTimeout(f));
    });
    const r = {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0"
    };
    return (o, l) => (W(), R(Ke, null, [
      A("div", {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        style: r
      }, ve(t.value), 1),
      A("div", {
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: r
      }, ve(e.value), 1)
    ], 64));
  }
}), ss = /* @__PURE__ */ G({
  __name: "ToastErrorBoundary",
  setup(s) {
    const t = L(!1);
    return Ot((e) => (t.value = !0, !1)), (e, r) => t.value ? le("", !0) : Vt(e.$slots, "default", { key: 0 });
  }
}), os = ["width", "height"], ns = /* @__PURE__ */ G({
  __name: "DefaultIcon",
  props: {
    size: { default: 20 },
    class: {}
  },
  setup(s) {
    return (t, e) => (W(), R("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: s.size,
      height: s.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: P(t.$props.class)
    }, [...e[0] || (e[0] = [
      A("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }, null, -1),
      A("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }, null, -1)
    ])], 10, os));
  }
}), as = ["width", "height"], ls = /* @__PURE__ */ G({
  __name: "ErrorIcon",
  props: {
    size: { default: 20 },
    class: {}
  },
  setup(s) {
    return (t, e) => (W(), R("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: s.size,
      height: s.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: P(t.$props.class)
    }, [...e[0] || (e[0] = [
      A("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }, null, -1),
      A("path", { d: "M15 9l-6 6" }, null, -1),
      A("path", { d: "M9 9l6 6" }, null, -1)
    ])], 10, as));
  }
}), is = ["width", "height"], rs = /* @__PURE__ */ G({
  __name: "InfoIcon",
  props: {
    size: { default: 20 },
    class: {}
  },
  setup(s) {
    return (t, e) => (W(), R("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: s.size,
      height: s.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: P(t.$props.class)
    }, [...e[0] || (e[0] = [
      A("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }, null, -1),
      A("line", {
        x1: "12",
        y1: "16",
        x2: "12",
        y2: "12"
      }, null, -1),
      A("line", {
        x1: "12",
        y1: "8",
        x2: "12.01",
        y2: "8"
      }, null, -1)
    ])], 10, is));
  }
}), us = ["width", "height"], cs = /* @__PURE__ */ G({
  __name: "SpinnerIcon",
  props: {
    size: { default: 20 },
    class: {}
  },
  setup(s) {
    return (t, e) => (W(), R("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: s.size,
      height: s.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: P(t.$props.class)
    }, [...e[0] || (e[0] = [
      A("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }, null, -1)
    ])], 10, us));
  }
}), ds = ["width", "height"], fs = /* @__PURE__ */ G({
  __name: "SuccessIcon",
  props: {
    size: { default: 20 },
    class: {}
  },
  setup(s) {
    return (t, e) => (W(), R("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: s.size,
      height: s.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: P(t.$props.class)
    }, [...e[0] || (e[0] = [
      A("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }, null, -1),
      A("path", { d: "M9 12l2 2 4-4" }, null, -1)
    ])], 10, ds));
  }
}), vs = ["width", "height"], ps = /* @__PURE__ */ G({
  __name: "WarningIcon",
  props: {
    size: { default: 20 },
    class: {}
  },
  setup(s) {
    return (t, e) => (W(), R("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: s.size,
      height: s.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: P(t.$props.class)
    }, [...e[0] || (e[0] = [
      A("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }, null, -1),
      A("line", {
        x1: "12",
        y1: "8",
        x2: "12",
        y2: "12"
      }, null, -1),
      A("line", {
        x1: "12",
        y1: "16",
        x2: "12.01",
        y2: "16"
      }, null, -1)
    ])], 10, vs));
  }
}), N = 34;
function Tt(s) {
  let t = null, e = "";
  return (r, o, l, a) => (t && t[0] === r && t[1] === o && t[2] === l && t[3] === a || (e = s(r, o, l, a), t = [r, o, l, a]), e);
}
function hs(s, t, e, r) {
  const o = N / 2, l = Math.min(s, t), a = N + (e - N) * r;
  if (r <= 0 || a - N < 8)
    return [
      `M 0,${o}`,
      `A ${o},${o} 0 0 1 ${o},0`,
      `H ${l - o}`,
      `A ${o},${o} 0 0 1 ${l},${o}`,
      `A ${o},${o} 0 0 1 ${l - o},${N}`,
      `H ${o}`,
      `A ${o},${o} 0 0 1 0,${o}`,
      "Z"
    ].join(" ");
  const f = 14 * r, y = Math.min(16, (a - N) * 0.45), u = l + (t - l) * r, d = N - f, i = Math.min(l + f, u - y);
  return [
    `M 0,${o}`,
    `A ${o},${o} 0 0 1 ${o},0`,
    `H ${l - o}`,
    `A ${o},${o} 0 0 1 ${l},${o}`,
    `L ${l},${d}`,
    `Q ${l},${d + f} ${i},${d + f}`,
    `H ${u - y}`,
    `A ${y},${y} 0 0 1 ${u},${d + f + y}`,
    `L ${u},${a - y}`,
    `A ${y},${y} 0 0 1 ${u - y},${a}`,
    `H ${y}`,
    `A ${y},${y} 0 0 1 0,${a - y}`,
    "Z"
  ].join(" ");
}
function gs(s, t, e, r) {
  const o = N / 2, l = Math.min(s, t), a = (t - l) / 2;
  if (r <= 0 || N + (e - N) * r - N < 8)
    return [
      `M ${a},${o}`,
      `A ${o},${o} 0 0 1 ${a + o},0`,
      `H ${a + l - o}`,
      `A ${o},${o} 0 0 1 ${a + l},${o}`,
      `A ${o},${o} 0 0 1 ${a + l - o},${N}`,
      `H ${a + o}`,
      `A ${o},${o} 0 0 1 ${a},${o}`,
      "Z"
    ].join(" ");
  const f = N + (e - N) * r, y = 14 * r, u = Math.min(16, (f - N) * 0.45), d = N - y, i = t / 2, $ = l / 2 + (t - l) / 2 * r, x = i - $, M = i + $, q = Math.max(x + u, a - y), U = Math.min(M - u, a + l + y);
  return [
    `M ${a},${o}`,
    `A ${o},${o} 0 0 1 ${a + o},0`,
    `H ${a + l - o}`,
    `A ${o},${o} 0 0 1 ${a + l},${o}`,
    `L ${a + l},${d}`,
    `Q ${a + l},${d + y} ${U},${d + y}`,
    `H ${M - u}`,
    `A ${u},${u} 0 0 1 ${M},${d + y + u}`,
    `L ${M},${f - u}`,
    `A ${u},${u} 0 0 1 ${M - u},${f}`,
    `H ${x + u}`,
    `A ${u},${u} 0 0 1 ${x},${f - u}`,
    `L ${x},${d + y + u}`,
    `A ${u},${u} 0 0 1 ${x + u},${d + y}`,
    `H ${q}`,
    `Q ${a},${d + y} ${a},${d}`,
    "Z"
  ].join(" ");
}
const ms = Tt(hs), ws = Tt(gs), Ne = 0.6, fe = 0.9, Ae = [0.4, 0, 0.2, 1];
function Ue(s, t, e = 0.4) {
  const r = s / t, o = 200 + e * 437.5, l = 24 - e * 20, a = 0.7 * r;
  return { type: "spring", stiffness: o, damping: l, mass: a };
}
const mt = "(prefers-reduced-motion: reduce)";
function ys() {
  const s = L(
    typeof window < "u" && typeof window.matchMedia == "function" ? window.matchMedia(mt).matches : !1
  );
  let t = null;
  const e = (r) => {
    s.value = r.matches;
  };
  return Je(() => {
    typeof window > "u" || typeof window.matchMedia != "function" || (t = window.matchMedia(mt), t.addEventListener("change", e));
  }), Ve(() => {
    t == null || t.removeEventListener("change", e);
  }), Se(s);
}
const wt = 100;
function $s(s) {
  const t = L(0), e = L(1), r = L(!1);
  let o = null, l = !1;
  function a(u) {
    if (!_.swipeToDismiss) return;
    const d = u.touches[0];
    o = { x: d.clientX, y: d.clientY }, l = !1;
  }
  function f(u) {
    if (!o || !_.swipeToDismiss) return;
    const d = u.touches[0], i = d.clientX - o.x, $ = d.clientY - o.y;
    if (!l && Math.abs($) > Math.abs(i) && Math.abs($) > 10) {
      o = null;
      return;
    }
    !l && Math.abs(i) > 10 && (l = !0), l && (r.value = !0, t.value = i, e.value = Math.max(0, 1 - Math.abs(i) / (wt * 1.5)));
  }
  function y() {
    if (!_.swipeToDismiss) {
      o = null;
      return;
    }
    l && Math.abs(t.value) >= wt && s.onDismiss(), o = null, l = !1, r.value = !1, t.value = 0, e.value = 1;
  }
  return {
    offsetX: Se(t),
    opacity: Se(e),
    swiping: Se(r),
    onTouchStart: a,
    onTouchMove: f,
    onTouchEnd: y
  };
}
const bs = 4e3;
function xs(s) {
  const t = L(0);
  let e = null, r = 0, o = null;
  function l() {
    o !== null && (clearTimeout(o), o = null);
  }
  function a() {
    l();
    const i = (s.duration.value ?? bs) - s.expandDelayMs.value - s.collapseMs.value;
    if (t.value = Math.max(i, 0), i <= 0 || s.paused.value) return;
    const $ = e ?? i;
    r = Date.now(), o = setTimeout(() => {
      if (s.paused.value) {
        const x = Date.now() - r;
        e = Math.max(0, $ - x);
        return;
      }
      e = null, s.onTimeout();
    }, $);
  }
  function f() {
    if (o === null) return;
    const d = Date.now() - r, i = e ?? t.value;
    e = Math.max(0, i - d), l();
  }
  function y() {
    e === null || e <= 0 || a();
  }
  function u() {
    e = null, s.enabled.value && !s.paused.value && a();
  }
  return Q(
    [s.enabled, s.paused],
    ([d, i], [$, x]) => {
      if (!d) {
        l();
        return;
      }
      if (d && !$) {
        e = null, a();
        return;
      }
      i && !x ? f() : !i && x && y();
    },
    { immediate: !0 }
  ), Ve(l), {
    progressDuration: Se(t),
    restart: u
  };
}
const w = {
  spinnerSpin: "gooey-spinnerSpin",
  wrapper: "gooey-wrapper",
  blobSvg: "gooey-blobSvg",
  content: "gooey-content",
  contentCompact: "gooey-contentCompact",
  contentExpanded: "gooey-contentExpanded",
  header: "gooey-header",
  iconWrapper: "gooey-iconWrapper",
  title: "gooey-title",
  titleDefault: "gooey-titleDefault",
  titleSuccess: "gooey-titleSuccess",
  titleError: "gooey-titleError",
  titleWarning: "gooey-titleWarning",
  titleInfo: "gooey-titleInfo",
  titleLoading: "gooey-titleLoading",
  description: "gooey-description",
  actionWrapper: "gooey-actionWrapper",
  actionButton: "gooey-actionButton",
  actionDefault: "gooey-actionDefault",
  actionSuccess: "gooey-actionSuccess",
  actionError: "gooey-actionError",
  actionWarning: "gooey-actionWarning",
  actionInfo: "gooey-actionInfo",
  progressWrapper: "gooey-progressWrapper",
  progressBar: "gooey-progressBar",
  progressDefault: "gooey-progressDefault",
  progressSuccess: "gooey-progressSuccess",
  progressError: "gooey-progressError",
  progressWarning: "gooey-progressWarning",
  progressInfo: "gooey-progressInfo",
  progressPaused: "gooey-progressPaused",
  timestamp: "gooey-timestamp",
  closeButton: "gooey-closeButton",
  closeButtonRight: "gooey-closeButtonRight"
}, Ts = ["role", "aria-live", "data-center", "data-theme"], Ms = ["fill", "stroke", "stroke-width"], Ds = { style: { display: "flex", "align-items": "flex-start", gap: "10px" } }, _s = { style: { flex: "1", "min-width": "0" } }, As = ["aria-label"], ks = 4e3, Ss = 45, Es = /* @__PURE__ */ G({
  __name: "GooeyToast",
  props: {
    toast: {},
    toastId: {}
  },
  emits: ["dismiss", "heightChange"],
  setup(s, { emit: t }) {
    const e = s, r = t, o = G({
      name: "VNodeRenderer",
      props: { content: { required: !0 } },
      setup(n) {
        return () => {
          const c = n.content;
          return typeof c == "string" ? jt("span", c) : c;
        };
      }
    }), l = {
      default: ns,
      success: fs,
      error: ls,
      warning: ps,
      info: rs
    }, a = {
      loading: w.titleLoading,
      default: w.titleDefault,
      success: w.titleSuccess,
      error: w.titleError,
      warning: w.titleWarning,
      info: w.titleInfo
    }, f = {
      loading: w.actionInfo,
      default: w.actionDefault,
      success: w.actionSuccess,
      error: w.actionError,
      warning: w.actionWarning,
      info: w.actionInfo
    }, y = {
      loading: w.progressInfo,
      default: w.progressDefault,
      success: w.progressSuccess,
      error: w.progressError,
      warning: w.progressWarning,
      info: w.progressInfo
    };
    function u(...n) {
      return n.filter(Boolean).join(" ");
    }
    const d = L(null), i = L(!1), $ = L(0), x = L(!1), M = L(!1), q = L({ pw: 0, bw: 0, th: 0 }), U = L(null), ge = L(null), ee = L(null), b = L(null);
    let V = 0, E = { pw: 0, bw: 0, th: 0 }, F = { pw: 0, bw: 0, th: 0 }, se = { pw: 0, bw: 0, th: 0 }, me = !1, we = !1, et = 0, be = !1, tt = 0, st = !1, ot = !1, je = !1, D = null, O = null, Z = null, re = null, ue = null, ze = !1, nt = e.toast.phase, xe = null, Te = null;
    const oe = ys(), at = h(() => _.theme), We = h(() => _.position), Me = h(() => We.value.includes("center")), lt = h(() => We.value.includes("right")), Qe = h(() => _.dir === "rtl" ? Me.value ? !1 : !lt.value : lt.value), Ce = h(() => _.closeButton), Mt = h(() => Ce.value !== !1), it = h(() => e.toast.fillColor ?? (at.value === "dark" ? "#1a1a1a" : "#ffffff")), rt = h(() => e.toast.preset ? xt[e.toast.preset] : void 0), ye = h(() => {
      var n;
      return e.toast.spring ?? ((n = rt.value) == null ? void 0 : n.spring) ?? _.spring;
    }), ne = h(() => {
      var n;
      return e.toast.bounce ?? ((n = rt.value) == null ? void 0 : n.bounce) ?? _.bounce ?? 0.4;
    }), ut = h(() => e.toast.showProgress ?? _.showProgress), ct = h(() => d.value ?? e.toast.title), Y = h(() => d.value ? "success" : e.toast.phase), Ye = h(() => d.value ? void 0 : e.toast.description), $e = h(() => d.value ? void 0 : e.toast.action), dt = h(() => Y.value === "loading"), Pe = h(() => !!Ye.value), Le = h(() => !!$e.value), ft = h(() => Pe.value || Le.value), He = h(() => ft.value && !i.value), vt = h(() => q.value.pw > 0 && q.value.bw > 0 && q.value.th > 0), pt = h(() => oe.value ? 0 : 330), Dt = h(() => oe.value ? 10 : 900), _t = h(() => M.value && !d.value && !i.value), At = h(() => x.value || ie.value), ht = h(() => {
      var n;
      return ((n = e.toast.timing) == null ? void 0 : n.displayDuration) ?? e.toast.duration;
    }), kt = h(() => l[Y.value === "loading" ? "info" : Y.value]), St = h(() => dt.value ? "spinner" : Y.value), qe = (/* @__PURE__ */ new Date()).toLocaleTimeString(void 0, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }), Et = h(() => {
      const n = {};
      return Me.value ? n.margin = "0 auto" : Qe.value && (n.marginLeft = "auto", n.transform = "scaleX(-1)"), K.offsetX.value !== 0 ? {
        ...n,
        transform: `${n.transform ? `${n.transform} ` : ""}translateX(${K.offsetX.value}px)`,
        opacity: K.opacity.value,
        transition: "none"
      } : Object.keys(n).length > 0 ? n : void 0;
    }), Bt = h(() => Me.value ? { textAlign: "center" } : Qe.value ? { transform: "scaleX(-1)", textAlign: "right" } : { textAlign: "left" }), It = h(() => ({
      "--gooey-progress-duration": `${Lt.value || (ht.value ?? ks)}ms`
    })), Wt = h(() => u(
      w.closeButton,
      (Qe.value ? Ce.value !== "top-right" : Ce.value === "top-right") && w.closeButtonRight
    )), Ct = h(() => ({
      background: it.value,
      borderColor: e.toast.borderColor || "transparent",
      borderWidth: e.toast.borderColor ? e.toast.borderWidth ?? 1.5 : 0,
      boxShadow: e.toast.borderColor ? "none" : "0 1px 4px rgba(0, 0, 0, 0.2)",
      ...Me.value && Ce.value !== "top-right" ? { top: "6px", left: "-1px" } : {}
    })), K = $s({
      onDismiss: () => r("dismiss", e.toastId)
    });
    function Pt() {
      D == null || D.stop(), O == null || O.stop(), Z == null || Z.stop(), re == null || re.stop(), ue == null || ue.stop();
    }
    function z() {
      var v, C;
      const { pw: n, bw: c, th: g } = E;
      if (n <= 0 || c <= 0 || g <= 0) return;
      const p = Math.max(0, Math.min(1, V)), m = We.value.includes("center"), I = We.value.includes("right"), k = _.dir === "rtl" ? m ? !1 : !I : I;
      if (m) {
        const B = Math.max(F.bw, se.bw, n);
        (v = ge.value) == null || v.setAttribute("d", ws(n, B, g, p));
      } else
        (C = ge.value) == null || C.setAttribute("d", ms(n, c, g, p));
      if (p >= 1)
        U.value && (U.value.style.width = ""), b.value && (b.value.style.width = "", b.value.style.overflow = "", b.value.style.maxHeight = "", b.value.style.clipPath = "");
      else if (p > 0) {
        const B = F.bw, X = F.th, S = Math.min(n, c), j = S + (c - S) * p, Fe = N + (X - N) * p, de = m ? Math.max(F.bw, se.bw, n) : 0;
        if (U.value && (U.value.style.width = `${m ? de : j}px`), b.value)
          if (b.value.style.width = `${m ? de : B}px`, b.value.style.overflow = "hidden", b.value.style.maxHeight = `${Fe}px`, m) {
            const De = (de - j) / 2;
            b.value.style.clipPath = `inset(0 ${De}px 0 ${De}px)`;
          } else {
            const De = B - j;
            b.value.style.clipPath = k ? `inset(0 0 0 ${De}px)` : `inset(0 ${De}px 0 0)`;
          }
      } else {
        const B = Math.min(n, c);
        if (U.value) {
          const X = m ? Math.max(F.bw, se.bw, n) : B;
          U.value.style.width = `${X}px`;
        }
        if (b.value) {
          if (m) {
            const X = Math.max(F.bw, se.bw, n);
            b.value.style.width = `${X}px`;
            const S = (X - B) / 2;
            b.value.style.clipPath = `inset(0 ${S}px 0 ${S}px)`;
          } else
            b.value.style.width = "", b.value.style.clipPath = "";
          b.value.style.overflow = "hidden", b.value.style.maxHeight = `${N}px`;
        }
      }
    }
    function ce() {
      if (!ee.value || !b.value) return;
      const n = U.value, c = (n == null ? void 0 : n.style.width) ?? "", g = b.value.style.overflow, p = b.value.style.maxHeight, m = b.value.style.width;
      n && (n.style.width = ""), b.value.style.overflow = "", b.value.style.maxHeight = "", b.value.style.width = "";
      const I = getComputedStyle(b.value), k = parseFloat(I.paddingLeft) + parseFloat(I.paddingRight), v = ee.value.offsetWidth + k, C = b.value.offsetWidth, B = b.value.offsetHeight;
      n && (n.style.width = c), b.value.style.overflow = g, b.value.style.maxHeight = p, b.value.style.width = m, F = { pw: v, bw: C, th: B }, q.value = { pw: v, bw: C, th: B };
    }
    function Xe(n = "mount") {
      if (!U.value || oe.value || !ye.value) return;
      const c = Date.now();
      if (c - tt < 300) return;
      tt = c, re == null || re.stop();
      const g = U.value, p = n === "collapse" ? Ue(fe, fe, ne.value) : Ue(Ne, Ne, ne.value), m = ne.value / 0.4, I = (n === "collapse" ? 0.035 : 0.12) * m, k = (n === "collapse" ? 0.018 : 0.06) * m;
      re = ae(0, 1, {
        ...p,
        onUpdate: (v) => {
          const C = Math.sin(v * Math.PI), B = 1 - I * C, X = 1 + k * C, S = g.style.transform.includes("scaleX(-1)") ? "scaleX(-1) " : "";
          g.style.transformOrigin = "center top", g.style.transform = `${S}scaleX(${X}) scaleY(${B})`;
        },
        onComplete: () => {
          const v = g.style.transform.includes("scaleX(-1)");
          g.style.transform = v ? "scaleX(-1)" : "", g.style.transformOrigin = "";
        }
      });
    }
    const { progressDuration: Lt, restart: Ht } = xs({
      duration: ht,
      expandDelayMs: pt,
      collapseMs: Dt,
      paused: At,
      enabled: _t,
      onTimeout: () => {
        be || ie.value || (se = { ...E }, me = !0, we = !0, i.value = !0, Ft(e.toastId));
      }
    });
    function Xt() {
      be = !0, x.value = !0;
    }
    function Rt() {
      be = !1, x.value = !1;
    }
    function Nt() {
      const n = $e.value;
      if (n) {
        n.successLabel && (se = { ...E }, me = !0, d.value = n.successLabel);
        try {
          n.onClick();
        } catch {
        }
      }
    }
    function Ut(n) {
      n.stopPropagation(), r("dismiss", e.toastId);
    }
    return Je(() => {
      ce(), window.setTimeout(ce, 100), U.value && (xe = new ResizeObserver((n) => {
        var g;
        const c = (g = n[0]) == null ? void 0 : g.contentRect.height;
        c && c > 0 && r("heightChange", e.toastId, c);
      }), xe.observe(U.value)), b.value && (Te = new ResizeObserver(() => {
        ce();
      }), Te.observe(b.value));
    }), Ve(() => {
      Pt(), xe == null || xe.disconnect(), Te == null || Te.disconnect();
    }), Q(
      [ct, Y, He, M, Ye, $e],
      (n, c, g) => {
        ce();
        const p = window.setTimeout(ce, 100);
        g(() => clearTimeout(p));
      },
      { flush: "pre" }
    ), Q(
      [() => q.value.pw, () => q.value.bw, () => q.value.th, vt, M, oe, ye, ne, He],
      ([n, c, g, p, m, I, k, v, C], B, X) => {
        if (!p || me) return;
        const S = { ...E }, j = { pw: n, bw: c, th: g };
        if (S.bw <= 0) {
          E = j, z();
          return;
        }
        if (V > 0 && V < 1) {
          E = j, z();
          return;
        }
        if (m) {
          E = j, z();
          return;
        }
        if (S.bw === j.bw && S.pw === j.pw && S.th === j.th) return;
        if (I) {
          E = j, z();
          return;
        }
        O == null || O.stop(), Date.now() - et > 500 && !C && Xe("expand");
        const Fe = k ? { type: "spring", duration: 0.5, bounce: v * 0.875 } : { duration: 0.4, ease: Ae };
        O = ae(0, 1, {
          ...Fe,
          onUpdate: (de) => {
            E = {
              pw: S.pw + (j.pw - S.pw) * de,
              bw: S.bw + (j.bw - S.bw) * de,
              th: S.th + (j.th - S.th) * de
            }, z();
          }
        }), X(() => {
          O == null || O.stop();
        });
      },
      { flush: "pre" }
    ), Q(
      [vt, He],
      ([n, c], g, p) => {
        if (!n || st || c) return;
        st = !0;
        const m = window.setTimeout(() => Xe("mount"), Ss);
        p(() => clearTimeout(m));
      },
      { immediate: !0 }
    ), Q(
      M,
      (n, c, g) => {
        if (!ot && n && !be) {
          const p = window.setTimeout(() => Xe("expand"), 80);
          g(() => clearTimeout(p));
        }
        ot = n;
      },
      { flush: "pre" }
    ), Q(
      () => e.toast.phase,
      (n) => {
        if (n === "error" && nt !== "error" && !i.value && U.value && !oe.value) {
          ue == null || ue.stop();
          const c = U.value, g = c.style.transform.includes("scaleX(-1)") ? "scaleX(-1) " : "";
          ue = ae(0, 1, {
            duration: 0.4,
            ease: "easeOut",
            onUpdate: (p) => {
              const m = 1 - p, I = Math.sin(p * Math.PI * 6) * m * 3;
              c.style.transform = `${g}translateX(${I}px)`;
            },
            onComplete: () => {
              c.style.transform = g.trim();
            }
          });
        }
        nt = n;
      }
    ), Q(
      He,
      (n, c, g) => {
        if (n) {
          const p = window.setTimeout(() => {
            M.value = !0;
          }, pt.value);
          g(() => clearTimeout(p));
          return;
        }
        if (D == null || D.stop(), O == null || O.stop(), V > 0) {
          const p = b.value ? getComputedStyle(b.value) : null, m = p ? parseFloat(p.paddingLeft) + parseFloat(p.paddingRight) : 20, I = ee.value ? ee.value.offsetWidth + m : E.pw, k = { pw: I, bw: I, th: N };
          if (oe.value) {
            V = 0, me = !1, we = !1, M.value = !1, E = { ...k }, z();
            return;
          }
          const v = se.bw > 0 ? { ...se } : { ...E }, C = we || !ye.value ? { duration: fe, ease: Ae } : { type: "spring", duration: fe, bounce: ne.value * 0.875 };
          Xe("collapse"), D = ae(V, 0, {
            ...C,
            onUpdate: (B) => {
              V = B, E = {
                pw: k.pw + (v.pw - k.pw) * B,
                bw: k.bw + (v.bw - k.bw) * B,
                th: k.th + (v.th - k.th) * B
              }, z();
            },
            onComplete: () => {
              V = 0, me = !1, we = !1, et = Date.now(), E = { ...k }, z(), M.value = !1;
            }
          }), g(() => D == null ? void 0 : D.stop());
          return;
        }
        M.value = !1, V = 0, z();
      },
      { flush: "post" }
    ), Q(
      [x, ie, ft, i],
      ([n, c, g, p], m, I) => {
        if (!n && !c || !g || !p) return;
        D == null || D.stop(), me = !1, we = !1, je = !0, i.value = !1, M.value = !0, Ht(), ut.value && ($.value += 1);
        const k = V, v = { ...E };
        let C = 0;
        C = requestAnimationFrame(() => {
          ce();
          const B = ye.value ? { type: "spring", duration: 0.9, bounce: ne.value } : { duration: 0.6, ease: Ae };
          D = ae(k, 1, {
            ...B,
            onUpdate: (X) => {
              V = X;
              const S = F;
              E = {
                pw: v.pw + (S.pw - v.pw) * X,
                bw: v.bw + (S.bw - v.bw) * X,
                th: v.th + (S.th - v.th) * X
              }, z();
            },
            onComplete: () => {
              V = 1, E = { ...F }, je = !1, z();
            }
          });
        }), I(() => {
          cancelAnimationFrame(C), D == null || D.stop();
        });
      },
      { flush: "post" }
    ), Q(
      [i, M],
      ([n, c], g, p) => {
        if (!n || c) return;
        const m = window.setTimeout(() => {
          !be && !ie.value && r("dismiss", e.toastId);
        }, 800);
        p(() => clearTimeout(m));
      },
      { flush: "post" }
    ), Q(
      [d, M],
      ([n, c], g, p) => {
        if (!n || c) return;
        const m = window.setTimeout(() => {
          r("dismiss", e.toastId);
        }, 1200);
        p(() => clearTimeout(m));
      },
      { flush: "post" }
    ), Q(
      M,
      (n, c, g) => {
        if (je) return;
        if (!n) {
          V = 0, D == null || D.stop(), z();
          return;
        }
        if (oe.value) {
          O == null || O.stop(), D == null || D.stop(), V = 1, E = { ...F }, z();
          return;
        }
        let p = 0;
        p = requestAnimationFrame(() => {
          ce(), O == null || O.stop(), D == null || D.stop();
          const m = { ...E }, I = ye.value ? { type: "spring", duration: 0.9, bounce: ne.value } : { duration: 0.6, ease: Ae };
          D = ae(0, 1, {
            ...I,
            onUpdate: (k) => {
              V = k;
              const v = F;
              E = {
                pw: m.pw + (v.pw - m.pw) * k,
                bw: m.bw + (v.bw - m.bw) * k,
                th: m.th + (v.th - m.th) * k
              }, z();
            },
            onComplete: () => {
              V = 1, E = { ...F }, z();
            }
          });
        }), g(() => {
          cancelAnimationFrame(p), D == null || D.stop();
        });
      },
      { flush: "post" }
    ), Q(
      [M, i, d, oe, ye, ne],
      ([n, c, g, p, m, I], k, v) => {
        if (!ee.value || p) return;
        Z == null || Z.stop();
        const C = ee.value;
        if (n && !c && !g) {
          if (!m) return;
          ze = !0, Z = ae(0, 1, {
            ...Ue(Ne, Ne, I),
            onUpdate: (B) => {
              const X = 1 - 0.05 * B, S = B * 1;
              C.style.transform = `scale(${X}) translateY(${S}px)`;
            }
          });
        } else if (ze) {
          ze = !1;
          const B = !we && m ? Ue(fe, fe, I) : { duration: fe * 0.5, ease: Ae };
          Z = ae(1, 0, {
            ...B,
            onUpdate: (X) => {
              const S = 1 - 0.05 * X, j = X * 1;
              C.style.transform = `scale(${S}) translateY(${j}px)`;
            },
            onComplete: () => {
              C.style.transform = "";
            }
          });
        }
        v(() => Z == null ? void 0 : Z.stop());
      },
      { flush: "post" }
    ), (n, c) => {
      var g, p, m, I, k;
      return W(), R("div", {
        ref_key: "wrapperRef",
        ref: U,
        class: P(u(T(w).wrapper, (g = s.toast.classNames) == null ? void 0 : g.wrapper)),
        style: pe(Et.value),
        role: Y.value === "error" || Y.value === "warning" ? "alert" : "status",
        "aria-live": Y.value === "error" || Y.value === "warning" ? "assertive" : "polite",
        "aria-atomic": "true",
        "data-center": Me.value || void 0,
        "data-theme": at.value,
        onMouseenter: Xt,
        onMouseleave: Rt,
        onTouchstart: c[0] || (c[0] = //@ts-ignore
        (...v) => T(K).onTouchStart && T(K).onTouchStart(...v)),
        onTouchmove: c[1] || (c[1] = //@ts-ignore
        (...v) => T(K).onTouchMove && T(K).onTouchMove(...v)),
        onTouchend: c[2] || (c[2] = //@ts-ignore
        (...v) => T(K).onTouchEnd && T(K).onTouchEnd(...v)),
        onTouchcancel: c[3] || (c[3] = //@ts-ignore
        (...v) => T(K).onTouchEnd && T(K).onTouchEnd(...v))
      }, [
        (W(), R("svg", {
          class: P(T(w).blobSvg),
          "aria-hidden": "true"
        }, [
          A("path", {
            ref_key: "pathRef",
            ref: ge,
            fill: it.value,
            stroke: s.toast.borderColor || "none",
            "stroke-width": s.toast.borderColor ? s.toast.borderWidth ?? 1.5 : 0
          }, null, 8, Ms)
        ], 2)),
        Mt.value && Y.value !== "loading" ? (W(), R("button", {
          key: 0,
          class: P(Wt.value),
          "aria-label": "Close toast",
          type: "button",
          style: pe(Ct.value),
          onClick: Ut
        }, [...c[4] || (c[4] = [
          A("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "12",
            height: "12",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            A("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }),
            A("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })
          ], -1)
        ])], 6)) : le("", !0),
        A("div", {
          ref_key: "contentRef",
          ref: b,
          class: P(u(T(w).content, M.value ? T(w).contentExpanded : T(w).contentCompact, (p = s.toast.classNames) == null ? void 0 : p.content)),
          style: pe(Bt.value)
        }, [
          A("div", {
            ref_key: "headerRef",
            ref: ee,
            class: P(u(T(w).header, a[Y.value], (m = s.toast.classNames) == null ? void 0 : m.header))
          }, [
            A("div", {
              class: P(u(T(w).iconWrapper, (I = s.toast.classNames) == null ? void 0 : I.icon))
            }, [
              te(Re, {
                name: "gooey-icon",
                mode: "out-in"
              }, {
                default: ke(() => [
                  (W(), R("div", { key: St.value }, [
                    !d.value && s.toast.icon ? (W(), Oe(T(o), {
                      key: 0,
                      content: s.toast.icon
                    }, null, 8, ["content"])) : dt.value ? (W(), Oe(cs, {
                      key: 1,
                      size: 18,
                      class: P(T(w).spinnerSpin)
                    }, null, 8, ["class"])) : (W(), Oe(zt(kt.value), {
                      key: 2,
                      size: 18
                    }))
                  ]))
                ]),
                _: 1
              })
            ], 2),
            A("span", {
              class: P(u(T(w).title, (k = s.toast.classNames) == null ? void 0 : k.title))
            }, ve(ct.value), 3),
            !Pe.value && !Le.value && !d.value && s.toast.showTimestamp !== !1 ? (W(), R("span", {
              key: 0,
              class: P(T(w).timestamp)
            }, ve(T(qe)), 3)) : le("", !0)
          ], 2),
          te(Re, { name: "gooey-fade" }, {
            default: ke(() => {
              var v;
              return [
                M.value && Pe.value && !i.value ? (W(), R("div", {
                  key: 0,
                  class: P(u(T(w).description, (v = s.toast.classNames) == null ? void 0 : v.description)),
                  style: { "text-align": "left" }
                }, [
                  A("div", Ds, [
                    A("div", _s, [
                      te(T(o), {
                        content: Ye.value
                      }, null, 8, ["content"])
                    ]),
                    s.toast.showTimestamp !== !1 ? (W(), R("span", {
                      key: 0,
                      class: P(T(w).timestamp)
                    }, ve(T(qe)), 3)) : le("", !0)
                  ])
                ], 2)) : le("", !0)
              ];
            }),
            _: 1
          }),
          te(Re, { name: "gooey-fade" }, {
            default: ke(() => [
              M.value && !Pe.value && Le.value && !i.value && s.toast.showTimestamp !== !1 ? (W(), R("div", {
                key: 0,
                class: P(T(w).timestamp),
                style: { "text-align": "right", "margin-top": "8px", "padding-left": "0" }
              }, ve(T(qe)), 3)) : le("", !0)
            ]),
            _: 1
          }),
          te(Re, { name: "gooey-fade" }, {
            default: ke(() => {
              var v, C;
              return [
                M.value && Le.value && $e.value && !i.value ? (W(), R("div", {
                  key: 0,
                  class: P(u(T(w).actionWrapper, (v = s.toast.classNames) == null ? void 0 : v.actionWrapper))
                }, [
                  A("button", {
                    class: P(u(T(w).actionButton, f[Y.value], (C = s.toast.classNames) == null ? void 0 : C.actionButton)),
                    type: "button",
                    "aria-label": $e.value.label,
                    onClick: Nt
                  }, ve($e.value.label), 11, As)
                ], 2)) : le("", !0)
              ];
            }),
            _: 1
          }),
          ut.value ? (W(), R("div", {
            key: $.value,
            class: P(u(T(w).progressWrapper, (x.value || T(ie)) && T(w).progressPaused)),
            style: pe({ opacity: M.value && !d.value ? 1 : 0 })
          }, [
            A("div", {
              class: P(u(T(w).progressBar, y[Y.value])),
              style: pe(It.value)
            }, null, 6)
          ], 6)) : le("", !0)
        ], 6)
      ], 46, Ts);
    };
  }
}), Bs = ["data-position", "data-theme", "data-dir"], Is = /* @__PURE__ */ G({
  __name: "ToastContainer",
  props: {
    position: { default: "bottom-right" },
    gap: { default: 14 },
    offset: { default: "24px" },
    theme: { default: "light" },
    dir: { default: "ltr" },
    visibleToasts: { default: 3 }
  },
  setup(s) {
    const t = s, e = yt(/* @__PURE__ */ new Map());
    function r(i, $) {
      e.set(i, $);
    }
    function o(i) {
      e.delete(i), Ze(i);
    }
    function l() {
      ie.value = !0;
    }
    function a() {
      ie.value = !1;
    }
    const f = h(() => t.position.startsWith("bottom")), y = h(() => {
      let i = 0;
      const $ = H.value;
      for (let x = 0; x < $.length; x++)
        i += e.get($[x].id) ?? 0, x < $.length - 1 && (i += t.gap);
      return i;
    }), u = h(() => {
      const i = typeof t.offset == "number" ? `${t.offset}px` : t.offset, $ = {
        position: "fixed",
        zIndex: "999999",
        listStyle: "none",
        padding: "0",
        margin: "0",
        width: "356px",
        height: `${y.value}px`,
        pointerEvents: H.value.length > 0 ? "auto" : "none"
      };
      return f.value ? $.bottom = i : $.top = i, t.position.endsWith("right") ? $.right = i : t.position.endsWith("left") ? $.left = i : ($.left = "50%", $.transform = "translateX(-50%)"), $;
    });
    function d(i) {
      const $ = H.value, x = $.length, M = x - 1 - i, q = ie.value;
      let U = 0;
      for (let E = x - 1; E > i; E--)
        U += (e.get($[E].id) ?? 0) + t.gap;
      const ge = M < t.visibleToasts || q, ee = q ? 1 : Math.max(0.8, 1 - M * 0.05), V = (f.value ? -1 : 1) * U;
      return {
        position: "absolute",
        ...f.value ? { bottom: "0" } : { top: "0" },
        left: "0",
        right: "0",
        transform: `translate3d(0, ${V}px, 0) scale(${ee})`,
        transformOrigin: f.value ? "bottom center" : "top center",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        opacity: ge ? "1" : "0",
        zIndex: String(x - M),
        pointerEvents: ge ? "auto" : "none"
      };
    }
    return (i, $) => (W(), Oe(Qt, { to: "body" }, [
      A("ol", {
        "data-gooey-toaster": "",
        "data-position": s.position,
        "data-theme": s.theme,
        "data-dir": s.dir,
        style: pe(u.value),
        onMouseenter: l,
        onMouseleave: a
      }, [
        (W(!0), R(Ke, null, Yt(T(H), (x, M) => (W(), R("li", {
          key: x.id,
          style: pe(d(M))
        }, [
          te(ss, null, {
            default: ke(() => [
              te(Es, {
                toast: x,
                "toast-id": x.id,
                onDismiss: o,
                onHeightChange: r
              }, null, 8, ["toast", "toast-id"])
            ]),
            _: 2
          }, 1024)
        ], 4))), 128))
      ], 44, Bs)
    ]));
  }
}), Ls = /* @__PURE__ */ G({
  __name: "GooeyToaster",
  props: {
    position: { default: "bottom-right" },
    duration: {},
    gap: { default: 14 },
    offset: { default: "24px" },
    theme: { default: "light" },
    closeButton: { type: [Boolean, String], default: !1 },
    visibleToasts: { default: 3 },
    dir: { default: "ltr" },
    preset: {},
    spring: { type: Boolean },
    bounce: {},
    swipeToDismiss: { type: Boolean, default: !0 },
    closeOnEscape: { type: Boolean, default: !0 },
    maxQueue: { default: 1 / 0 },
    queueOverflow: { default: "drop-oldest" },
    showProgress: { type: Boolean, default: !1 }
  },
  setup(s) {
    const t = s, e = h(() => t.preset ? xt[t.preset] : void 0), r = h(() => {
      var a;
      return t.spring ?? ((a = e.value) == null ? void 0 : a.spring) ?? !0;
    }), o = h(() => {
      var a;
      return t.bounce ?? ((a = e.value) == null ? void 0 : a.bounce);
    });
    qt(() => {
      _.position = t.position, _.dir = t.dir, _.theme = t.theme, _.spring = r.value, _.bounce = o.value, _.visibleToasts = t.visibleToasts, _.swipeToDismiss = t.swipeToDismiss, _.closeOnEscape = t.closeOnEscape, _.maxQueue = t.maxQueue, _.queueOverflow = t.queueOverflow, _.showProgress = t.showProgress, _.closeButton = t.closeButton;
    });
    function l(a) {
      if (!_.closeOnEscape || a.key !== "Escape") return;
      const f = Gt();
      f != null && es.dismiss(f);
    }
    return Je(() => {
      document.addEventListener("keydown", l);
    }), Ve(() => {
      document.removeEventListener("keydown", l);
    }), (a, f) => (W(), R(Ke, null, [
      te(Is, {
        position: t.position,
        gap: t.gap,
        offset: t.offset,
        theme: t.theme,
        dir: t.dir,
        "visible-toasts": t.visibleToasts
      }, null, 8, ["position", "gap", "offset", "theme", "dir", "visible-toasts"]),
      te(ts)
    ], 64));
  }
});
export {
  Ls as GoeyToaster,
  Ls as GooeyToaster,
  xt as animationPresets,
  es as goeyToast,
  es as gooeyToast
};
//# sourceMappingURL=index.js.map
