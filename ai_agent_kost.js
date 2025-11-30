// AI Agent Customer Service Kost - Full Example for GitHub
// ----------------------------------------------
// Backend menggunakan Node.js + Express
// Chatbot ini memiliki fitur:
// - Menjawab pertanyaan umum kost
// - Jadwal kunjungan
// - Lapor keluhan
// - Cek ketersediaan kamar
// ----------------------------------------------

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Data contoh
const rooms = [
  { id: 1, type: "Kamar Standard", price: 850000, available: true },
  { id: 2, type: "Kamar AC", price: 1200000, available: false },
  { id: 3, type: "Kamar VIP", price: 1500000, available: true }
];

let complaints = [];
let visitSchedule = [];

// Fungsi AI sederhana (dummy)
function aiResponse(message) {
  message = message.toLowerCase();

  if (message.includes("harga") || message.includes("biaya")) {
    return "Harga kamar mulai dari Rp850.000 - Rp1.500.000 per bulan, tergantung tipe kamar.";
  }

  if (message.includes("kamar kosong") || message.includes("available")) {
    const availableRooms = rooms.filter(r => r.available);
    if (availableRooms.length === 0) return "Saat ini semua kamar sedang penuh.";

    return "Kamar yang tersedia: " + availableRooms.map(r => `${r.type} (Rp${r.price})`).join(", ");
  }

  if (message.includes("fasilitas")) {
    return "Fasilitas: WiFi, dapur bersama, parkiran, CCTV, laundry (opsional).";
  }

  if (message.includes("alamat")) {
    return "Alamat kost: Jl. Mawar No. 22, Bengkalis.";
  }

  return "Baik, pertanyaan kamu akan dibantu oleh admin dalam beberapa saat.";
}

// API: Chat ke AI Agent
app.post('/chat', (req, res) => {
  const { message } = req.body;
  const reply = aiResponse(message);
  res.json({ reply });
});

// API: Jadwal kunjungan
app.post('/visit', (req, res) => {
  const { name, date } = req.body;
  visitSchedule.push({ name, date });
  res.json({ status: "Berhasil", message: `Kunjungan dijadwalkan untuk ${name} pada ${date}` });
});

// API: Lapor keluhan
app.post('/complaint', (req, res) => {
  const { room, issue } = req.body;
  complaints.push({ room, issue });
  res.json({ status: "Terkirim", message: "Keluhan telah dicatat dan sedang diproses." });
});

// API: Cek Data Keluhan
app.get('/complaints', (req, res) => {
  res.json(complaints);
});

// API: Cek Jadwal Kunjungan
app.get('/visits', (req, res) => {
  res.json(visitSchedule);
});

// API: List Kamar
app.get('/rooms', (req, res) => {
  res.json(rooms);
});

// Menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// ----------------------------------------------
// Cara menjalankan:
// 1. Buat folder project
// 2. npm init -y
// 3. npm install express body-parser cors
// 4. Buat file index.js lalu paste code ini
// 5. Jalankan: node index.js
// 6. Tes via Postman / frontend / fetch API
// ----------------------------------------------
