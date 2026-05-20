<template>
  <div class="doctor-page">
    <div class="header">
      <h2>{{ t('doctor') }}</h2>
      <p class="subtitle">Clinical workstation for patient consultations and medical records</p>
    </div>

    <div class="main-layout">
      <!-- Patient Queue -->
      <div class="glass-panel queue-panel">
        <div class="panel-header">
          <h3>Patient Queue</h3>
          <div class="filters">
            <button 
              v-for="s in statuses" 
              :key="s" 
              @click="filterStatus = s" 
              :class="['filter-btn', { active: filterStatus === s }]"
            >
              {{ t(s.toLowerCase()) }}
            </button>
          </div>
        </div>

        <div v-if="loadingQueue" class="loading-state">
          Loading queue...
        </div>
        <div v-else-if="filteredEncounters.length === 0" class="empty-state">
          No patients in queue.
        </div>
        <ul v-else class="queue-list">
          <li 
            v-for="enc in filteredEncounters" 
            :key="enc.id" 
            @click="selectEncounter(enc)"
            :class="['queue-item', { active: selectedEncounter && selectedEncounter.id === enc.id }]"
          >
            <div class="queue-item-info">
              <span class="patient-name">{{ enc.patient?.name ?? 'Unknown' }}</span>
              <span class="service-point">{{ enc.servicePoint?.name ?? 'General Clinic' }}</span>
            </div>
            <div class="queue-item-meta">
              <span :class="['status-indicator', enc.status.toLowerCase()]"></span>
              <span class="time">{{ formatTime(enc.createdAt) }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Consultation Workspace -->
      <div class="glass-panel workspace-panel">
        <div v-if="!selectedEncounter" class="workspace-empty">
          <div class="empty-illustration">🩺</div>
          <h3>No Patient Selected</h3>
          <p>Select a patient from the queue to start the consultation</p>
        </div>

        <div v-else class="workspace-content">
          <div class="workspace-header">
            <div class="patient-identity">
              <h3>{{ selectedEncounter.patient?.name }}</h3>
              <p class="patient-details">
                NIK: {{ selectedEncounter.patient?.nik }} | 
                Gender: {{ t(selectedEncounter.patient?.gender) }} | 
                Age: {{ calculateAge(selectedEncounter.patient?.birthDate) }}
              </p>
            </div>
            <div class="actions">
              <span class="badge" :class="selectedEncounter.status.toLowerCase()">
                {{ t(selectedEncounter.status.toLowerCase()) }}
              </span>
            </div>
          </div>

          <div class="workspace-body">
            <!-- Active Note Form -->
            <div class="form-section">
              <h4>Active Consultation</h4>
              
              <form @submit.prevent="saveConsultation" class="consultation-form">
                <div class="form-group">
                  <label>Symptoms / Chief Complaint</label>
                  <textarea v-model="noteForm.symptoms" placeholder="e.g. Cough, fever for 3 days..." required></textarea>
                </div>

                <div class="form-group">
                  <label>Diagnosis (ICD-10)</label>
                  <input type="text" v-model="noteForm.diagnosis" placeholder="e.g. J00 - Common cold" required>
                </div>

                <div class="form-group">
                  <label>Prescription / Medications</label>
                  <textarea v-model="noteForm.prescription" placeholder="e.g. Paracetamol 500mg 3x1 p.r.n, Amoxicillin 500mg 3x1"></textarea>
                </div>

                <div class="form-group">
                  <label>Clinical Notes / Recommendations</label>
                  <textarea v-model="noteForm.notes" placeholder="e.g. Rest for 3 days, drink plenty of fluids..."></textarea>
                </div>

                <div class="form-group row">
                  <div class="input-half">
                    <label>Encounter Status</label>
                    <select v-model="selectedEncounter.status" required>
                      <option value="WAITING">{{ t('waiting') }}</option>
                      <option value="IN_PROGRESS">{{ t('in_progress') }}</option>
                      <option value="COMPLETED">{{ t('completed') }}</option>
                    </select>
                  </div>
                  
                  <div class="input-half flex-end" v-if="selectedEncounter.status === 'COMPLETED' && roles.includes('CASHIER')">
                    <button type="button" @click="goToCheckout" class="checkout-btn">
                      Proceed to Checkout 💳
                    </button>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="primary-btn" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Consultation' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Notes History -->
            <div class="history-section">
              <h4>Clinical History</h4>
              <div v-if="loadingHistory" class="loading-state">Loading history...</div>
              <div v-else-if="historyNotes.length === 0" class="empty-state">No clinical history recorded for this visit.</div>
              <div v-else class="history-list">
                <div v-for="note in historyNotes" :key="note.id" class="history-card">
                  <div class="history-card-header">
                    <span class="doctor-name">Dr. {{ note.doctor?.name ?? 'Unknown' }}</span>
                    <span class="date">{{ formatDateTime(note.createdAt) }}</span>
                  </div>
                  <div class="history-card-body">
                    <p><strong>Symptoms:</strong> {{ note.symptoms ?? '-' }}</p>
                    <p><strong>Diagnosis:</strong> {{ note.diagnosis ?? '-' }}</p>
                    <p><strong>Prescription:</strong> {{ note.prescription ?? '-' }}</p>
                    <p v-if="note.notes"><strong>Notes:</strong> {{ note.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '~/composables/useI18n'

const { t, formatDateTime } = useI18n()
const router = useRouter()

const encounters = ref([])
const selectedEncounter = ref(null)
const loadingQueue = ref(true)
const loadingHistory = ref(false)
const saving = ref(false)
const historyNotes = ref([])

const statuses = ['WAITING', 'IN_PROGRESS', 'COMPLETED']
const filterStatus = ref('WAITING')
const roles = ref([])

const noteForm = ref({
  symptoms: '',
  diagnosis: '',
  prescription: '',
  notes: ''
})

const filteredEncounters = computed(() => {
  return encounters.value.filter(enc => enc.status === filterStatus.value)
})

const fetchQueue = async () => {
  loadingQueue.value = true
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
    console.error('Error fetching encounters queue', error)
  } finally {
    loadingQueue.value = false
  }
}

const selectEncounter = async (encounter) => {
  selectedEncounter.value = encounter
  noteForm.value = {
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  }
  await fetchHistory(encounter.id)
}

const fetchHistory = async (encounterId) => {
  loadingHistory.value = true
  try {
    const tenantId = localStorage.getItem('tenantId')
    const response = await $fetch(`/api/v1/encounters/${encounterId}/notes`, {
      headers: {
        'x-tenant-id': tenantId
      }
    })
    historyNotes.value = response.data ?? response
    
    // Autofill form if there's an active note already for this encounter
    if (historyNotes.value.length > 0) {
      const latest = historyNotes.value[0]
      noteForm.value = {
        symptoms: latest.symptoms ?? '',
        diagnosis: latest.diagnosis ?? '',
        prescription: latest.prescription ?? '',
        notes: latest.notes ?? ''
      }
    }
  } catch (error) {
    console.error('Error fetching medical history', error)
  } finally {
    loadingHistory.value = false
  }
}

const saveConsultation = async () => {
  if (!selectedEncounter.value) return
  saving.value = true
  try {
    const tenantId = localStorage.getItem('tenantId')
    
    // Save Note
    await $fetch(`/api/v1/encounters/${selectedEncounter.value.id}/notes`, {
      method: 'POST',
      headers: { 'x-tenant-id': tenantId },
      body: {
        ...noteForm.value
      }
    })

    // Update Encounter Status
    await $fetch(`/api/v1/encounters/${selectedEncounter.value.id}`, {
      method: 'PUT',
      headers: { 'x-tenant-id': tenantId },
      body: {
        status: selectedEncounter.value.status
      }
    })

    // Refresh Queue
    await fetchQueue()
    
    // Keep it selected but refresh history
    const updated = encounters.value.find(e => e.id === selectedEncounter.value.id)
    if (updated) {
      selectedEncounter.value = updated
      await fetchHistory(updated.id)
    } else {
      selectedEncounter.value = null
    }

    alert('Consultation saved successfully!')
  } catch (error) {
    console.error('Failed to save consultation', error)
    alert('Failed to save consultation details.')
  } finally {
    saving.value = false
  }
}

const goToCheckout = () => {
  if (!selectedEncounter.value) return
  router.push({
    path: '/cashier',
    query: { encounterId: selectedEncounter.value.id }
  })
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

onMounted(() => {
  fetchQueue()
  
  // Retrieve user roles to handle adaptivity (e.g. Doctor + Cashier roles combo)
  try {
    const storedUser = localStorage.getItem('roles')
    if (storedUser) {
      roles.value = JSON.parse(storedUser)
    } else {
      // Fallback
      roles.value = ['DOCTOR']
    }
  } catch (e) {
    roles.value = ['DOCTOR']
  }
})
</script>

<style scoped>
.doctor-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  color: #64748b;
  margin: 0;
}

.main-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.queue-panel {
  padding: 1.5rem;
  border-radius: 1rem;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header h3 {
  margin: 0 0 0.75rem 0;
}

.filters {
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem;
  border-radius: 0.5rem;
  gap: 0.25rem;
}

.filter-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.filter-btn.active {
  background-color: white;
  color: var(--primary-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.queue-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.queue-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.2s;
}

.queue-item:hover, .queue-item.active {
  background: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);
}

.queue-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.patient-name {
  font-weight: 600;
  color: var(--text-color);
}

.service-point {
  font-size: 0.8rem;
  color: #64748b;
}

.queue-item-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.waiting { background-color: #fbbf24; }
.status-indicator.in_progress { background-color: #3b82f6; }
.status-indicator.completed { background-color: #10b981; }

.time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.workspace-panel {
  padding: 2rem;
  border-radius: 1rem;
  min-height: 60vh;
}

.workspace-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  padding: 4rem 0;
}

.empty-illustration {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.patient-identity h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.patient-details {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.badge.waiting { background-color: #fee2e2; color: #ef4444; }
.badge.in_progress { background-color: #dbeafe; color: #2563eb; }
.badge.completed { background-color: #d1fae5; color: #065f46; }

.workspace-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.consultation-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.row {
  flex-direction: row;
  gap: 1rem;
}

.input-half {
  flex: 1;
}

.flex-end {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.checkout-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.checkout-btn:hover {
  background-color: #059669;
}

.form-group label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.5);
}

.form-group textarea:focus, .form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
}

.form-group input, .form-group select {
  padding: 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.5);
}

.primary-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  background-color: #1d4ed8;
}

.history-section h4, .form-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--text-color);
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 0.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 50vh;
  overflow-y: auto;
}

.history-card {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
}

.history-card-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.doctor-name {
  font-weight: 600;
  color: var(--primary-color);
}

.date {
  color: #64748b;
}

.history-card-body p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
  font-size: 0.9rem;
}

.loading-state {
  text-align: center;
  color: #64748b;
  padding: 2rem;
}
</style>
