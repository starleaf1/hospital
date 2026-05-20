<template>
  <div class="login-container">
    <div class="floating-lang-selector">
      <button 
        class="lang-btn" 
        :class="{ active: locale === 'en' }" 
        @click="setLocale('en')"
      >
        🇺🇸 EN
      </button>
      <button 
        class="lang-btn" 
        :class="{ active: locale === 'id' }" 
        @click="setLocale('id')"
      >
        🇮🇩 ID
      </button>
    </div>

    <div class="login-card glass-panel">
      <div class="logo">SIMRS Pro</div>
      <h2>{{ t('hospitalAdminLogin') }}</h2>
      <p class="subtitle">{{ t('signInSubtitle') }}</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>{{ t('email') }}</label>
          <input type="email" v-model="email" placeholder="admin@citycentral.com" required />
        </div>
        <div class="form-group">
          <label>{{ t('password') }}</label>
          <input type="password" v-model="password" placeholder="••••••••" required />
        </div>
        <button type="submit" class="login-btn">{{ t('signIn') }}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '~/composables/useI18n'

definePageMeta({
  layout: false // Do not use the dashboard layout for login page
})

const router = useRouter()
const email = ref('admin@citycentral.com')
const password = ref('admin123')

const { locale, setLocale, t } = useI18n()

const handleLogin = async () => {
  try {
    const response = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    
    // Store in localStorage for simplicity
    localStorage.setItem('tenantId', response.tenantId)
    localStorage.setItem('userName', response.name)
    localStorage.setItem('tenantName', response.tenantName)
    localStorage.setItem('userRoles', JSON.stringify(response.roles ?? []))
    
    router.push('/')
  } catch (error) {
    console.error('Login failed', error)
    alert(t('loginFailed'))
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%);
  position: relative;
}

.floating-lang-selector {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.25rem;
  border-radius: 0.5rem;
  gap: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.lang-btn {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.lang-btn:hover {
  color: var(--text-color);
}

.lang-btn.active {
  background-color: white;
  color: var(--primary-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

input {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.login-btn {
  margin-top: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #1d4ed8;
}
</style>
