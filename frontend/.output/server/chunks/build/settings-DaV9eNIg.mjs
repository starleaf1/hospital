import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, t, formatNumber, formatCurrency, formatDate, formatDateTime } = useI18n();
    const tenantName = ref("");
    const userName = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "settings-page" }, _attrs))} data-v-9ea3338a><div class="header" data-v-9ea3338a><h2 data-v-9ea3338a>${ssrInterpolate(unref(t)("tenantSettings"))}</h2></div><div class="settings-grid" data-v-9ea3338a><div class="glass-panel settings-card" data-v-9ea3338a><h3 data-v-9ea3338a>${ssrInterpolate(unref(t)("hospitalInformation"))}</h3><div class="form-group" data-v-9ea3338a><label data-v-9ea3338a>${ssrInterpolate(unref(t)("hospitalName"))}</label><input type="text"${ssrRenderAttr("value", tenantName.value)} disabled data-v-9ea3338a></div><div class="form-group" data-v-9ea3338a><label data-v-9ea3338a>${ssrInterpolate(unref(t)("adminUser"))}</label><input type="text"${ssrRenderAttr("value", userName.value)} disabled data-v-9ea3338a></div></div><div class="glass-panel settings-card" data-v-9ea3338a><h3 data-v-9ea3338a>${ssrInterpolate(unref(t)("integrationStatus"))}</h3><ul class="integration-list" data-v-9ea3338a><li data-v-9ea3338a><span class="integration-name" data-v-9ea3338a>${ssrInterpolate(unref(t)("bpjsKesehatan"))}</span><span class="status-indicator active" data-v-9ea3338a>${ssrInterpolate(unref(t)("connected"))}</span></li><li data-v-9ea3338a><span class="integration-name" data-v-9ea3338a>${ssrInterpolate(unref(t)("satusehatKemenkes"))}</span><span class="status-indicator active" data-v-9ea3338a>${ssrInterpolate(unref(t)("sandboxActive"))}</span></li></ul></div><div class="glass-panel settings-card" data-v-9ea3338a><h3 data-v-9ea3338a>${ssrInterpolate(unref(t)("languagePreferences"))}</h3><div class="form-group" data-v-9ea3338a><label data-v-9ea3338a>${ssrInterpolate(unref(t)("selectLanguage"))}</label><div class="language-buttons" data-v-9ea3338a><button type="button" class="${ssrRenderClass([{ active: unref(locale) === "en" }, "lang-preview-btn"])}" data-v-9ea3338a> \u{1F1FA}\u{1F1F8} English </button><button type="button" class="${ssrRenderClass([{ active: unref(locale) === "id" }, "lang-preview-btn"])}" data-v-9ea3338a> \u{1F1EE}\u{1F1E9} Bahasa Indonesia </button></div></div><div class="format-preview-section" data-v-9ea3338a><h4 data-v-9ea3338a>${ssrInterpolate(unref(t)("formatPreview"))}</h4><div class="preview-row" data-v-9ea3338a><span data-v-9ea3338a>${ssrInterpolate(unref(t)("numberFormat"))}:</span><strong data-v-9ea3338a>${ssrInterpolate(unref(formatNumber)(123456789e-2))}</strong></div><div class="preview-row" data-v-9ea3338a><span data-v-9ea3338a>${ssrInterpolate(unref(t)("currencyFormat"))}:</span><strong class="currency-highlight" data-v-9ea3338a>${ssrInterpolate(unref(formatCurrency)(123456789e-2))}</strong></div><div class="preview-row" data-v-9ea3338a><span data-v-9ea3338a>${ssrInterpolate(unref(t)("dateFormat"))}:</span><strong data-v-9ea3338a>${ssrInterpolate(unref(formatDate)(/* @__PURE__ */ new Date()))}</strong></div><div class="preview-row" data-v-9ea3338a><span data-v-9ea3338a>${ssrInterpolate(unref(t)("dateTimeFormat"))}:</span><strong data-v-9ea3338a>${ssrInterpolate(unref(formatDateTime)(/* @__PURE__ */ new Date()))}</strong></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9ea3338a"]]);

export { settings as default };
//# sourceMappingURL=settings-DaV9eNIg.mjs.map
