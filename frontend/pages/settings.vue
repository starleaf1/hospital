<template>
  <div class="settings-page">
    <div class="header">
      <h2>{{ t('tenantSettings') }}</h2>
    </div>

    <div class="settings-grid">
      <div class="glass-panel settings-card">
        <h3>{{ t('hospitalInformation') }}</h3>
        <div class="form-group">
          <label>{{ t('hospitalName') }}</label>
          <input type="text" :value="tenantName" disabled />
        </div>
        <div class="form-group">
          <label>{{ t('adminUser') }}</label>
          <input type="text" :value="userName" disabled />
        </div>
      </div>

      <div class="glass-panel settings-card">
        <h3>{{ t('integrationStatus') }}</h3>
        <ul class="integration-list">
          <li>
            <span class="integration-name">{{ t('bpjsKesehatan') }}</span>
            <span class="status-indicator active">{{ t('connected') }}</span>
          </li>
          <li>
            <span class="integration-name">{{ t('satusehatKemenkes') }}</span>
            <span class="status-indicator active">{{ t('sandboxActive') }}</span>
          </li>
        </ul>
      </div>

      <div class="glass-panel settings-card">
        <h3>{{ t('languagePreferences') }}</h3>
        <div class="form-group">
          <label>{{ t('selectLanguage') }}</label>
          <div class="language-buttons">
            <button 
              type="button" 
              class="lang-preview-btn" 
              :class="{ active: locale === 'en' }" 
              @click="setLocale('en')"
            >
              🇺🇸 English
            </button>
            <button 
              type="button" 
              class="lang-preview-btn" 
              :class="{ active: locale === 'id' }" 
              @click="setLocale('id')"
            >
              🇮🇩 Bahasa Indonesia
            </button>
          </div>
        </div>

        <div class="format-preview-section">
          <h4>{{ t('formatPreview') }}</h4>
          <div class="preview-row">
            <span>{{ t('numberFormat') }}:</span>
            <strong>{{ formatNumber(1234567.89) }}</strong>
          </div>
          <div class="preview-row">
            <span>{{ t('currencyFormat') }}:</span>
            <strong class="currency-highlight">{{ formatCurrency(1234567.89) }}</strong>
          </div>
          <div class="preview-row">
            <span>{{ t('dateFormat') }}:</span>
            <strong>{{ formatDate(new Date()) }}</strong>
          </div>
          <div class="preview-row">
            <span>{{ t('dateTimeFormat') }}:</span>
            <strong>{{ formatDateTime(new Date()) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { locale, setLocale, t, formatNumber, formatCurrency, formatDate, formatDateTime } = useI18n()

const tenantName = ref('')
const userName = ref('')

onMounted(() => {
  tenantName.value = localStorage.getItem('tenantName') ?? ''
  userName.value = localStorage.getItem('userName') ?? ''
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

.language-buttons {
  display: flex;
  gap: 0.5rem;
}

.lang-preview-btn {
  flex: 1;
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  color: #475569;
}

.lang-preview-btn:hover {
  background-color: #f8fafc;
  border-color: #94a3b8;
}

.lang-preview-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.format-preview-section {
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid #e2e8f0;
  margin-top: 0.5rem;
}

.format-preview-section h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  color: #475569;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
}

.preview-row strong {
  color: #0f172a;
}

.preview-row .currency-highlight {
  color: #10b981;
}
</style>
