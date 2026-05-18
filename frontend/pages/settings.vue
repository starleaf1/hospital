<template>
  <div class="settings-page">
    <div class="header">
      <h2>Tenant Settings</h2>
    </div>

    <div class="settings-grid">
      <div class="glass-panel settings-card">
        <h3>Hospital Information</h3>
        <div class="form-group">
          <label>Hospital Name</label>
          <input type="text" :value="tenantName" disabled />
        </div>
        <div class="form-group">
          <label>Admin User</label>
          <input type="text" :value="userName" disabled />
        </div>
      </div>

      <div class="glass-panel settings-card">
        <h3>Integration Status</h3>
        <ul class="integration-list">
          <li>
            <span class="integration-name">BPJS Kesehatan</span>
            <span class="status-indicator active">Connected</span>
          </li>
          <li>
            <span class="integration-name">SATUSEHAT (Kemenkes)</span>
            <span class="status-indicator active">Sandbox Active</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tenantName = ref('')
const userName = ref('')

onMounted(() => {
  tenantName.value = localStorage.getItem('tenantName') || ''
  userName.value = localStorage.getItem('userName') || ''
})
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  color: #64748b;
  font-size: 1rem;
}

.integration-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.integration-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.integration-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.integration-name {
  font-weight: 500;
}

.status-indicator {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
}

.status-indicator.active {
  background-color: #d1fae5;
  color: #065f46;
}
</style>
