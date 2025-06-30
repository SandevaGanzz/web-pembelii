// getOrders.js - Fungsi Netlify untuk mengambil semua pesanan
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.json");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 200,
        body: JSON.stringify([])
      };
    }

    const file = fs.readFileSync(filePath);
    const orders = JSON.parse(file);

    return {
      statusCode: 200,
      body: JSON.stringify(orders)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal membaca data" })
    };
  }
};
