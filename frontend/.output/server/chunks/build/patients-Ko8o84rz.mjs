import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
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
  __name: "patients",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, formatDate } = useI18n();
    const patients2 = ref([]);
    const loading = ref(true);
    const showAddModal = ref(false);
    const newPatient = ref({
      nik: "",
      name: "",
      gender: "M",
      birthDate: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "patients-page" }, _attrs))} data-v-e581425b><div class="header" data-v-e581425b><h2 data-v-e581425b>${ssrInterpolate(unref(t)("patients"))}</h2><button class="primary-btn" data-v-e581425b>${ssrInterpolate(unref(t)("addPatient"))}</button></div>`);
      if (showAddModal.value) {
        _push(`<div class="modal-overlay" data-v-e581425b><div class="modal-content glass-panel" data-v-e581425b><h3 data-v-e581425b>${ssrInterpolate(unref(t)("addNewPatient"))}</h3><form class="add-form" data-v-e581425b><div class="form-group" data-v-e581425b><label data-v-e581425b>${ssrInterpolate(unref(t)("nik"))}</label><input${ssrRenderAttr("value", newPatient.value.nik)} required type="text" data-v-e581425b></div><div class="form-group" data-v-e581425b><label data-v-e581425b>${ssrInterpolate(unref(t)("name"))}</label><input${ssrRenderAttr("value", newPatient.value.name)} required type="text" data-v-e581425b></div><div class="form-group" data-v-e581425b><label data-v-e581425b>${ssrInterpolate(unref(t)("gender"))}</label><select required data-v-e581425b><option value="M" data-v-e581425b${ssrIncludeBooleanAttr(Array.isArray(newPatient.value.gender) ? ssrLooseContain(newPatient.value.gender, "M") : ssrLooseEqual(newPatient.value.gender, "M")) ? " selected" : ""}>${ssrInterpolate(unref(t)("M"))}</option><option value="F" data-v-e581425b${ssrIncludeBooleanAttr(Array.isArray(newPatient.value.gender) ? ssrLooseContain(newPatient.value.gender, "F") : ssrLooseEqual(newPatient.value.gender, "F")) ? " selected" : ""}>${ssrInterpolate(unref(t)("F"))}</option></select></div><div class="form-group" data-v-e581425b><label data-v-e581425b>${ssrInterpolate(unref(t)("birthDate"))}</label><input${ssrRenderAttr("value", newPatient.value.birthDate)} required type="date" data-v-e581425b></div><div class="modal-actions" data-v-e581425b><button type="button" class="secondary-btn" data-v-e581425b>${ssrInterpolate(unref(t)("cancel"))}</button><button type="submit" class="primary-btn" data-v-e581425b>${ssrInterpolate(unref(t)("savePatient"))}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="glass-panel content-card" data-v-e581425b>${ssrInterpolate(unref(t)("loadingPatients"))}</div>`);
      } else {
        _push(`<div class="glass-panel content-card" data-v-e581425b><table class="data-table" data-v-e581425b><thead data-v-e581425b><tr data-v-e581425b><th data-v-e581425b>${ssrInterpolate(unref(t)("nik"))}</th><th data-v-e581425b>${ssrInterpolate(unref(t)("name"))}</th><th data-v-e581425b>${ssrInterpolate(unref(t)("gender"))}</th><th data-v-e581425b>${ssrInterpolate(unref(t)("birthDate"))}</th><th data-v-e581425b>${ssrInterpolate(unref(t)("registered"))}</th></tr></thead><tbody data-v-e581425b><!--[-->`);
        ssrRenderList(patients2.value, (patient) => {
          _push(`<tr data-v-e581425b><td data-v-e581425b>${ssrInterpolate(patient.nik)}</td><td data-v-e581425b>${ssrInterpolate(patient.name)}</td><td data-v-e581425b>${ssrInterpolate(unref(t)(patient.gender))}</td><td data-v-e581425b>${ssrInterpolate(unref(formatDate)(patient.birthDate))}</td><td data-v-e581425b>${ssrInterpolate(unref(formatDate)(patient.createdAt))}</td></tr>`);
        });
        _push(`<!--]-->`);
        if (patients2.value.length === 0) {
          _push(`<tr data-v-e581425b><td colspan="5" class="empty-state" data-v-e581425b>${ssrInterpolate(unref(t)("noPatientsFound"))}</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/patients.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const patients = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e581425b"]]);

export { patients as default };
//# sourceMappingURL=patients-Ko8o84rz.mjs.map
