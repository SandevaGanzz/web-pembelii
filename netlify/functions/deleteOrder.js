// deleteOrder.js - Hapus pesanan berdasarkan ID
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
    const { id } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID tidak ditemukan" })
      };
    }

    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Tidak ada data pesanan" })
      };
    }

    const file = fs.readFileSync(filePath);
    const orders = JSON.parse(file);
    const updatedOrders = orders.filter(order => order.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(updatedOrders, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Pesanan berhasil dihapus" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal menghapus pesanan" })
    };
  }
};
