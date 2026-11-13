import assert from "node:assert/strict";
import test from "node:test";
import { request } from "../src/services/apiClient.js";
import {
  buatLaporan,
  daftarLaporan,
  ubahStatusLaporan,
} from "../src/services/laporanService.js";
import { geocode, laporanTerdekat } from "../src/services/lokasiService.js";

function okResponse(body = {}) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    },
  };
}

async function withFetch(mockFetch, callback) {
  const fetchSebelumnya = globalThis.fetch;
  globalThis.fetch = mockFetch;
  try {
    await callback();
  } finally {
    globalThis.fetch = fetchSebelumnya;
  }
}

test("FE-SVC-01: daftarLaporan mengirim filter dan pagination sebagai query", async () => {
  let urlTerkirim;
  await withFetch(async (url, options) => {
    urlTerkirim = { url, options };
    return okResponse({ laporan: [] });
  }, async () => {
    const hasil = await daftarLaporan({
      kategori: "Ruang Publik",
      page: 2,
      limit: 12,
      statusLaporan: "",
    });

    const url = new URL(urlTerkirim.url, "http://localhost");
    assert.equal(url.pathname, "/api/laporan");
    assert.equal(url.searchParams.get("kategori"), "Ruang Publik");
    assert.equal(url.searchParams.get("page"), "2");
    assert.equal(url.searchParams.get("limit"), "12");
    assert.equal(url.searchParams.has("statusLaporan"), false);
    assert.equal(urlTerkirim.options.credentials, "include");
    assert.deepEqual(hasil, { laporan: [] });
  });
});

test("FE-SVC-02: buatLaporan mengirim FormData tanpa menetapkan Content-Type sendiri", async () => {
  const formData = new FormData();
  formData.append("namaMasalah", "Jalan berlubang");
  let panggilan;
  await withFetch(async (url, options) => {
    panggilan = { url, options };
    return okResponse({ idLaporan: "laporan-1" });
  }, async () => {
    const hasil = await buatLaporan(formData);

    assert.equal(panggilan.url, "/api/laporan");
    assert.equal(panggilan.options.method, "POST");
    assert.equal(panggilan.options.body, formData);
    assert.equal(panggilan.options.headers, undefined);
    assert.equal(hasil.idLaporan, "laporan-1");
  });
});

test("FE-SVC-03: geocode meng-encode alamat pada URL", async () => {
  let urlTerkirim;
  await withFetch(async (url) => {
    urlTerkirim = url;
    return okResponse({ latitude: -6.9, longitude: 107.6 });
  }, async () => {
    const hasil = await geocode("Jalan Asia Afrika, Bandung");
    const url = new URL(urlTerkirim, "http://localhost");

    assert.equal(url.pathname, "/api/lokasi/geocode");
    assert.equal(url.searchParams.get("alamat"), "Jalan Asia Afrika, Bandung");
    assert.equal(hasil.latitude, -6.9);
  });
});

test("FE-SVC-04: laporanTerdekat mengirim koordinat dan radius", async () => {
  let urlTerkirim;
  await withFetch(async (url) => {
    urlTerkirim = url;
    return okResponse({ laporan: [] });
  }, async () => {
    await laporanTerdekat(-6.9, 107.6, 10);
    const url = new URL(urlTerkirim, "http://localhost");

    assert.equal(url.pathname, "/api/lokasi/terdekat");
    assert.equal(url.searchParams.get("latitude"), "-6.9");
    assert.equal(url.searchParams.get("longitude"), "107.6");
    assert.equal(url.searchParams.get("radius"), "10");
  });
});

test("FE-SVC-05: ubahStatusLaporan mengirim PATCH dengan JSON status", async () => {
  let panggilan;
  await withFetch(async (url, options) => {
    panggilan = { url, options };
    return okResponse({ statusLaporan: "SELESAI" });
  }, async () => {
    await ubahStatusLaporan("laporan-1", "SELESAI");

    assert.equal(panggilan.url, "/api/laporan/laporan-1/status");
    assert.equal(panggilan.options.method, "PATCH");
    assert.equal(panggilan.options.headers["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(panggilan.options.body), { statusLaporan: "SELESAI" });
  });
});

test("FE-SVC-06: request meneruskan status dan pesan error backend", async () => {
  await withFetch(async () => ({
    ok: false,
    status: 404,
    async json() {
      return { message: "Laporan tidak ditemukan" };
    },
  }), async () => {
    await assert.rejects(request("/api/laporan/tidak-ada"), (error) => {
      assert.equal(error.status, 404);
      assert.equal(error.message, "Laporan tidak ditemukan");
      return true;
    });
  });
});

test("FE-SVC-07: request memancarkan event ketika sesi berakhir", async () => {
  const windowSebelumnya = globalThis.window;
  let namaEvent;
  globalThis.window = {
    dispatchEvent(event) {
      namaEvent = event.type;
    },
  };
  try {
    await withFetch(async () => ({
      ok: false,
      status: 401,
      async json() {
        return { message: "Please log in to continue." };
      },
    }), async () => {
      await assert.rejects(request("/api/lokasi/geocode"), { status: 401 });
    });
    assert.equal(namaEvent, "rawat:sesi-habis");
  } finally {
    if (windowSebelumnya === undefined) delete globalThis.window;
    else globalThis.window = windowSebelumnya;
  }
});

test("FE-SVC-08: request memberi pesan yang jelas jika backend tidak dapat dihubungi", async () => {
  await withFetch(async () => {
    throw new Error("network failure");
  }, async () => {
    await assert.rejects(request("/api/laporan"), {
      message: "Tidak dapat terhubung ke server. Periksa backend Express.",
    });
  });
});
