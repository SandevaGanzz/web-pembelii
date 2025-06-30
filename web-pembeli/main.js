// main.js - Logika Toko Panel dengan API

let selectedPaket = "";
let selectedPrice = 0;

const publicList = document.getElementById("publicList");
const privateList = document.getElementById("privateList");

const products = {
  public: [
    { name: "Panel 1GB", price: 2000, spec: "1GB/40%" },
    { name: "Panel 2GB", price: 4000, spec: "2GB/80%" }
  ],
  private: [
    { name: "Private 2GB", price: 6000, spec: "2GB/100%" },
    { name: "Private 4GB", price: 10000, spec: "4GB/150%" }
  ]
};

function showProducts() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("products").classList.remove("hidden");
}

function renderProducts() {
  products.public.forEach(p => {
    const card = createProductCard(p);
    publicList.appendChild(card);
  });
  products.private.forEach(p => {
    const card = createProductCard(p);
    privateList.appendChild(card);
  });
}

function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `<h3>${product.name}</h3><p>Rp ${product.price}</p><p>${product.spec}</p>`;
  div.onclick = () => {
    document.querySelectorAll(".product-card").forEach(c => c.classList.remove("selected"));
    div.classList.add("selected");
    selectedPaket = product.spec;
    selectedPrice = product.price;
    document.getElementById("continueBtn").classList.remove("hidden");
  };
  return div;
}

function showPaymentForm() {
  document.getElementById("products").classList.add("hidden");
  document.getElementById("paymentForm").classList.remove("hidden");
  document.getElementById("summaryPackage").textContent = selectedPaket;
  document.getElementById("summaryPrice").textContent = selectedPrice;
}

function previewBukti(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById("preview");
      img.src = e.target.result;
      img.classList.remove("hidden");
    }
    reader.readAsDataURL(file);
  }
}

async function submitOrder() {
  const email = document.getElementById("email").value;
  const wa = document.getElementById("whatsapp").value;
  const catatan = document.getElementById("catatan").value;
  const file = document.getElementById("bukti").files[0];

  if (!email || !wa || !file) {
    alert("Mohon lengkapi semua kolom dan upload bukti pembayaran.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    const imageBase64 = e.target.result;

    const data = {
      paket: selectedPaket,
      harga: selectedPrice,
      email,
      whatsapp: wa,
      catatan,
      bukti: imageBase64
    };

    try {
      const res = await fetch("/.netlify/functions/submitOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        document.getElementById("paymentForm").classList.add("hidden");
        document.getElementById("success").classList.remove("hidden");
      } else {
        alert("Gagal mengirim pesanan: " + result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  reader.readAsDataURL(file);
}

function resetForm() {
  location.reload();
}

// Inisialisasi
renderProducts();
