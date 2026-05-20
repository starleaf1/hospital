<template>
  <div class="dashboard">
    <div class="header">
      <h2>{{ t('overview') }}</h2>
      <p>{{ t('welcomeBack') }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass-panel" v-for="stat in stats" :key="stat.label">
        <div class="stat-value">{{ formatNumber(stat.value) }}</div>
        <div class="stat-label">{{ t(getTranslationKey(stat.label)) }}</div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'positive' : 'negative'">
          {{ stat.trend > 0 ? '+' : '' }}{{ formatNumber(stat.trend) }}{{ t('fromLastWeek') }}
        </div>
      </div>
    </div>

    <div class="recent-activity glass-panel">
      <h3>{{ t('recentPatients') }}</h3>
      <table class="activity-table">
        <thead>
          <tr>
            <th>{{ t('name') }}</th>
            <th>{{ t('nik') }}</th>
            <th>{{ t('status') }}</th>
            <th>{{ t('time') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in recentPatients" :key="patient.id">
            <td>{{ patient.name }}</td>
            <td>{{ patient.id }}</td>
            <td><span class="status-badge" :class="patient.status.toLowerCase()">{{ t(patient.status.toLowerCase()) }}</span></td>
            <td>{{ formatDateTime(patient.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t, formatNumber, formatDateTime } = useI18n()

const stats = ref([])
const recentPatients = ref([])
const loading = ref(true)

const getTranslationKey = (label) => {
  if (label === 'Total Patients') return 'totalPatients'
  if (label === 'Active Encounters') return 'activeEncounters'
  if (label === 'Pending Encounters') return 'pendingEncounters'
  return label
}

onMounted(async () => {
  try {
    const tenantId = localStorage.getItem('tenantId')
    if (!tenantId) return
    
    const response = await $fetch('/api/v1/dashboard/stats', {
      headers: {
        'x-tenant-id': tenantId
      }
    })
    
    stats.value = response.stats
    recentPatients.value = response.recentPatients.map(p => ({
      name: p.name,
      id: p.id.substring(0, 8).toUpperCase(),
      status: 'Admitted', // simplified for now
      createdAt: p.createdAt
    }))
  } catch (error) {
    console.error('Error fetching dashboard stats', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.header p {
  margin: 0;
  color: #64748b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
}

.stat-trend {
  font-size: 0.875rem;
  font-weight: 500;
}
.stat-trend.positive { color: #10b981; }
.stat-trend.negative { color: #ef4444; }

.recent-activity {
  padding: 1.5rem;
  border-radius: 1rem;
}

.recent-activity h3 {
  margin: 0 0 1rem 0;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th,
.activity-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.activity-table th {
  font-weight: 600;
  color: #64748b;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.admitted { background: #dbeafe; color: #1e40af; }
.status-badge.discharged { background: #d1fae5; color: #065f46; }
.status-badge.waiting { background: #fef3c7; color: #92400e; }
</style>
