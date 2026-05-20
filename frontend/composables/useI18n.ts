import { ref, watch, onMounted } from 'vue'

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Patients',
    appointments: 'Appointments',
    settings: 'Settings',
    logout: 'Logout',
    
    // Overview / Dashboard
    overview: 'Overview',
    welcomeBack: "Welcome back! Here's what's happening today.",
    totalPatients: 'Total Patients',
    activeEncounters: 'Active Encounters',
    pendingEncounters: 'Pending Encounters',
    fromLastWeek: '% from last week',
    recentPatients: 'Recent Patients',
    
    // Patient Fields & Table
    nik: 'NIK',
    name: 'Name',
    gender: 'Gender',
    birthDate: 'Birth Date',
    registered: 'Registered',
    status: 'Status',
    time: 'Time',
    actions: 'Actions',
    noPatientsFound: 'No patients found.',
    loadingPatients: 'Loading patients...',
    
    // Patient Form
    addPatient: 'Add Patient',
    addNewPatient: 'Add New Patient',
    male: 'Male',
    female: 'Female',
    cancel: 'Cancel',
    savePatient: 'Save Patient',
    failedToAddPatient: 'Failed to add patient.',
    
    // Encounters
    appointmentsAndEncounters: 'Appointments & Encounters',
    newEncounter: 'New Encounter',
    editEncounter: 'Edit Encounter',
    addNewEncounter: 'Add New Encounter',
    patient: 'Patient',
    patientName: 'Patient Name',
    searchPatientPlaceholder: 'Search by ID/Name...',
    noPatientFound: 'No patient found',
    servicePoint: 'Service Point',
    searchServicePointPlaceholder: 'Search Service Point...',
    noServicePointFound: 'No service point found',
    bpjsSepNumber: 'BPJS SEP Number',
    satusehatEncounterId: 'SATUSEHAT Encounter ID',
    bpjsSep: 'BPJS SEP',
    satusehatSync: 'SATUSEHAT Sync',
    date: 'Date',
    synced: 'Synced',
    pending: 'Pending',
    loadingEncounters: 'Loading encounters...',
    noEncountersFound: 'No encounters found.',
    save: 'Save',
    update: 'Update',
    deleteEncounterConfirm: 'Are you sure you want to delete this encounter?',
    failedToDeleteEncounter: 'Failed to delete encounter',
    failedToSaveEncounter: 'Failed to save encounter',
    optional: 'Optional',
    

    
    // Settings
    tenantSettings: 'Tenant Settings',
    hospitalInformation: 'Hospital Information',
    hospitalName: 'Hospital Name',
    adminUser: 'Admin User',
    integrationStatus: 'Integration Status',
    bpjsKesehatan: 'BPJS Kesehatan',
    connected: 'Connected',
    satusehatKemenkes: 'SATUSEHAT (Kemenkes)',
    sandboxActive: 'Sandbox Active',
    languagePreferences: 'Language & Formats Preferences',
    selectLanguage: 'Select Language',
    formatPreview: 'Format Preview',
    numberFormat: 'Number Format',
    currencyFormat: 'Currency Format',
    dateFormat: 'Date Format',
    dateTimeFormat: 'Date & Time Format',
    
    // Login
    hospitalAdminLogin: 'Hospital Admin Login',
    signInSubtitle: 'Sign in to manage your tenant',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    loginFailed: 'Login failed. Please check credentials.',
    
    // Statuses & Types
    admitted: 'Admitted',
    discharged: 'Discharged',
    waiting: 'Waiting',
    in_progress: 'In Progress',
    completed: 'Completed',
    M: 'Male',
    F: 'Female'
  },
  id: {
    // Navigation
    dashboard: 'Dasbor',
    patients: 'Pasien',
    appointments: 'Kunjungan',
    settings: 'Pengaturan',
    logout: 'Keluar',
    
    // Overview / Dashboard
    overview: 'Ikhtisar',
    welcomeBack: 'Selamat datang kembali! Berikut adalah perkembangan hari ini.',
    totalPatients: 'Total Pasien',
    activeEncounters: 'Kunjungan Aktif',
    pendingEncounters: 'Kunjungan Menunggu',
    fromLastWeek: '% dari minggu lalu',
    recentPatients: 'Pasien Terbaru',
    
    // Patient Fields & Table
    nik: 'NIK',
    name: 'Nama',
    gender: 'Jenis Kelamin',
    birthDate: 'Tanggal Lahir',
    registered: 'Terdaftar',
    status: 'Status',
    time: 'Waktu',
    actions: 'Aksi',
    noPatientsFound: 'Pasien tidak ditemukan.',
    loadingPatients: 'Memuat data pasien...',
    
    // Patient Form
    addPatient: 'Tambah Pasien',
    addNewPatient: 'Tambah Pasien Baru',
    male: 'Laki-laki',
    female: 'Perempuan',
    cancel: 'Batal',
    savePatient: 'Simpan Pasien',
    failedToAddPatient: 'Gagal menambahkan pasien.',
    
    // Encounters
    appointmentsAndEncounters: 'Kunjungan & Pertemuan',
    newEncounter: 'Kunjungan Baru',
    editEncounter: 'Ubah Kunjungan',
    addNewEncounter: 'Tambah Kunjungan Baru',
    patient: 'Pasien',
    patientName: 'Nama Pasien',
    searchPatientPlaceholder: 'Cari berdasarkan ID/Nama...',
    noPatientFound: 'Pasien tidak ditemukan',
    servicePoint: 'Unit Layanan',
    searchServicePointPlaceholder: 'Cari Unit Layanan...',
    noServicePointFound: 'Unit layanan tidak ditemukan',
    bpjsSepNumber: 'Nomor SEP BPJS',
    satusehatEncounterId: 'ID Kunjungan SATUSEHAT',
    bpjsSep: 'SEP BPJS',
    satusehatSync: 'Sinkronisasi SATUSEHAT',
    date: 'Tanggal',
    synced: 'Tersinkronisasi',
    pending: 'Tertunda',
    loadingEncounters: 'Memuat data kunjungan...',
    noEncountersFound: 'Kunjungan tidak ditemukan.',
    save: 'Simpan',
    update: 'Perbarui',
    deleteEncounterConfirm: 'Apakah Anda yakin ingin menghapus kunjungan ini?',
    failedToDeleteEncounter: 'Gagal menghapus kunjungan',
    failedToSaveEncounter: 'Gagal menyimpan kunjungan',
    optional: 'Opsional',
    
    // Settings
    tenantSettings: 'Pengaturan Tenant',
    hospitalInformation: 'Informasi Rumah Sakit',
    hospitalName: 'Nama Rumah Sakit',
    adminUser: 'Pengguna Admin',
    integrationStatus: 'Status Integrasi',
    bpjsKesehatan: 'BPJS Kesehatan',
    connected: 'Terhubung',
    satusehatKemenkes: 'SATUSEHAT (Kemenkes)',
    sandboxActive: 'Sandbox Aktif',
    languagePreferences: 'Preferensi Bahasa & Format',
    selectLanguage: 'Pilih Bahasa',
    formatPreview: 'Pratinjau Format',
    numberFormat: 'Format Angka',
    currencyFormat: 'Format Mata Uang',
    dateFormat: 'Format Tanggal',
    dateTimeFormat: 'Format Tanggal & Waktu',
    
    // Login
    hospitalAdminLogin: 'Masuk Admin Rumah Sakit',
    signInSubtitle: 'Masuk untuk mengelola tenant Anda',
    email: 'Email',
    password: 'Kata Sandi',
    signIn: 'Masuk',
    loginFailed: 'Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.',
    
    // Statuses & Types
    admitted: 'Dirawat',
    discharged: 'Keluar',
    waiting: 'Menunggu',
    in_progress: 'Dalam Proses',
    completed: 'Selesai',
    M: 'Laki-laki',
    F: 'Perempuan'
  }
}

// Global shared state for locale
const currentLocale = ref<'en' | 'id'>('en')

// Helper to load language from localStorage
const loadLocale = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('locale') as 'en' | 'id' ?? 'en'
    if (saved === 'en' || saved === 'id') {
      currentLocale.value = saved
    }
  }
}

export function useI18n() {
  onMounted(() => {
    loadLocale()
  })

  const setLocale = (locale: 'en' | 'id') => {
    currentLocale.value = locale
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale)
    }
  }

  const t = (key: string): string => {
    const localeDict = translations[currentLocale.value]
    return (localeDict as any)[key] ?? (translations.en as any)[key] ?? key
  }

  const formatNumber = (value: number | string): string => {
    const num = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(num)) return ''
    const localeStr = currentLocale.value === 'id' ? 'id-ID' : 'en-US'
    return new Intl.NumberFormat(localeStr).format(num)
  }

  const formatCurrency = (value: number | string): string => {
    const num = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(num)) return ''
    const localeStr = currentLocale.value === 'id' ? 'id-ID' : 'en-US'
    const formatted = new Intl.NumberFormat(localeStr, {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num)
    return formatted.replace(/^IDR\s?/, 'Rp ').replace(/^Rp\s?/, 'Rp ')
  }

  const formatDate = (date: Date | string): string => {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    if (currentLocale.value === 'id') {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(d)
    } else {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium'
      }).format(d)
    }
  }

  const formatDateTime = (date: Date | string): string => {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    if (currentLocale.value === 'id') {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d)
    } else {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(d)
    }
  }

  return {
    locale: currentLocale,
    setLocale,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateTime
  }
}
