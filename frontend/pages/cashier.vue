<template>
  <div class="cashier-page">
    <div class="header">
      <h2>{{ t('cashier') }}</h2>
      <p class="subtitle">Billing, invoicing, and payment processing desk</p>
    </div>

    <div class="main-layout">
      <!-- Billing Queue -->
      <div class="glass-panel queue-panel">
        <div class="panel-header">
          <h3>Billing Queue</h3>
          <p class="section-desc">Completed visits awaiting payment</p>
        </div>

        <div v-if="loadingQueue" class="loading-state">
          Loading billing queue...
        </div>
        <div v-else-if="completedEncounters.length === 0" class="empty-state">
          No patients waiting for billing.
        </div>
        <ul v-else class="queue-list">
          <li 
            v-for="enc in completedEncounters" 
            :key="enc.id" 
            @click="selectEncounter(enc)"
            :class="['queue-item', { active: selectedEncounter && selectedEncounter.id === enc.id }]"
          >
            <div class="queue-item-info">
              <span class="patient-name">{{ enc.patient?.name ?? 'Unknown' }}</span>
              <span class="service-point">{{ enc.servicePoint?.name ?? 'General Clinic' }}</span>
            </div>
            <div class="queue-item-meta">
              <span class="insurance-badge" :class="enc.bpjsSepNumber ? 'bpjs' : 'cash'">
                {{ enc.bpjsSepNumber ? 'BPJS' : 'Cash' }}
              </span>
              <span class="time">{{ formatTime(enc.createdAt) }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Billing Workspace -->
      <div class="glass-panel workspace-panel">
        <div v-if="!selectedEncounter" class="workspace-empty">
          <div class="empty-illustration">💵</div>
          <h3>Select Encounter to Bill</h3>
          <p>Choose a patient from the queue on the left to review charges and process payment</p>
        </div>

        <div v-else class="workspace-content">
          <div class="workspace-header">
            <div class="patient-identity">
              <h3>Invoice for {{ selectedEncounter.patient?.name }}</h3>
              <p class="patient-details">
                NIK: {{ selectedEncounter.patient?.nik }} | 
                Visit Date: {{ formatDate(selectedEncounter.createdAt) }}
              </p>
            </div>
            <div class="actions">
              <button @click="selectedEncounter = null" class="secondary-btn">Close</button>
            </div>
          </div>

          <div class="workspace-body">
            <!-- Medical Summary (if any) -->
            <div class="medical-summary-card" v-if="clinicalNote">
              <h4>Clinical Summary</h4>
              <div v-if="loadingNote" class="loading-state">Loading notes...</div>
              <div v-else-if="!clinicalNote" class="no-notes-alert">
                ⚠️ No clinical notes found for this encounter.
              </div>
              <div v-else class="summary-details">
                <p><strong>Diagnosis:</strong> {{ clinicalNote.diagnosis ?? 'None' }}</p>
                <p><strong>Prescription:</strong> {{ clinicalNote.prescription ?? 'None' }}</p>
              </div>
            </div>

            <!-- Invoice Items Editor -->
            <div class="items-section">
              <div class="section-title-row">
                <h4>Billable Items</h4>
                <button type="button" @click="addInvoiceItem" class="add-item-btn">+ Add Item</button>
              </div>

              <table class="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Axi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in invoiceItems" :key="index">
                    <td>
                      <input type="text" v-model="item.description" placeholder="Item name..." required />
                    </td>
                    <td class="qty-col">
                      <input type="number" v-model.number="item.quantity" min="1" required />
                    </td>
                    <td>
                      <input type="number" v-model.number="item.unitPrice" min="0" required />
                    </td>
                    <td class="price-val">
                      {{ formatCurrency(item.quantity * item.unitPrice) }}
                    </td>
                    <td>
                      <button type="button" @click="removeItem(index)" class="remove-btn">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="total-row">
                <span>Grand Total:</span>
                <span class="total-val">{{ formatCurrency(grandTotal) }}</span>
              </div>
            </div>

            <!-- Payment Details & Processing -->
            <div class="payment-section">
              <h4>Payment Information</h4>
              <div class="payment-form">
                <div class="form-group">
                  <label>Payment Method</label>
                  <select v-model="paymentMethod" @change="onPaymentMethodChange">
                    <option value="CASH">Cash / Debit / Credit</option>
                    <option value="BPJS">BPJS Kesehatan</option>
                    <option value="INSURANCE">Private / Corporate Insurance</option>
                  </select>
                </div>

                <!-- Conditional payment details based on method selection -->
                <div v-if="paymentMethod === 'BPJS'" class="method-alert bpjs-alert">
                  <p><strong>BPJS Claim Authorized</strong></p>
                  <p>SEP Number: <code>{{ selectedEncounter.bpjsSepNumber ?? 'No SEP Number Found' }}</code></p>
                  <p>The patient's bill will be batched and submitted to BPJS Kesehatan for reimbursement.</p>
                </div>

                <div v-if="paymentMethod === 'INSURANCE'" class="insurance-fields">
                  <div class="form-group">
                    <label>Insurance Guarantor Name</label>
                    <input type="text" v-model="guarantorName" placeholder="e.g. Prudential, Allianz" />
                  </div>
                  <div class="form-group">
                    <label>Pre-Auth Letter Reference</label>
                    <input type="text" v-model="guarantorRef" placeholder="e.g. AUTH-88219" />
                  </div>
                </div>

                <div class="form-actions">
                  <button 
                    type="button" 
                    @click="processPayment" 
                    class="primary-btn checkout-submit"
                    :disabled="processing"
                  >
                    {{ processing ? 'Processing...' : 'Complete Transaction & Print Receipt' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Print Modal -->
    <div class="modal-overlay" v-if="showReceipt">
      <div class="modal-content receipt-modal glass-panel">
        <div class="receipt-header">
          <h3>SIMRS Pro Receipt</h3>
          <p>Invoice #: {{ createdInvoice?.id?.substring(0, 8).toUpperCase() }}</p>
        </div>
        <div class="receipt-body">
          <p><strong>Patient:</strong> {{ selectedEncounter?.patient?.name }}</p>
          <p><strong>NIK:</strong> {{ selectedEncounter?.patient?.nik }}</p>
          <p><strong>Date:</strong> {{ formatDateTime(createdInvoice?.createdAt) }}</p>
          <p><strong>Status:</strong> <span class="receipt-status-badge">{{ createdInvoice?.status }}</span></p>
          
          <hr />
          
          <table class="receipt-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in createdInvoice?.items" :key="item.id">
                <td>{{ item.description }}</td>
                <td>{{ item.quantity }}</td>
                <td class="text-right">{{ formatCurrency(item.totalPrice) }}</td>
              </tr>
            </tbody>
          </table>

          <hr />

          <div class="receipt-total-row">
            <span>Grand Total:</span>
            <strong>{{ formatCurrency(createdInvoice?.totalAmount) }}</strong>
          </div>

          <div v-if="createdInvoice?.status === 'PENDING_INSURANCE'" class="receipt-insurance-details">
            <p><strong>Guarantor:</strong> {{ paymentMethod === 'BPJS' ? 'BPJS Kesehatan' : guarantorName }}</p>
            <p v-if="selectedEncounter?.bpjsSepNumber"><strong>SEP #:</strong> {{ selectedEncounter?.bpjsSepNumber }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeReceipt" class="primary-btn">Finish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'

const { t, formatDate, formatDateTime, formatCurrency } = useI18n()
const route = useRoute()

const encounters = ref([])
const selectedEncounter = ref(null)
const loadingQueue = ref(true)
const loadingNote = ref(false)
const processing = ref(false)
const clinicalNote = ref(null)

const invoiceItems = ref([])
const paymentMethod = ref('CASH')
const guarantorName = ref('')
const guarantorRef = ref('')

const showReceipt = ref(false)
const createdInvoice = ref(null)

const completedEncounters = computed(() => {
  return encounters.value.filter(enc => enc.status === 'COMPLETED')
})

const grandTotal = computed(() => {
  return invoiceItems.value.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
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
    
    // Check if we came from doctor workstation with an active encounter redirect
    if (route.query.encounterId) {
      const target = encounters.value.find(e => e.id === route.query.encounterId)
      if (target) {
        selectEncounter(target)
      }
    }
  } catch (error) {
    console.error('Error fetching billing queue', error)
  } finally {
    loadingQueue.value = false
  }
}

const selectEncounter = async (encounter) => {
  selectedEncounter.value = encounter
  clinicalNote.value = null
  
  // Set default invoice items
  invoiceItems.value = [
    { description: 'General Consultation Fee', quantity: 1, unitPrice: 150000 },
    { description: 'Clinic Administration Fee', quantity: 1, unitPrice: 25000 }
  ]
  
  // Set default payment based on BPJS availability
  if (encounter.bpjsSepNumber) {
    paymentMethod.value = 'BPJS'
  } else {
    paymentMethod.value = 'CASH'
  }

  await fetchNotes(encounter.id)
}

const fetchNotes = async (encounterId) => {
  loadingNote.value = true
  try {
    const tenantId = localStorage.getItem('tenantId')
    const response = await $fetch(`/api/v1/encounters/${encounterId}/notes`, {
      headers: {
        'x-tenant-id': tenantId
      }
    })
    const notes = response.data ?? response
    if (notes.length > 0) {
      clinicalNote.value = notes[0]
      
      // Auto-add prescription items to invoice
      if (clinicalNote.value.prescription) {
        invoiceItems.value.push({
          description: `Medication: ${clinicalNote.value.prescription}`,
          quantity: 1,
          unitPrice: 50000 // Mock drug fee placeholder
        })
      }
    }
  } catch (error) {
    console.error('Error fetching clinical notes', error)
  } finally {
    loadingNote.value = false
  }
}

const addInvoiceItem = () => {
  invoiceItems.value.push({
    description: '',
    quantity: 1,
    unitPrice: 0
  })
}

const removeItem = (index) => {
  invoiceItems.value.splice(index, 1)
}

const onPaymentMethodChange = () => {
  guarantorName.value = ''
  guarantorRef.value = ''
}

const processPayment = async () => {
  if (!selectedEncounter.value) return
  processing.value = true
  try {
    const tenantId = localStorage.getItem('tenantId')
    
    let invoiceStatus = 'PAID'
    if (paymentMethod.value === 'BPJS' || paymentMethod.value === 'INSURANCE') {
      invoiceStatus = 'PENDING_INSURANCE'
    }

    const payload = {
      encounterId: selectedEncounter.value.id,
      status: invoiceStatus,
      items: invoiceItems.value
    }

    const res = await $fetch('/api/v1/invoices', {
      method: 'POST',
      headers: { 'x-tenant-id': tenantId },
      body: payload
    })

    createdInvoice.value = res.data ?? res
    showReceipt.value = true
  } catch (error) {
    console.error('Failed processing billing', error)
    alert('Billing processing failed.')
  } finally {
    processing.value = false
  }
}

const closeReceipt = async () => {
  showReceipt.value = false
  createdInvoice.value = null
  selectedEncounter.value = null
  await fetchQueue()
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchQueue()
})
</script>

<style scoped>
.cashier-page {
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
  gap: 0.5rem;
}

.panel-header h3 {
  margin: 0;
}

.section-desc {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0.25rem 0 1rem 0;
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

.insurance-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: bold;
}

.insurance-badge.bpjs {
  background-color: #d1fae5;
  color: #065f46;
}

.insurance-badge.cash {
  background-color: #dbeafe;
  color: #1e40af;
}

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

.workspace-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.medical-summary-card {
  background: #f8fafc;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.medical-summary-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #475569;
}

.summary-details p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.no-notes-alert {
  font-size: 0.85rem;
  color: #b45309;
}

.items-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-row h4 {
  margin: 0;
}

.add-item-btn {
  background: transparent;
  color: var(--primary-color);
  border: 1px dashed var(--primary-color);
  padding: 0.3rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-item-btn:hover {
  background: rgba(37, 99, 235, 0.05);
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th, .items-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.items-table th {
  font-weight: 600;
  font-size: 0.85rem;
  color: #64748b;
}

.items-table input {
  padding: 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  width: 100%;
  box-sizing: border-box;
}

.qty-col input {
  width: 60px;
}

.price-val {
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem 0;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
}

.total-val {
  color: var(--primary-color);
}

.payment-section {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1.5rem;
}

.payment-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
}

.form-group select, .form-group input {
  padding: 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.method-alert {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
}

.bpjs-alert {
  background-color: #ecfdf5;
  border: 1px solid #10b981;
  color: #065f46;
  grid-column: span 2;
}

.insurance-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
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

.secondary-btn {
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.loading-state, .empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 3rem 0;
}

/* Receipt Print Modal styles */
.receipt-modal {
  max-width: 450px;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
}

.receipt-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.receipt-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.receipt-header p {
  color: #64748b;
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
}

.receipt-body {
  font-size: 0.9rem;
}

.receipt-body hr {
  border: 0;
  border-top: 1px dashed #cbd5e1;
  margin: 1rem 0;
}

.receipt-items-table {
  width: 100%;
  border-collapse: collapse;
}

.receipt-items-table th {
  font-size: 0.8rem;
  color: #64748b;
  text-align: left;
}

.receipt-items-table td, .receipt-items-table th {
  padding: 0.5rem 0;
}

.text-right {
  text-align: right;
}

.receipt-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
}

.receipt-insurance-details {
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.receipt-status-badge {
  background-color: #d1fae5;
  color: #065f46;
  font-weight: bold;
  padding: 0.1rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
</style>
