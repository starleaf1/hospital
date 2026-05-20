import { _ as __nuxt_component_0 } from './nuxt-link-Lc3oZxtZ.mjs';
import { ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
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

const style0 = {};
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const tenantName = ref("Loading...");
    const userName = ref("");
    const { locale, t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-container" }, _attrs))} data-v-b7b1985c><aside class="sidebar glass-panel" data-v-b7b1985c><div class="logo" data-v-b7b1985c>SIMRS Pro</div><nav data-v-b7b1985c><ul data-v-b7b1985c><li data-v-b7b1985c>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("dashboard"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("dashboard")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-b7b1985c>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/patients" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("patients"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("patients")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-b7b1985c>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/appointments" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("appointments"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("appointments")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-b7b1985c>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/settings" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("settings"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("settings")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></nav></aside><main class="content" data-v-b7b1985c><header class="topbar glass-panel" data-v-b7b1985c><div class="tenant-info" data-v-b7b1985c><h1 data-v-b7b1985c>${ssrInterpolate(tenantName.value)}</h1></div><div class="topbar-actions" data-v-b7b1985c><div class="language-selector" data-v-b7b1985c><button class="${ssrRenderClass([{ active: unref(locale) === "en" }, "lang-btn"])}" data-v-b7b1985c> \u{1F1FA}\u{1F1F8} EN </button><button class="${ssrRenderClass([{ active: unref(locale) === "id" }, "lang-btn"])}" data-v-b7b1985c> \u{1F1EE}\u{1F1E9} ID </button></div><div class="user-profile" data-v-b7b1985c><span data-v-b7b1985c>${ssrInterpolate(userName.value)} (Admin)</span><a href="#" class="logout-link" data-v-b7b1985c>${ssrInterpolate(unref(t)("logout"))}</a></div></div></header><div class="page-content" data-v-b7b1985c>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
    };
  }
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules], ["__scopeId", "data-v-b7b1985c"]]);

export { _default as default };
//# sourceMappingURL=default-lWbLz41X.mjs.map
