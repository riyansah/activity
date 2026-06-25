# Personal Activity Dashboard

Dashboard pribadi untuk mengelola pekerjaan, aktivitas harian, grafik progress, dan laporan produktivitas.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- Local state dan `localStorage`
- ESLint

## Menjalankan

```bash
./launcher.sh
```

Launcher memakai Node/npm lokal dari `.tools/node`, menjalankan `npm install` jika `node_modules` belum ada atau `package-lock.json` lebih baru, lalu membuka dev server di `http://127.0.0.1:3000`. Semua kebutuhan runtime proyek disimpan di repo ini. Halaman `/` akan diarahkan ke `/dashboard`.

Data awal berisi 8 pekerjaan dan 20 aktivitas harian. Jika browser sudah menyimpan data lama di `localStorage`, gunakan tombol reset di halaman Pengaturan atau kosongkan storage untuk key `personal-dashboard-tasks`, `personal-dashboard-activities`, dan `personal-dashboard-settings` agar seed baru muncul.

Halaman Pengaturan menyediakan export/import backup JSON untuk data pekerjaan, aktivitas, dan preferensi lokal. Import backup akan memvalidasi struktur file sebelum mengganti data lokal.

Daftar pekerjaan dan aktivitas harian memakai paginasi 10 item per halaman setelah filter diterapkan.
Dashboard menampilkan panel `Deadline Terdekat` dan `Aktivitas Hari Ini` dengan paginasi 4 item per halaman. Item di kedua panel bisa diklik untuk membuka halaman terkait dan langsung memfokuskan item yang dipilih. Deadline pekerjaan aktif menampilkan hitung mundur detail hingga hari, jam, menit, dan detik. Untuk mencegah mismatch hydration, countdown detail baru aktif setelah halaman selesai dimuat di browser.

Panduan penjelasan menu untuk pengguna tersedia di [docs/panduan-menu.md](docs/panduan-menu.md).

Port dan host bisa diubah:

```bash
PORT=3001 HOST=0.0.0.0 ./launcher.sh
```

## Testing

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm run test
PATH="$PWD/.tools/node/bin:$PATH" npm run lint
PATH="$PWD/.tools/node/bin:$PATH" npm run typecheck
PATH="$PWD/.tools/node/bin:$PATH" npm run build
```

## Sebelum Commit

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm run prepare:commit
```

File hasil build, dependency, toolchain lokal, cache TypeScript, dan file environment sudah dikecualikan lewat `.gitignore`. GitHub Actions menjalankan test, lint, typecheck, dan build pada push ke `main` dan pull request.

## Build

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm run build
```

## Tes Manual

- Klik semua menu sidebar: Dashboard, Pekerjaan, Aktivitas Harian, Laporan, Pengaturan.
- Di `/dashboard`, cek urutan pekerjaan berdasarkan deadline aktif terdekat, countdown deadline detail, dan klik item agar pindah ke halaman terkait dalam mode edit.
- Di `/tasks`, tambah, edit, hapus dengan konfirmasi, filter, ubah status pekerjaan, cek pagination, dan verifikasi countdown deadline pada task aktif.
- Di `/activities`, tambah, edit, hapus dengan konfirmasi, filter, ubah status aktivitas, cek pagination, dan verifikasi deep link dari dashboard membuka aktivitas yang tepat.
- Refresh browser untuk memastikan data tersimpan di `localStorage`.
- Di `/reports`, ubah filter laporan dan jalankan export CSV.
- Di `/settings`, export backup JSON, import backup JSON, dan reset data lokal.
- Cek tampilan desktop dan mobile, termasuk tombol hamburger.
