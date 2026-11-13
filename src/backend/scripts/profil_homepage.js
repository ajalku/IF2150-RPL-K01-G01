// Profiling fitur berat: daftar laporan di Beranda (urutan bawaan: urgensi) + penanda upvote.
// Mengukur: (A) N+1 query vs 1 query batch, (B) efek indeks gabungan skor_populer, (C) beban konkuren.
// Memenuhi KNF04 (95% permintaan <= 2 detik) dan KNF05 (1000 pengguna, gagal < 1%).
//
// PAKAI HANYA DI DATABASE LOKAL/DEV. Data uji dibuat lalu dihapus otomatis.
//   node scripts/profil_homepage.js --ya [--laporan=20000] [--pengguna=200] [--konkuren=1000] [--ulang=30] [--tanpa-hapus]
require("dotenv").config({ path: require("node:path").join(__dirname, "../.env") });
const fs = require("node:fs");
const path = require("node:path");
const { pool } = require("../src/config/database");
const Upvote = require("../src/models/Upvote");
const Homepage = require("../src/models/Homepage");

const arg = (nama, bawaan) => {
    const a = process.argv.find(x => x.startsWith(`--${nama}=`));
    return a ? Number(a.split("=")[1]) : bawaan;
};
const JUMLAH_LAPORAN = arg("laporan", 20000);
const JUMLAH_PENGGUNA = arg("pengguna", 200);
const KONKUREN = arg("konkuren", 1000);
const ULANG = arg("ulang", 30);
const EMAIL_UJI = "seed-%@profil.rawat.test";

const persentil = (angka, p) => {
    const urut = [...angka].sort((a, b) => a - b);
    return urut[Math.min(urut.length - 1, Math.ceil((p / 100) * urut.length) - 1)];
};
const ms = n => `${n.toFixed(1)} ms`;
const ukur = async fn => { const t = performance.now(); const hasil = await fn(); return [performance.now() - t, hasil]; };

async function isiDataUji() {
    console.log(`Mengisi ${JUMLAH_PENGGUNA} pengguna, ${JUMLAH_LAPORAN} laporan, upvote acak...`);
    await pool.query(
        `INSERT INTO pengguna (nama, nik, email, hash_password, no_telp)
         SELECT 'Seed ' || i, lpad(i::text, 16, '9'), 'seed-' || i || '@profil.rawat.test', 'x', '08123456789'
         FROM generate_series(1, $1) AS i`, [JUMLAH_PENGGUNA]);
    await pool.query(
        `WITH u AS (SELECT array_agg(id_pengguna ORDER BY id_pengguna) AS ids FROM pengguna WHERE email LIKE $2)
         INSERT INTO laporan (id_laporan, id_pengguna, nama_masalah, kategori, tingkat_permasalahan, status_privasi,
                              bobot_urgensi, skor_populer, waktu_lapor)
         SELECT gen_random_uuid(), u.ids[1 + (i % cardinality(u.ids))], 'Seed laporan ' || i,
                (ARRAY['Jalan','Lampu','Sampah','Drainase','Taman'])[1 + (i % 5)],
                (ARRAY['SANGAT_RENDAH','RENDAH','SEDANG','TINGGI','SANGAT_TINGGI'])[1 + (i % 5)],
                'PUBLIK', 1 + (i % 5), random() * 50, NOW() - random() * interval '90 days'
         FROM generate_series(1, $1) AS i, u`, [JUMLAH_LAPORAN, EMAIL_UJI]);
    await pool.query(
        `INSERT INTO lokasi (id_laporan, latitude, longitude)
         SELECT l.id_laporan, -6.9 + random() * 0.2, 107.5 + random() * 0.2
         FROM laporan l JOIN pengguna p ON p.id_pengguna = l.id_pengguna WHERE p.email LIKE $1`, [EMAIL_UJI]);
    // ~1% pasangan (pengguna, laporan) saling upvote
    await pool.query(
        `INSERT INTO upvote (id_pengguna, id_laporan)
         SELECT u.id_pengguna, l.id_laporan
         FROM pengguna u JOIN laporan l ON l.id_pengguna <> u.id_pengguna
         JOIN pengguna pl ON pl.id_pengguna = l.id_pengguna
         WHERE u.email LIKE $1 AND pl.email LIKE $1 AND random() < 0.01`, [EMAIL_UJI]);
    await pool.query(
        `UPDATE laporan l SET jumlah_upvote = c.n, skor_populer = c.n * 1.0 + l.bobot_urgensi * 2.0
         FROM (SELECT id_laporan, COUNT(*) AS n FROM upvote GROUP BY id_laporan) c
         WHERE c.id_laporan = l.id_laporan`);
    await pool.query("ANALYZE laporan; ");
    await pool.query("ANALYZE upvote; ");
    await pool.query("ANALYZE lokasi; ");
}

async function bersihkan() {
    await pool.query(`DELETE FROM pengguna WHERE email LIKE $1`, [EMAIL_UJI]); // laporan, lokasi, upvote ikut terhapus (CASCADE)
}

// SQL yang sama dengan Laporan.getDaftarLaporan(viewer warga, sortBy urgensi, limit 20)
const SQL_POPULER = `
    SELECT l.id_laporan, l.nama_masalah, l.kategori, l.tingkat_permasalahan, l.jumlah_upvote, l.skor_populer, l.bobot_urgensi,
           lo.latitude, lo.longitude, p.nama
    FROM laporan l
    JOIN lokasi lo ON lo.id_laporan = l.id_laporan
    JOIN pengguna p ON p.id_pengguna = l.id_pengguna
    WHERE (l.status_validasi <> 'TIDAK_VALID' OR l.id_pengguna = $1)
    ORDER BY l.bobot_urgensi DESC, l.id_laporan
    LIMIT 20 OFFSET 0`;

async function explain(idPengguna) {
    const r = await pool.query(`EXPLAIN (ANALYZE, FORMAT JSON) ${SQL_POPULER}`, [idPengguna]);
    const rencana = r.rows[0]["QUERY PLAN"][0];
    const jenis = new Set();
    (function telusuri(n) { jenis.add(n["Node Type"]); (n.Plans || []).forEach(telusuri); })(rencana.Plan);
    return { eksekusi: rencana["Execution Time"], node: [...jenis].join(", ") };
}

async function main() {
    if (!process.argv.includes("--ya")) {
        console.log(`Skrip ini MENAMBAH lalu MENGHAPUS data uji di database "${process.env.DB_NAME}".\nJalankan ulang dengan --ya jika ini database lokal/dev.`);
        return;
    }
    if (process.env.NODE_ENV === "production") throw new Error("Dilarang dijalankan di production.");

    const laporan = [];
    laporan.push(`# Hasil profiling Beranda (${new Date().toISOString()})`);
    laporan.push(`Data uji: ${JUMLAH_PENGGUNA} pengguna, ${JUMLAH_LAPORAN} laporan. Pengulangan: ${ULANG}. Konkurensi: ${KONKUREN}.\n`);

    try {
        await isiDataUji();
        const { rows } = await pool.query(`SELECT id_pengguna FROM pengguna WHERE email LIKE $1 LIMIT 1`, [EMAIL_UJI]);
        const viewer = { idPengguna: rows[0].id_pengguna, role: "warga" };

        // ---- (B) indeks: SEBELUM = tanpa indeks gabungan, SESUDAH = dengan indeks gabungan
        await pool.query("DROP INDEX IF EXISTS idx_laporan_urgensi_id");
        await pool.query("ANALYZE laporan");
        const sebelumIdx = await explain(viewer.idPengguna);
        const waktuSebelum = [];
        for (let i = 0; i < ULANG; i++) waktuSebelum.push((await ukur(() => new Homepage().getDaftarLaporan(viewer)))[0]);

        await pool.query("CREATE INDEX IF NOT EXISTS idx_laporan_urgensi_id ON laporan (bobot_urgensi DESC, id_laporan)");
        await pool.query("ANALYZE laporan");
        const sesudahIdx = await explain(viewer.idPengguna);
        const waktuSesudah = [];
        for (let i = 0; i < ULANG; i++) waktuSesudah.push((await ukur(() => new Homepage().getDaftarLaporan(viewer)))[0]);

        laporan.push("## B. Indeks (bobot_urgensi DESC, id_laporan)");
        laporan.push("| Kondisi | Waktu eksekusi query (EXPLAIN ANALYZE) | Median end-to-end | p95 end-to-end | Node rencana query |");
        laporan.push("|---|---|---|---|---|");
        laporan.push(`| Sebelum (tanpa indeks gabungan) | ${ms(sebelumIdx.eksekusi)} | ${ms(persentil(waktuSebelum, 50))} | ${ms(persentil(waktuSebelum, 95))} | ${sebelumIdx.node} |`);
        laporan.push(`| Sesudah (dengan indeks gabungan) | ${ms(sesudahIdx.eksekusi)} | ${ms(persentil(waktuSesudah, 50))} | ${ms(persentil(waktuSesudah, 95))} | ${sesudahIdx.node} |\n`);

        // ---- (A) N+1 vs batch, pada daftar 20 laporan yang sama
        const daftar = await new Homepage().getDaftarLaporan(viewer, { limit: 20 });
        const ids = daftar.map(l => l.idLaporan);
        const hitungQuery = async fn => {
            let n = 0; const asli = pool.query.bind(pool);
            pool.query = (...a) => { n++; return asli(...a); };
            try { const [t] = await ukur(fn); return { t, n }; } finally { pool.query = asli; }
        };
        const naif = [], batch = []; let qNaif = 0, qBatch = 0;
        for (let i = 0; i < ULANG; i++) {
            const a = await hitungQuery(async () => { for (const id of ids) await Upvote.sudahUpvote(viewer.idPengguna, id); });
            const b = await hitungQuery(() => Upvote.getDiupvoteOleh(viewer.idPengguna, ids));
            naif.push(a.t); batch.push(b.t); qNaif = a.n; qBatch = b.n;
        }
        laporan.push("## A. Penanda 'sudah upvote' untuk 20 laporan");
        laporan.push("| Cara | Jumlah query | Median | p95 |");
        laporan.push("|---|---|---|---|");
        laporan.push(`| Sebelum: sudahUpvote() per laporan (N+1) | ${qNaif} | ${ms(persentil(naif, 50))} | ${ms(persentil(naif, 95))} |`);
        laporan.push(`| Sesudah: getDiupvoteOleh() batch | ${qBatch} | ${ms(persentil(batch, 50))} | ${ms(persentil(batch, 95))} |\n`);

        // ---- (C) beban konkuren (kondisi akhir: kode + indeks sesudah optimasi)
        const durasi = []; let gagal = 0;
        const mulai = performance.now();
        await Promise.all(Array.from({ length: KONKUREN }, async () => {
            const t = performance.now();
            try { await new Homepage().getDaftarLaporan(viewer); durasi.push(performance.now() - t); }
            catch { gagal++; }
        }));
        const total = performance.now() - mulai;
        const lolos2s = durasi.filter(d => d <= 2000).length;
        laporan.push(`## C. ${KONKUREN} permintaan serentak (kondisi akhir)`);
        laporan.push("| Metrik | Nilai | Target SKPL |");
        laporan.push("|---|---|---|");
        laporan.push(`| Gagal | ${gagal} (${((gagal / KONKUREN) * 100).toFixed(2)}%) | < 1% (KNF05) |`);
        laporan.push(`| Selesai <= 2 detik | ${((lolos2s / KONKUREN) * 100).toFixed(1)}% | >= 95% (KNF04) |`);
        laporan.push(`| p50 / p95 / maks | ${ms(persentil(durasi, 50))} / ${ms(persentil(durasi, 95))} / ${ms(Math.max(...durasi))} | |`);
        laporan.push(`| Total waktu | ${ms(total)} | |`);
        laporan.push(`\nCatatan: pengujian ini memanggil model langsung (tanpa lapisan HTTP) dengan pool koneksi bawaan (maks 10).`);
    } finally {
        if (!process.argv.includes("--tanpa-hapus")) await bersihkan();
        await pool.end();
    }

    const teks = laporan.join("\n");
    console.log("\n" + teks);
    const berkas = path.join(__dirname, "hasil_profiling.md");
    fs.writeFileSync(berkas, teks + "\n");
    console.log(`\nTersimpan di ${berkas}`);
}

main().catch(err => { console.error("Profiling gagal:", err.message); process.exit(1); });
