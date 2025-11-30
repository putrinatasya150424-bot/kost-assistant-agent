import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Data contoh kamar kos
const rooms = [
  { id: 1, type: "Kamar Standard", price: 850000, available: true },
  { id: 2, type: "Kamar AC", price: 1200000, available: false },
  { id: 3, type: "Kamar VIP", price: 1500000, available: true }
];

let complaints = [];
let visits = [];

// Fungsi AI sederhana (dummy)
function aiBot(message) {
  message = message.toLowerCase();

  if (message.includes("harga") || message.includes("biaya")) {
    return "Harga kamar mulai dari Rp850.000 - Rp1.500.000 per bulan, tergantung tipe kamar.";
  }

  if (message.includes("kamar kosong") || message.includes("available")) {
    const available = rooms.filter(r => r.available);
    if (available.length === 0) return "Saat ini semua kamar penuh.";

    return "Kamar tersedia: " + available.map(r => `${r.type} (Rp${r.price})`).join(", ");
  }

  if (message.includes("fasilitas")) {
    return "Fasilitas: WiFi, dapur umum, parkiran, CCTV, laundry opsional.";
  }

  if (message.includes("alamat")) {
    return "Alamat kost: Jl. Mawar No. 22, Bengkalis.";
  }

  return "Pertanyaan kamu sudah dicatat, mohon tunggu sebentar ya.";
}

// API: Chatbot AI Agent
app.post("/chat", (req, res) => {
  const { message } = req.body;
  const reply = aiBot(message);
  res.json({ reply });
});

// API: Lihat list kamar
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

// API: Jadwalkan kunjungan
app.post("/visit", (req, res) => {
  const { name, date } = req.body;
  visits.push({ name, date });
  res.json({ status: "success", message: `Kunjungan untuk ${name} sudah dijadwalkan pada ${date}` });
});

// API: Lapor keluhan
app.post("/complaint", (req, res) => {
  const { room, issue } = req.body;
  complaints.push({ room, issue });
  res.json({ status: "received", message: "Keluhan sudah dicatat dan akan ditindaklanjuti." });
});

// API: Lihat semua keluhan
app.get("/complaints", (req, res) => {
  res.json(complaints);
});

// Menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ber