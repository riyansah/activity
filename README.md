# Personal Activity Dashboard

Dashboard pribadi untuk mengelola pekerjaan, aktivitas harian, grafik progress, dan laporan produktivitas.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- Local state dan `localStorage`

## Menjalankan

```bash
./launcher.sh
```

Launcher memakai Node/npm lokal dari `.tools/node`, menjalankan `npm install` jika `node_modules` belum ada atau `package-lock.json` lebih baru, lalu membuka dev server di `http://127.0.0.1:3000`. Semua kebutuhan runtime proyek disimpan di repo ini. Halaman `/` akan diarahkan ke `/dashboard`.

Data awal berisi 8 pekerjaan dan 20 aktivitas harian. Jika browser sudah menyimpan data lama di `localStorage`, kosongkan storage untuk key `personal-dashboard-tasks` dan `personal-dashboard-activities` agar seed baru muncul.

Port dan host bisa diubah:

```bash
PORT=3001 HOST=0.0.0.0 ./launcher.sh
```


## Testing

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm run test
PATH="$PWD/.tools/node/bin:$PATH" npm run typecheck
PATH="$PWD/.tools/node/bin:$PATH" npm run build
```

## Sebelum Commit

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm run prepare:commit
```

File hasil build, dependency, toolchain lokal, cache TypeScript, dan file environment sudah dikecualikan lewat `.gitignore`.

## Build

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm run build
```

## Tes Manual

- Klik semua menu sidebar: Dashboard, Pekerjaan, Aktivitas Harian, Laporan, Pengaturan.
- Di `/tasks`, tambah, edit, hapus, filter, dan ubah status pekerjaan.
- Di `/activities`, tambah, edit, hapus, filter, dan ubah status aktivitas.
- Refresh browser untuk memastikan data tersimpan di `localStorage`.
- Di `/reports`, ubah filter laporan dan jalankan export CSV.
- Cek tampilan desktop dan mobile, termasuk tombol hamburger.
