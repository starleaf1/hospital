import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useI18n } from './useI18n-DsSCLrC3.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, formatNumber, formatDateTime } = useI18n();
    const stats = ref([]);
    const recentPatients = ref([]);
    ref(true);
    const getTranslationKey = (label) => {
      if (label === "Total Patients") return "totalPatients";
      if (label === "Active Encounters") return "activeEncounters";
      if (label === "Pending Encounters") return "pendingEncounters";
      return label;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard" }, _attrs))} data-v-e557e1e4><div class="header" data-v-e557e1e4><h2 data-v-e557e1e4>${ssrInterpolate(unref(t)("overview"))}</h2><p data-v-e557e1e4>${ssrInterpolate(unref(t)("welcomeBack"))}</p></div><div class="stats-grid" data-v-e557e1e4><!--[-->`);
      ssrRenderList(stats.value, (stat) => {
        _push(`<div class="stat-card glass-panel" data-v-e557e1e4><div class="stat-value" data-v-e557e1e4>${ssrInterpolate(unref(formatNumber)(stat.value))}</div><div class="stat-label" data-v-e557e1e4>${ssrInterpolate(unref(t)(getTranslationKey(stat.label)))}</div><div class="${ssrRenderClass([stat.trend > 0 ? "positive" : "negative", "stat-trend"])}" data-v-e557e1e4>${ssrInterpolate(stat.trend > 0 ? "+" : "")}${ssrInterpolate(unref(formatNumber)(stat.trend))}${ssrInterpolate(unref(t)("fromLastWeek"))}</div></div>`);
      });
      _push(`<!--]--></div><div class="recent-activity glass-panel" data-v-e557e1e4><h3 data-v-e557e1e4>${ssrInterpolate(unref(t)("recentPatients"))}</h3><table class="activity-table" data-v-e557e1e4><thead data-v-e557e1e4><tr data-v-e557e1e4><th data-v-e557e1e4>${ssrInterpolate(unref(t)("name"))}</th><th data-v-e557e1e4>${ssrInterpolate(unref(t)("nik"))}</th><th data-v-e557e1e4>${ssrInterpolate(unref(t)("status"))}</th><th data-v-e557e1e4>${ssrInterpolate(unref(t)("time"))}</th></tr></thead><tbody data-v-e557e1e4><!--[-->`);
      ssrRenderList(recentPatients.value, (patient) => {
        _push(`<tr data-v-e557e1e4><td data-v-e557e1e4>${ssrInterpolate(patient.name)}</td><td data-v-e557e1e4>${ssrInterpolate(patient.id)}</td><td data-v-e557e1e4><span class="${ssrRenderClass([patient.status.toLowerCase(), "status-badge"])}" data-v-e557e1e4>${ssrInterpolate(unref(t)(patient.status.toLowerCase()))}</span></td><td data-v-e557e1e4>${ssrInterpolate(unref(formatDateTime)(patient.createdAt))}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e557e1e4"]]);

export { index as default };
//# sourceMappingURL=index-Btpsxh40.mjs.map
