<template>
  <div class="patients-page">
    <div class="header">
      <h2>{{ t('patients') }}</h2>
      <button class="primary-btn" @click="showAddModal = true">{{ t('addPatient') }}</button>
    </div>

    <!-- ADD PATIENT MODAL -->
    <div class="modal-overlay" v-if="showAddModal">
      <div class="modal-content glass-panel">
        <h3>{{ t('addNewPatient') }}</h3>
        <form @submit.prevent="submitPatient" class="add-form">
          <div class="form-group">
            <label>{{ t('nik') }}</label>
            <input v-model="newPatient.nik" required type="text" />
          </div>
          <div class="form-group">
            <label>{{ t('name') }}</label>
            <input v-model="newPatient.name" required type="text" />
          </div>
          <div class="form-group">
            <label>{{ t('gender') }}</label>
            <select v-model="newPatient.gender" required>
              <option value="M">{{ t('M') }}</option>
              <option value="F">{{ t('F') }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('birthDate') }}</label>
            <input v-model="newPatient.birthDate" required type="date" />
          </div>
          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="showAddModal = false">{{ t('cancel') }}</button>
            <button type="submit" class="primary-btn">{{ t('savePatient') }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="glass-panel content-card" v-if="loading">
      {{ t('loadingPatients') }}
    </div>
    
    <div class="glass-panel content-card" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('nik') }}</th>
            <th>{{ t('name') }}</th>
            <th>{{ t('gender') }}</th>
            <th>{{ t('birthDate') }}</th>
            <th>{{ t('registered') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.nik }}</td>
            <td>{{ patient.name }}</td>
            <td>{{ t(patient.gender) }}</td>
            <td>{{ formatDate(patient.birthDate) }}</td>
            <td>{{ formatDate(patient.createdAt) }}</td>
          </tr>
          <tr v-if="patients.length === 0">
            <td colspan="5" class="empty-state">{{ t('noPatientsFound') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, formatDate } = useI18n()

const patients = ref([])
const loading = ref(true)

const showAddModal = ref(false)
const newPatient = ref({
  nik: '',
  name: '',
  gender: 'M',
  birthDate: ''
})

const fetchPatients = async () => {
  loading.value = true
  try {
    const tenantId = localStorage.getItem('tenantId')
    if (!tenantId) return
    
    const response = await $fetch('/api/v1/patients', {
      headers: {
        'x-tenant-id': tenantId
      }
    })
    
    patients.value = response.data ?? response
  } catch (error) {
    console.error('Error fetching patients', error)
  } finally {
    loading.value = false
  }
}

const submitPatient = async () => {
  try {
    const tenantId = localStorage.getItem('tenantId')
    if (!tenantId) return
    
    await $fetch('/api/v1/patients', {
      method: 'POST',
      headers: {
        'x-tenant-id': tenantId
      },
      body: {
        ...newPatient.value,
        tenantId,
        birthDate: new Date(newPatient.value.birthDate).toISOString()
      }
    })
    
    showAddModal.value = false
    newPatient.value = { nik: '', name: '', gender: 'M', birthDate: '' }
    await fetchPatients()
  } catch (error) {
    console.error('Error creating patient', error)
    alert(t('failedToAddPatient'))
  }
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
.patients-page {
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
  background-color: var(--primary-color, #2563eb);
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
</style>
