import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "appointments",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, formatDateTime } = useI18n();
    const encounters = ref([]);
    const patients = ref([]);
    const servicePoints = ref([]);
    const loading = ref(true);
    const showModal = ref(false);
    const isEditing = ref(false);
    ref(null);
    const patientSearch = ref("");
    const patientSearchDisplay = ref("");
    const servicePointSearch = ref("");
    const servicePointSearchDisplay = ref("");
    const showPatientDropdown = ref(false);
    const showServicePointDropdown = ref(false);
    const filteredPatients = computed(() => {
      if (!patientSearch.value) return patients.value;
      const query = patientSearch.value.toLowerCase();
      return patients.value.filter(
        (p) => p.name.toLowerCase().includes(query) || p.nik.includes(query)
      );
    });
    const filteredServicePoints = computed(() => {
      if (!servicePointSearch.value) return servicePoints.value;
      const query = servicePointSearch.value.toLowerCase();
      return servicePoints.value.filter(
        (sp) => sp.name.toLowerCase().includes(query)
      );
    });
    const encounterForm = ref({
      patientId: "",
      servicePointId: "",
      status: "WAITING",
      bpjsSepNumber: "",
      satusehatEncounterId: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "appointments-page" }, _attrs))} data-v-c15f092d><div class="header" data-v-c15f092d><h2 data-v-c15f092d>${ssrInterpolate(unref(t)("appointmentsAndEncounters"))}</h2><button class="primary-btn" data-v-c15f092d>${ssrInterpolate(unref(t)("newEncounter"))}</button></div>`);
      if (showModal.value) {
        _push(`<div class="modal-overlay" data-v-c15f092d><div class="modal-content glass-panel" data-v-c15f092d><h3 data-v-c15f092d>${ssrInterpolate(isEditing.value ? unref(t)("editEncounter") : unref(t)("addNewEncounter"))}</h3><form class="add-form" data-v-c15f092d><div class="form-group custom-select-wrapper" data-v-c15f092d><label data-v-c15f092d>${ssrInterpolate(unref(t)("patient"))}</label><div class="custom-select" data-v-c15f092d><input type="text"${ssrRenderAttr("value", patientSearchDisplay.value)}${ssrRenderAttr("placeholder", unref(t)("searchPatientPlaceholder"))} data-v-c15f092d>`);
        if (showPatientDropdown.value) {
          _push(`<div class="dropdown-list glass-panel" data-v-c15f092d><!--[-->`);
          ssrRenderList(filteredPatients.value, (p) => {
            _push(`<div class="dropdown-item" data-v-c15f092d>${ssrInterpolate(p.name)} (${ssrInterpolate(p.nik)}) </div>`);
          });
          _push(`<!--]-->`);
          if (filteredPatients.value.length === 0) {
            _push(`<div class="dropdown-item text-muted" data-v-c15f092d>${ssrInterpolate(unref(t)("noPatientFound"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="form-group custom-select-wrapper" data-v-c15f092d><label data-v-c15f092d>${ssrInterpolate(unref(t)("servicePoint"))}</label><div class="custom-select" data-v-c15f092d><input type="text"${ssrRenderAttr("value", servicePointSearchDisplay.value)}${ssrRenderAttr("placeholder", unref(t)("searchServicePointPlaceholder"))} data-v-c15f092d>`);
        if (showServicePointDropdown.value) {
          _push(`<div class="dropdown-list glass-panel" data-v-c15f092d><!--[-->`);
          ssrRenderList(filteredServicePoints.value, (sp) => {
            _push(`<div class="dropdown-item" data-v-c15f092d>${ssrInterpolate(sp.name)}</div>`);
          });
          _push(`<!--]-->`);
          if (filteredServicePoints.value.length === 0) {
            _push(`<div class="dropdown-item text-muted" data-v-c15f092d>${ssrInterpolate(unref(t)("noServicePointFound"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="form-group" data-v-c15f092d><label data-v-c15f092d>${ssrInterpolate(unref(t)("status"))}</label><select required data-v-c15f092d><option value="WAITING" data-v-c15f092d${ssrIncludeBooleanAttr(Array.isArray(encounterForm.value.status) ? ssrLooseContain(encounterForm.value.status, "WAITING") : ssrLooseEqual(encounterForm.value.status, "WAITING")) ? " selected" : ""}>${ssrInterpolate(unref(t)("waiting"))}</option><option value="IN_PROGRESS" data-v-c15f092d${ssrIncludeBooleanAttr(Array.isArray(encounterForm.value.status) ? ssrLooseContain(encounterForm.value.status, "IN_PROGRESS") : ssrLooseEqual(encounterForm.value.status, "IN_PROGRESS")) ? " selected" : ""}>${ssrInterpolate(unref(t)("in_progress"))}</option><option value="COMPLETED" data-v-c15f092d${ssrIncludeBooleanAttr(Array.isArray(encounterForm.value.status) ? ssrLooseContain(encounterForm.value.status, "COMPLETED") : ssrLooseEqual(encounterForm.value.status, "COMPLETED")) ? " selected" : ""}>${ssrInterpolate(unref(t)("completed"))}</option></select></div><div class="form-group" data-v-c15f092d><label data-v-c15f092d>${ssrInterpolate(unref(t)("bpjsSepNumber"))}</label><input type="text"${ssrRenderAttr("value", encounterForm.value.bpjsSepNumber)}${ssrRenderAttr("placeholder", unref(t)("optional"))} data-v-c15f092d></div><div class="form-group" data-v-c15f092d><label data-v-c15f092d>${ssrInterpolate(unref(t)("satusehatEncounterId"))}</label><input type="text"${ssrRenderAttr("value", encounterForm.value.satusehatEncounterId)}${ssrRenderAttr("placeholder", unref(t)("optional"))} data-v-c15f092d></div><div class="modal-actions" data-v-c15f092d><button type="button" class="secondary-btn" data-v-c15f092d>${ssrInterpolate(unref(t)("cancel"))}</button><button type="submit" class="primary-btn" data-v-c15f092d>${ssrInterpolate(isEditing.value ? unref(t)("update") : unref(t)("save"))}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="glass-panel content-card" data-v-c15f092d>${ssrInterpolate(unref(t)("loadingEncounters"))}</div>`);
      } else {
        _push(`<div class="glass-panel content-card" data-v-c15f092d><table class="data-table" data-v-c15f092d><thead data-v-c15f092d><tr data-v-c15f092d><th data-v-c15f092d>${ssrInterpolate(unref(t)("patientName"))}</th><th data-v-c15f092d>${ssrInterpolate(unref(t)("servicePoint"))}</th><th data-v-c15f092d>${ssrInterpolate(unref(t)("status"))}</th><th data-v-c15f092d>${ssrInterpolate(unref(t)("bpjsSep"))}</th><th data-v-c15f092d>${ssrInterpolate(unref(t)("satusehatSync"))}</th><th data-v-c15f092d>${ssrInterpolate(unref(t)("date"))}</th><th data-v-c15f092d>${ssrInterpolate(unref(t)("actions"))}</th></tr></thead><tbody data-v-c15f092d><!--[-->`);
        ssrRenderList(encounters.value, (encounter) => {
          var _a, _b, _c, _d, _e;
          _push(`<tr data-v-c15f092d><td data-v-c15f092d>${ssrInterpolate((_b = (_a = encounter.patient) == null ? void 0 : _a.name) != null ? _b : "Unknown")}</td><td data-v-c15f092d>${ssrInterpolate((_d = (_c = encounter.servicePoint) == null ? void 0 : _c.name) != null ? _d : "Unknown")}</td><td data-v-c15f092d><span class="${ssrRenderClass([encounter.status.toLowerCase(), "status-badge"])}" data-v-c15f092d>${ssrInterpolate(unref(t)(encounter.status.toLowerCase()))}</span></td><td data-v-c15f092d>${ssrInterpolate((_e = encounter.bpjsSepNumber) != null ? _e : "-")}</td><td data-v-c15f092d>`);
          if (encounter.satusehatEncounterId) {
            _push(`<span class="sync-badge success" data-v-c15f092d>${ssrInterpolate(unref(t)("synced"))}</span>`);
          } else {
            _push(`<span class="sync-badge pending" data-v-c15f092d>${ssrInterpolate(unref(t)("pending"))}</span>`);
          }
          _push(`</td><td data-v-c15f092d>${ssrInterpolate(unref(formatDateTime)(encounter.createdAt))}</td><td data-v-c15f092d><div class="action-buttons" data-v-c15f092d><button class="icon-btn edit-btn" data-v-c15f092d>\u270F\uFE0F</button><button class="icon-btn delete-btn" data-v-c15f092d>\u{1F5D1}\uFE0F</button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (encounters.value.length === 0) {
          _push(`<tr data-v-c15f092d><td colspan="7" class="empty-state" data-v-c15f092d>${ssrInterpolate(unref(t)("noEncountersFound"))}</td></tr>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/appointments.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const appointments = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c15f092d"]]);

export { appointments as default };
//# sourceMappingURL=appointments-DoXiTzDI.mjs.map
