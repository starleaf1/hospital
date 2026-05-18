<template>
  <div class="login-container">
    <div class="login-card glass-panel">
      <div class="logo">SIMRS Pro</div>
      <h2>Hospital Admin Login</h2>
      <p class="subtitle">Sign in to manage your tenant</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="admin@citycentral.com" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="••••••••" required />
        </div>
        <button type="submit" class="login-btn">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false // Do not use the dashboard layout for login page
})

const router = useRouter()
const email = ref('admin@citycentral.com')
const password = ref('admin123')

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
    
    router.push('/')
  } catch (error) {
    console.error('Login failed', error)
    alert('Login failed. Please check credentials.')
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
