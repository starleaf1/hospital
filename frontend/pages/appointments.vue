<template>
  <div class="appointments-page">
    <div class="header">
      <h2>{{ t('appointmentsAndEncounters') }}</h2>
      <button class="primary-btn" @click="openAddModal">{{ t('newEncounter') }}</button>
    </div>

    <!-- ADD/EDIT ENCOUNTER MODAL -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-content glass-panel">
        <h3>{{ isEditing ? t('editEncounter') : t('addNewEncounter') }}</h3>
        <form @submit.prevent="submitEncounter" class="add-form">
          <div class="form-group custom-select-wrapper">
            <label>{{ t('patient') }}</label>
            <div class="custom-select" @click.stop="showPatientDropdown = true">
              <input 
                type="text" 
                :value="patientSearchDisplay" 
                @input="onPatientSearchInput"
                :placeholder="t('searchPatientPlaceholder')" 
                @focus="showPatientDropdown = true"
              />
              <div class="dropdown-list glass-panel" v-if="showPatientDropdown">
                <div 
                  class="dropdown-item" 
                  v-for="p in filteredPatients" 
                  :key="p.id" 
                  @click.stop="selectPatient(p)"
                >
                  {{ p.name }} ({{ p.nik }})
                </div>
                <div v-if="filteredPatients.length === 0" class="dropdown-item text-muted">{{ t('noPatientFound') }}</div>
              </div>
            </div>
          </div>
          
          <div class="form-group custom-select-wrapper">
            <label>{{ t('servicePoint') }}</label>
            <div class="custom-select" @click.stop="showServicePointDropdown = true">
              <input 
                type="text" 
                :value="servicePointSearchDisplay"
                @input="onServicePointSearchInput"
                :placeholder="t('searchServicePointPlaceholder')" 
                @focus="showServicePointDropdown = true"
              />
              <div class="dropdown-list glass-panel" v-if="showServicePointDropdown">
                <div 
                  class="dropdown-item" 
                  v-for="sp in filteredServicePoints" 
                  :key="sp.id" 
                  @click.stop="selectServicePoint(sp)"
                >
                  {{ sp.name }}
                </div>
                <div v-if="filteredServicePoints.length === 0" class="dropdown-item text-muted">{{ t('noServicePointFound') }}</div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('status') }}</label>
            <select v-model="encounterForm.status" required>
              <option value="WAITING">{{ t('waiting') }}</option>
              <option value="IN_PROGRESS">{{ t('in_progress') }}</option>
              <option value="COMPLETED">{{ t('completed') }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>{{ t('bpjsSepNumber') }}</label>
            <input type="text" v-model="encounterForm.bpjsSepNumber" :placeholder="t('optional')" />
          </div>

          <div class="form-group">
            <label>{{ t('satusehatEncounterId') }}</label>
            <input type="text" v-model="encounterForm.satusehatEncounterId" :placeholder="t('optional')" />
          </div>

          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="closeModal">{{ t('cancel') }}</button>
            <button type="submit" class="primary-btn">{{ isEditing ? t('update') : t('save') }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="glass-panel content-card" v-if="loading">
      {{ t('loadingEncounters') }}
    </div>
    
    <div class="glass-panel content-card" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('patientName') }}</th>
            <th>{{ t('servicePoint') }}</th>
            <th>{{ t('status') }}</th>
            <th>{{ t('bpjsSep') }}</th>
            <th>{{ t('satusehatSync') }}</th>
            <th>{{ t('date') }}</th>
            <th>{{ t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="encounter in encounters" :key="encounter.id">
            <td>{{ encounter.patient?.name ?? 'Unknown' }}</td>
            <td>{{ encounter.servicePoint?.name ?? 'Unknown' }}</td>
            <td>
              <span class="status-badge" :class="encounter.status.toLowerCase()">
                {{ t(encounter.status.toLowerCase()) }}
              </span>
            </td>
            <td>{{ encounter.bpjsSepNumber ?? '-' }}</td>
            <td>
              <span v-if="encounter.satusehatEncounterId" class="sync-badge success">{{ t('synced') }}</span>
              <span v-else class="sync-badge pending">{{ t('pending') }}</span>
            </td>
            <td>{{ formatDateTime(encounter.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button class="icon-btn edit-btn" @click="openEditModal(encounter)">✏️</button>
                <button class="icon-btn delete-btn" @click="deleteEncounter(encounter.id)">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="encounters.length === 0">
            <td colspan="7" class="empty-state">{{ t('noEncountersFound') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, formatDateTime } = useI18n()

const encounters = ref([])
const patients = ref([])
const servicePoints = ref([])
const loading = ref(true)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Searchable dropdown state
const patientSearch = ref('')
const patientSearchDisplay = ref('')
const servicePointSearch = ref('')
const servicePointSearchDisplay = ref('')
const showPatientDropdown = ref(false)
const showServicePointDropdown = ref(false)

const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const updatePatientSearch = debounce((val) => {
  patientSearch.value = val
}, 300)

const onPatientSearchInput = (e) => {
  patientSearchDisplay.value = e.target.value
  updatePatientSearch(e.target.value)
}

const updateServicePointSearch = debounce((val) => {
  servicePointSearch.value = val
}, 300)

const onServicePointSearchInput = (e) => {
  servicePointSearchDisplay.value = e.target.value
  updateServicePointSearch(e.target.value)
}

const filteredPatients = computed(() => {
  if (!patientSearch.value) return patients.value
  const query = patientSearch.value.toLowerCase()
  return patients.value.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.nik.includes(query)
  )
})

const filteredServicePoints = computed(() => {
  if (!servicePointSearch.value) return servicePoints.value
  const query = servicePointSearch.value.toLowerCase()
  return servicePoints.value.filter(sp => 
    sp.name.toLowerCase().includes(query)
  )
})

const selectPatient = (patient) => {
  encounterForm.value.patientId = patient.id
  patientSearchDisplay.value = `${patient.name} (${patient.nik})`
  patientSearch.value = patientSearchDisplay.value
  showPatientDropdown.value = false
}

const selectServicePoint = (sp) => {
  encounterForm.value.servicePointId = sp.id
  servicePointSearchDisplay.value = sp.name
  servicePointSearch.value = servicePointSearchDisplay.value
  showServicePointDropdown.value = false
}

const closeDropdowns = () => {
  showPatientDropdown.value = false
  showServicePointDropdown.value = false
}

const encounterForm = ref({
  patientId: '',
  servicePointId: '',
  status: 'WAITING',
  bpjsSepNumber: '',
  satusehatEncounterId: ''
})

const fetchEncounters = async () => {
  loading.value = true
  try {
    const tenantId = localStorage.getItem('tenantId')
    if (!tenantId) return
    
    const response = await $fetch('/api/v1/encounters', {
      headers: {
        'x-tenant-id': tenantId
      }
    })
    
    encounters.value = response.data ?? response
  } catch (error) {
    console.error('Error fetching encounters', error)
  } finally {
    loading.value = false
  }
}

const loadDependencies = async () => {
  const tenantId = localStorage.getItem('tenantId')
  if (!tenantId) return
  
  try {
    const ptsRes = await $fetch('/api/v1/patients', { headers: { 'x-tenant-id': tenantId } })
    patients.value = ptsRes.data ?? ptsRes
  } catch (err) {
    console.error('Failed to load patients', err)
  }

  try {
    const spsRes = await $fetch('/api/v1/service-points', { headers: { 'x-tenant-id': tenantId } })
    servicePoints.value = spsRes.data ?? spsRes
  } catch (err) {
    console.error('Failed to load service points, using mock fallback', err)
    servicePoints.value = [
      { id: 'mock-1', name: 'Poliklinik Umum' },
      { id: 'mock-2', name: 'Poliklinik Anak' },
      { id: 'mock-3', name: 'IGD (Emergency)' }
    ]
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  encounterForm.value = {
    patientId: '',
    servicePointId: '',
    status: 'WAITING',
    bpjsSepNumber: '',
    satusehatEncounterId: ''
  }
  patientSearchDisplay.value = ''
  patientSearch.value = ''
  servicePointSearchDisplay.value = ''
  servicePointSearch.value = ''
  showModal.value = true
}

const openEditModal = (encounter) => {
  isEditing.value = true
  editingId.value = encounter.id
  encounterForm.value = {
    patientId: encounter.patientId,
    servicePointId: encounter.servicePointId,
    status: encounter.status,
    bpjsSepNumber: encounter.bpjsSepNumber ?? '',
    satusehatEncounterId: encounter.satusehatEncounterId ?? ''
  }
  
  const patient = patients.value.find(p => p.id === encounter.patientId)
  if (patient) {
    patientSearchDisplay.value = `${patient.name} (${patient.nik})`
    patientSearch.value = patientSearchDisplay.value
  }
  
  const sp = servicePoints.value.find(s => s.id === encounter.servicePointId)
  if (sp) {
    servicePointSearchDisplay.value = sp.name
    servicePointSearch.value = servicePointSearchDisplay.value
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitEncounter = async () => {
  try {
    const tenantId = localStorage.getItem('tenantId')
    if (!tenantId) return
    
    const payload = {
      ...encounterForm.value,
      tenantId
    }

    if (isEditing.value) {
      await $fetch(`/api/v1/encounters/${editingId.value}`, {
        method: 'PUT',
        headers: { 'x-tenant-id': tenantId },
        body: payload
      })
    } else {
      await $fetch('/api/v1/encounters', {
        method: 'POST',
        headers: { 'x-tenant-id': tenantId },
        body: payload
      })
    }
    
    closeModal()
    await fetchEncounters()
  } catch (error) {
    console.error('Error saving encounter', error)
    alert(t('failedToSaveEncounter'))
  }
}

const deleteEncounter = async (id) => {
  if (!confirm(t('deleteEncounterConfirm'))) return
  
  try {
    const tenantId = localStorage.getItem('tenantId')
    await $fetch(`/api/v1/encounters/${id}`, {
      method: 'DELETE',
      headers: { 'x-tenant-id': tenantId }
    })
    await fetchEncounters()
  } catch (error) {
    console.error('Error deleting encounter', error)
    alert(t('failedToDeleteEncounter'))
  }
}

onMounted(() => {
  fetchEncounters()
  loadDependencies()
  document.addEventListener('click', closeDropdowns)
})


onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
.appointments-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #1d4ed8;
}

.content-card {
  padding: 1.5rem;
  border-radius: 1rem;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.data-table th {
  font-weight: 600;
  color: #64748b;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 2rem !important;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.completed { background: #d1fae5; color: #065f46; }
.status-badge.in_progress { background: #dbeafe; color: #1e40af; }
.status-badge.waiting { background: #fef3c7; color: #92400e; }

.sync-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: bold;
}
.sync-badge.success { background-color: #10b981; color: white; }
.sync-badge.pending { background-color: #fbbf24; color: white; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.icon-btn:hover {
  opacity: 1;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #475569;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.secondary-btn {
  background-color: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn:hover {
  background-color: #f1f5f9;
}

.custom-select-wrapper {
  position: relative;
}

.custom-select {
  position: relative;
}

.custom-select input {
  width: 100%;
  box-sizing: border-box;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  z-index: 1050;
  margin-top: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}

.text-muted {
  color: #94a3b8;
  cursor: default;
}
.text-muted:hover {
  background-color: transparent;
}
</style>
