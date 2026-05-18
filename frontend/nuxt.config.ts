export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/api/**': { proxy: 'http://localhost:8080/api/**' }
  }
})
