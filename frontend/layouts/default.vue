<template>
  <div class="layout-container">
    <aside class="sidebar glass-panel">
      <div class="logo">SIMRS Pro</div>
      <nav>
        <ul>
          <li><NuxtLink to="/">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/patients">Patients</NuxtLink></li>
          <li><NuxtLink to="/appointments">Appointments</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
        </ul>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar glass-panel">
        <div class="tenant-info">
          <h1>{{ tenantName }}</h1>
        </div>
        <div class="user-profile">
          <span>{{ userName }} (Admin)</span>
          <a href="#" @click.prevent="logout" class="logout-link">Logout</a>
        </div>
      </header>
      <div class="page-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tenantName = ref('Loading...')
const userName = ref('')

onMounted(() => {
  const storedTenant = localStorage.getItem('tenantName')
  const storedUser = localStorage.getItem('userName')
  
  if (storedTenant && storedUser) {
    tenantName.value = storedTenant
    userName.value = storedUser
  } else {
    router.push('/login')
  }
})

const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style module>
/* We're using scoped style or CSS modules */
</style>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar nav a {
  text-decoration: none;
  color: var(--text-color);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: block;
  transition: all 0.2s;
  font-weight: 500;
}

.sidebar nav a:hover,
.sidebar nav a.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
}

.logout-link {
  color: #ef4444;
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  background-color: #fee2e2;
  transition: background-color 0.2s;
}

.logout-link:hover {
  background-color: #fca5a5;
}

.page-content {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}
</style>
