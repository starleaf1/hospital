import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const email = ref("admin@citycentral.com");
    const password = ref("admin123");
    const { locale, t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-container" }, _attrs))} data-v-c151c421><div class="floating-lang-selector" data-v-c151c421><button class="${ssrRenderClass([{ active: unref(locale) === "en" }, "lang-btn"])}" data-v-c151c421> \u{1F1FA}\u{1F1F8} EN </button><button class="${ssrRenderClass([{ active: unref(locale) === "id" }, "lang-btn"])}" data-v-c151c421> \u{1F1EE}\u{1F1E9} ID </button></div><div class="login-card glass-panel" data-v-c151c421><div class="logo" data-v-c151c421>SIMRS Pro</div><h2 data-v-c151c421>${ssrInterpolate(unref(t)("hospitalAdminLogin"))}</h2><p class="subtitle" data-v-c151c421>${ssrInterpolate(unref(t)("signInSubtitle"))}</p><form class="login-form" data-v-c151c421><div class="form-group" data-v-c151c421><label data-v-c151c421>${ssrInterpolate(unref(t)("email"))}</label><input type="email"${ssrRenderAttr("value", email.value)} placeholder="admin@citycentral.com" required data-v-c151c421></div><div class="form-group" data-v-c151c421><label data-v-c151c421>${ssrInterpolate(unref(t)("password"))}</label><input type="password"${ssrRenderAttr("value", password.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required data-v-c151c421></div><button type="submit" class="login-btn" data-v-c151c421>${ssrInterpolate(unref(t)("signIn"))}</button></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c151c421"]]);

export { login as default };
//# sourceMappingURL=login-DW-5OpIB.mjs.map
