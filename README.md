# Multi-Tenant HMS Architecture & Compliance Sandbox

An open-source architectural blueprint and research prototype designed to explore data isolation and out-of-band synchronization pipelines for regional healthcare compliance frameworks (**SATUSEHAT & BPJS Kesehatan**).

## 🚀 Project Intent & Disclaimer
*   **Status:** Architectural Draft / Research Prototype.
*   **Purpose:** This repository serves as a high-level system design study mapping out multi-tenant database schemas and asynchronous compliance sync workflows. It is **not** a turnkey production system, but rather an infrastructure sandbox testing how to handle volatile government API latencies without degrading local clinic operations.

---

## ⚡ Technical Case Study: BPJS & SATUSEHAT Asynchronous Sync

### The Challenge
Interfacing with rigid regional healthcare compliance APIs (SATUSEHAT/BPJS) introduces severe systemic risks:
1.  **Network Volatility:** External government endpoints can exhibit unpredictable latency spikes or temporary outages.
2.  **Blocking Operations:** If a clinic’s point-of-sale or medical entry system waits synchronously for a response from the government API before printing a prescription or clearing a queue, the entire physical clinic operation grinds to a halt during an internet dip.

### The Solution: Event-Driven Out-of-Band Sync
To insulate local clinic availability from external infrastructure degradation, this architecture isolates the compliance pipeline into an asynchronous event loop backed by PostgreSQL and background processing.

    [ Doctor Closes Encounter ] ────> [ Database Commit (State: PENDING_SYNC) ] ────> [ UI Instantly Unblocks ]
                                                                                             │
       ┌─────────────────────────────────────────────────────────────────────────────────────┘
       ▼
    [ Background Event Worker ] ───> [ Throttles & Formats Payload ] ───> [ SATUSEHAT / BPJS API ]
                                                                                 │
                 ┌─────────────────────── Success / Failure ─────────────────────┤
                 ▼                                                               ▼
     [ Update State: SYNCED ]                                        [ Execute Backoff Retry ]

1.  **Non-Blocking Commitment:** When a medical encounter or billing cycle is closed, the state is immediately committed locally with a metadata flag: `sync_status: PENDING_SYNC`. The system instantly unblocks the UI for the doctor or administrative staff.
2.  **Isolated Queue Processing:** A background worker polls the staging ledger, transforms the data structure into the rigid JSON formatting mandated by Kemenkes/BPJS, and throttles outbound payloads to respect regional rate limiting.
3.  **Fault Tolerance:** If the government endpoint drops or times out, the local transaction is *not* rolled back. The background worker logs the network failure code and schedules an exponential backoff retry pipeline, keeping the local operational database fast and responsive.

---

# [Bahasa Indonesia] Blueprint Arsitektur HMS Multi-Tenant & Compliance Sandbox

Prototype riset dan blueprint arsitektur open-source yang dirancang untuk mengeksplorasi isolasi data serta pipeline sinkronisasi otomatis (*out-of-band*) untuk kepatuhan regulasi kesehatan nasional (**SATUSEHAT Kemenkes & BPJS Kesehatan**).

## 🚀 Intensi Proyek & Disclaimer
*   **Status:** Arsitektur Draft / Prototype Riset.
*   **Tujuan:** Repositori ini berfungsi sebagai studi desain sistem tingkat tinggi untuk memetakan skema database multi-tenant dan alur kerja sinkronisasi kepatuhan asinkron. Ini **bukan** sistem produksi siap pakai, melainkan sebuah sandbox infrastruktur untuk menguji bagaimana menangani latensi API pemerintah yang tidak menentu tanpa mengganggu operasional klinik lokal.

---

## ⚡ Studi Kasus Teknis: Sinkronisasi Asinkron BPJS & SATUSEHAT

### Tantangan Utama
Berinteraksi dengan API regulasi kesehatan nasional (SATUSEHAT/BPJS) membawa risiko sistemik yang cukup besar:
1.  **Ketidakstabilan Jaringan:** Endpoint eksternal milik instansi pemerintah seringkali mengalami lonjakan latensi yang tidak dapat diprediksi atau gangguan sementara.
2.  **Blocking Operations:** Jika sistem kasir atau entri rekam medis klinik harus menunggu respons sinkron dari API pemerintah sebelum mencetak resep atau menyelesaikan antrean, seluruh operasional fisik klinik akan terhenti selama koneksi internet melambat.

### Solusi: Event-Driven Out-of-Band Sync
Untuk melindungi ketersediaan sistem di klinik lokal dari penurunan performa infrastruktur luar, arsitektur ini mengisolasi proses sinkronisasi regulasi ke dalam *asynchronous event loop* yang didukung oleh PostgreSQL dan pemrosesan latar belakang (*background processing*).

1.  **Pengiriman Data secara Non-Blocking:** Ketika sesi medis (*medical encounter*) atau siklus penagihan ditutup, data langsung disimpan secara lokal dengan flag metadata: `sync_status: PENDING_SYNC`. Sistem seketika itu juga membuka kunci antarmuka (UI) sehingga dokter atau staf administrasi bisa melanjutkan pekerjaan tanpa menunggu.
2.  **Pemrosesan Antrean Terisolasi:** _Background worker_ memantau data yang tertunda, mentransformasikan struktur data ke dalam format JSON kaku yang diwajibkan oleh Kemenkes/BPJS, dan mengatur kecepatan pengiriman (*throttling*) untuk menghormati batasan *rate limiting* regional.
3.  **Toleransi Kesalahan (Fault Tolerance):** Jika endpoint pemerintah mengalami gangguan atau *timeout*, transaksi lokal *tidak* akan dibatalkan (*rollbacked*). Worker latar belakang akan mencatat kode kegagalan jaringan dan menjadwalkan pipa percobaan ulang otomatis dengan skema *exponential backoff*, menjaga database operasional lokal tetap cepat dan responsif.

---

## 🛠️ Tech Stack & Infrastructure
*   **Language Runtime:** TypeScript / Node.js
*   **Database & ORM:** PostgreSQL (Neon Serverless) + Prisma ORM
*   **Deployment Pipeline:** Google Cloud Platform (GCP) Cloud Run
*   **State Management & Caching:** Redis

---

## ⚙️ Quick Start (Local Development)

    # 1. Clone & Install Dependencies
    npm install

    # 2. Run Infrastructure via Docker
    docker-compose up -d

    # 3. Apply Prisma Schema & Seed Sandbox Data
    npx prisma migrate dev
    npx prisma db seed

    # 4. Boot Dev Environment
    npm run dev