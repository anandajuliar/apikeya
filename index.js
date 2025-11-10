const express = require("express");
const path = require("path");
const crypto = require("crypto");
const app = express();
const port = 3000;

// Variabel untuk menyimpan API key terakhir yang dibuat
let lastGeneratedKey = null;

// Middleware untuk menyajikan file statis (HTML, CSS, JS) dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

// Middleware agar Express bisa membaca body 'raw' (text/plain)
app.use(express.text());

// Middleware agar Express bisa membaca body JSON
app.use(express.json());

// ENDPOINT 1: Membuat API Key (dipanggil oleh browser)
app.post("/create", (req, res) => {
  try {
    const randomBytes = crypto.randomBytes(32);
    const token = randomBytes.toString("base64url");
    const stamp = Date.now().toString(16);
    const apiKey = `${stamp}$${token}`;

    // Simpan key ke variabel sementara
    lastGeneratedKey = apiKey;
    console.log(`Key baru dibuat: ${apiKey}`);

    res.json({ apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal membuat API key" });
  }
});

// ENDPOINT 2: Memvalidasi API Key (dipanggil oleh Thunder Client / Postman)
app.post("/validate", (req, res) => {
  // Ambil key yang dikirim dari Thunder Client (body raw text)
  const keyFromClient = req.body;

  console.log(`Mencoba validasi key: ${keyFromClient}`);
  console.log(`Key yang disimpan: ${lastGeneratedKey}`);

  // Bandingkan key dari klien dengan key terakhir yang disimpan
  if (keyFromClient === lastGeneratedKey) {
    res.json({
      status: "sukses",
      message: "API Key valid dan terautentikasi.",
    });
  } else {
    res.status(401).json({
      status: "gagal",
      message: "API Key tidak valid atau salah.",
    });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
