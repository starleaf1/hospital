<template>
  <div class="appointments-page">
    <div class="header">
      <h2>Appointments & Encounters</h2>
      <button class="primary-btn" @click="openAddModal">New Encounter</button>
    </div>

    <!-- ADD/EDIT ENCOUNTER MODAL -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-content glass-panel">
        <h3>{{ isEditing ? 'Edit Encounter' : 'Add New Encounter' }}</h3>
        <form @submit.prevent="submitEncounter" class="add-form">
          <div class="form-group">
            <label>Patient</label>
            <select v-model="encounterForm.patientId" required>
              <option value="" disabled>Select Patient</option>
              <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }} ({{ p.nik }})</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Service Point</label>
            <select v-model="encounterForm.servicePointId" required>
              <option value="" disabled>Select Service Point</option>
              <option v-for="sp in servicePoints" :key="sp.id" :value="sp.id">{{ sp.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="encounterForm.status" required>
              <option value="WAITING">WAITING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>BPJS SEP Number</label>
            <input type="text" v-model="encounterForm.bpjsSepNumber" placeholder="Optional" />
          </div>

          <div class="form-group">
            <label>SATUSEHAT Encounter ID</label>
            <input type="text" v-model="encounterForm.satusehatEncounterId" placeholder="Optional" />
          </div>

          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="closeModal">Cancel</button>
            <button type="submit" class="primary-btn">{{ isEditing ? 'Update' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="glass-panel content-card" v-if="loading">
      Loading encounters...
    </div>
    
    <div class="glass-panel content-card" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Service Point</th>
            <th>Status</th>
            <th>BPJS SEP</th>
            <th>SATUSEHAT Sync</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="encounter in encounters" :key="encounter.id">
            <td>{{ encounter.patient?.name ?? 'Unknown' }}</td>
            <td>{{ encounter.servicePoint?.name ?? 'Unknown' }}</td>
            <td>
              <span class="status-badge" :class="encounter.status.toLowerCase()">
                {{ encounter.status }}
              </span>
            </td>
            <td>{{ encounter.bpjsSepNumber || '-' }}</td>
            <td>
              <span v-if="encounter.satusehatEncounterId" class="sync-badge success">Synced</span>
              <span v-else class="sync-badge pending">Pending</span>
            </td>
            <td>{{ new Date(encounter.createdAt).toLocaleString() }}</td>
            <td>
              <div class="action-buttons">
                <button class="icon-btn edit-btn" @click="openEditModal(encounter)">✏️</button>
                <button class="icon-btn delete-btn" @click="deleteEncounter(encounter.id)">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="encounters.length === 0">
            <td colspan="7" class="empty-state">No encounters found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const encounters = ref([])
const patients = ref([])
const servicePoints = ref([])
const loading = ref(true)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

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
  try {
    const tenantId = localStorage.getItem('tenantId')
    if (!tenantId) return
    
    const [ptsRes, spsRes] = await Promise.all([
      $fetch('/api/v1/patients', { headers: { 'x-tenant-id': tenantId } }),
      $fetch('/api/v1/service-points', { headers: { 'x-tenant-id': tenantId } })
    ])
    
    patients.value = ptsRes.data ?? ptsRes
    servicePoints.value = spsRes.data ?? spsRes
  } catch (err) {
    console.error('Failed to load dependencies', err)
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
  showModal.value = true
}

const openEditModal = (encounter) => {
  isEditing.value = true
  editingId.value = encounter.id
  encounterForm.value = {
    patientId: encounter.patientId,
    servicePointId: encounter.servicePointId,
    status: encounter.status,
    bpjsSepNumber: encounter.bpjsSepNumber || '',
    satusehatEncounterId: encounter.satusehatEncounterId || ''
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
    alert('Failed to save encounter')
  }
}

const deleteEncounter = async (id) => {
  if (!confirm('Are you sure you want to delete this encounter?')) return
  
  try {
    const tenantId = localStorage.getItem('tenantId')
    await $fetch(`/api/v1/encounters/${id}`, {
      method: 'DELETE',
      headers: { 'x-tenant-id': tenantId }
    })
    await fetchEncounters()
  } catch (error) {
    console.error('Error deleting encounter', error)
    alert('Failed to delete encounter')
  }
}

onMounted(() => {
  fetchEncounters()
  loadDependencies()
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
</style>
