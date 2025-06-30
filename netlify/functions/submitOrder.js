// submitOrder.js - Fungsi Netlify untuk menerima pesanan
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.json");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { paket, harga, email, whatsapp, catatan, bukti } = data;

    if (!paket || !harga || !email || !whatsapp || !bukti) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Data tidak lengkap" })
      };
    }

    const newOrder = {
      id: Date.now().toString(),
      paket,
      harga,
      email,
      whatsapp,
      catatan: catatan || "",
      bukti,
      createdAt: new Date().toISOString()
    };

    let orders = [];
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath);
      orders = JSON.parse(file);
    }

    orders.push(newOrder);
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Pesanan berhasil diterima", orderId: newOrder.id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal memproses pesanan" })
    };
  }
};
