import '../style.css';

// Import all HTML templates as raw strings (Vite feature)
import authHtml from './components/auth.html?raw';
import sidebarHtml from './components/sidebar.html?raw';
import headerHtml from './components/header.html?raw';
import dashboardHtml from './pages/dashboard.html?raw';
import menuManagerHtml from './pages/menu-manager.html?raw';
import ordersHtml from './pages/orders.html?raw';
import membersHtml from './pages/members.html?raw';
import staffManagerHtml from './pages/staff-manager.html?raw';
import inventoryManagerHtml from './pages/inventory-manager.html?raw';
import promotionsHtml from './pages/promotions.html?raw';
import analyticsHtml from './pages/analytics.html?raw';
import settingsHtml from './pages/settings.html?raw';
import modalHtml from './components/modal.html?raw';
import toastHtml from './components/toast.html?raw';

// Mount HTML Components into the App Container
document.getElementById('app').innerHTML = `
  ${authHtml}
  <div id="app-view" class="app-wrapper">
    ${sidebarHtml}
    <main class="main-viewport">
      ${headerHtml}
      <div class="content-area">
        ${dashboardHtml}
        ${menuManagerHtml}
        ${ordersHtml}
        ${membersHtml}
        ${staffManagerHtml}
        ${inventoryManagerHtml}
        ${promotionsHtml}
        ${analyticsHtml}
        ${settingsHtml}
      </div>
    </main>
  </div>
  ${modalHtml}
  ${toastHtml}
`;

// =========================================================================
// CORE INTERACTION LOGIC
// =========================================================================

// Check for user login session in localStorage
let isLogged = localStorage.getItem("sb_admin_logged") === "true";
const savedUser = JSON.parse(localStorage.getItem("sb_admin_user")) || { name: "Maximilian Top", email: "admin@starbucks.co.id" };

// Update UI with saved profile
document.getElementById("sidebar-admin-name").innerText = savedUser.name;
document.getElementById("set-admin-name").value = savedUser.name;
document.getElementById("set-admin-email").value = savedUser.email;

// View Elements
const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");

if (isLogged) {
  authView.classList.add("hidden");
  appView.classList.add("visible");
} else {
  authView.classList.remove("hidden");
  appView.classList.remove("visible");
}

// Live Clock
function updateClock() {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const now = new Date();
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} | ${now.toTimeString().split(' ')[0]}`;
  document.getElementById("live-clock").innerText = dateStr;
}
updateClock();
setInterval(updateClock, 1000);

// Auth Views switching
const loginCard = document.getElementById("login-card");
const registerCard = document.getElementById("register-card");

document.getElementById("link-show-register").addEventListener("click", (e) => {
  e.preventDefault();
  loginCard.style.display = "none";
  registerCard.style.display = "block";
});

document.getElementById("link-show-login").addEventListener("click", (e) => {
  e.preventDefault();
  registerCard.style.display = "none";
  loginCard.style.display = "block";
});

// Login handler
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("login-email").value;
  
  // Save auth state
  localStorage.setItem("sb_admin_logged", "true");
  const userInfo = { name: savedUser.name, email: emailInput };
  localStorage.setItem("sb_admin_user", JSON.stringify(userInfo));
  
  showToast("Login Berhasil! Selamat Datang di Starbucks Store Portal.", "success");
  isLogged = true;
  
  // Visual Transition
  authView.classList.add("hidden");
  setTimeout(() => {
    appView.classList.add("visible");
    initCharts();
    renderDashboardOrders();
  }, 300);
});

// Register handler
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("reg-name").value;
  const emailInput = document.getElementById("reg-email").value;
  
  const userInfo = { name: nameInput, email: emailInput };
  localStorage.setItem("sb_admin_user", JSON.stringify(userInfo));
  document.getElementById("sidebar-admin-name").innerText = nameInput;
  document.getElementById("set-admin-name").value = nameInput;
  document.getElementById("set-admin-email").value = emailInput;
  
  showToast("Registrasi Berhasil! Anda sekarang terdaftar sebagai admin.", "success");
  
  // Go back to login screen with auto-filled credentials
  registerCard.style.display = "none";
  loginCard.style.display = "block";
  document.getElementById("login-email").value = emailInput;
});

// Logout handler
document.getElementById("btn-logout").addEventListener("click", () => {
  showConfirmModal("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar dari Starbucks Store Portal?", () => {
    localStorage.setItem("sb_admin_logged", "false");
    isLogged = false;
    appView.classList.remove("visible");
    setTimeout(() => {
      authView.classList.remove("hidden");
    }, 300);
    showToast("Anda telah keluar dari sistem portal store.", "error");
  });
});

// Toggle Theme
const htmlEl = document.documentElement;
let savedTheme = localStorage.getItem("sb_theme") || "light";
htmlEl.setAttribute("data-theme", savedTheme);

document.getElementById("btn-theme-toggle").addEventListener("click", () => {
  let currentTheme = htmlEl.getAttribute("data-theme");
  let newTheme = currentTheme === "light" ? "dark" : "light";
  htmlEl.setAttribute("data-theme", newTheme);
  localStorage.setItem("sb_theme", newTheme);
  showToast(`Tema dialihkan ke mode ${newTheme === 'light' ? 'Terang' : 'Gelap'}.`);
  
  // Re-render charts with new theme colors
  destroyCharts();
  initCharts();
});

// Sidebar Navigation switching
const menuLinks = document.querySelectorAll(".sidebar-link");
const pageViews = document.querySelectorAll(".page-view");

window.switchView = function(viewId) {
  menuLinks.forEach(link => {
    if (link.getAttribute("data-target") === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  pageViews.forEach(view => {
    if (view.getAttribute("id") === `view-${viewId}`) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Close mobile sidebar after click
  document.getElementById("sidebar-container").classList.remove("active");
};

menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-target");
    window.switchView(target);
  });
});

// Mobile Sidebar Toggle
document.getElementById("btn-mobile-sidebar-toggle").addEventListener("click", () => {
  document.getElementById("sidebar-container").classList.toggle("active");
});

// Settings Navigation tabs switching
const settingsTabs = document.querySelectorAll(".settings-nav-item");
settingsTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    settingsTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.getAttribute("data-settings-target");
    // Hide all blocks inside settings view
    document.querySelectorAll(".settings-form-card").forEach(block => {
      block.style.display = "none";
    });
    document.getElementById(target).style.display = "block";
  });
});

// Save settings alerts
document.getElementById("btn-save-profile").addEventListener("click", () => {
  const nameVal = document.getElementById("set-admin-name").value;
  const emailVal = document.getElementById("set-admin-email").value;
  
  const userInfo = { name: nameVal, email: emailVal };
  localStorage.setItem("sb_admin_user", JSON.stringify(userInfo));
  document.getElementById("sidebar-admin-name").innerText = nameVal;
  
  showToast("Profil administrator berhasil diperbarui!", "success");
});

document.getElementById("btn-save-store").addEventListener("click", () => {
  showToast("Konfigurasi operasional store berhasil disimpan.", "success");
});

document.getElementById("btn-save-notif").addEventListener("click", () => {
  showToast("Preferensi notifikasi sistem berhasil diterapkan.", "success");
});

// =========================================================================
// DATA & DATABASE MOCK (localStorage)
// =========================================================================

const defaultProducts = [
  { id: "1", name: "Iced Caramel Macchiato", category: "Espresso", price: 59000, stars: 150, stock: 120 },
  { id: "2", name: "Pink Refresher Juice", category: "Refresher", price: 48000, stars: 200, stock: 85 },
  { id: "3", name: "Matcha Cream Frappuccino", category: "Frappuccino", price: 55000, stars: 150, stock: 94 },
  { id: "4", name: "Signature Cold Brew Coffee", category: "Espresso", price: 44000, stars: 100, stock: 110 },
  { id: "5", name: "Croissant Almond Butter", category: "Food", price: 37000, stars: 100, stock: 40 },
  { id: "6", name: "Emperor's Clouds & Mist Tea", category: "Tea", price: 32000, stars: 100, stock: 65 }
];

const defaultOrders = [
  { id: "SB-1048", customer: "Amalia Putri", type: "Mobile App", items: "1x Iced Caramel Macchiato, 1x Croissant", date: "16:25", status: "Diproses", total: 96000 },
  { id: "SB-1047", customer: "Farhan Siregar", type: "Kasir Store", items: "2x Signature Cold Brew", date: "16:10", status: "Selesai", total: 88000 },
  { id: "SB-1046", customer: "Maximilian", type: "Drive-Thru", items: "1x Pink Refresher Juice, 1x Matcha Cream", date: "15:45", status: "Selesai", total: 103000 },
  { id: "SB-1045", customer: "Randi Prasetyo", type: "Mobile App", items: "1x Emperor's Clouds Tea", date: "15:30", status: "Dibatalkan", total: 32000 },
  { id: "SB-1044", customer: "Jessica Wijaya", type: "Kasir Store", items: "1x Iced Caramel Macchiato", date: "15:15", status: "Selesai", total: 59000 }
];

const defaultMembers = [
  { id: "M-3891", name: "Maximilian Top", email: "max@top.com", stars: 120, card: "*8891", tier: "Gold Member" },
  { id: "M-4028", name: "Siti Rahma", email: "siti.rahma@mail.com", stars: 75, card: "*4028", tier: "Green Member" },
  { id: "M-2184", name: "Budi Santoso", email: "budi.s@gmail.com", stars: 220, card: "*2184", tier: "Gold Member" },
  { id: "M-8831", name: "Aria Nugraha", email: "aria.nugraha@outlook.com", stars: 10, card: "*8831", tier: "Welcome Level" },
  { id: "M-7740", name: "Nadia Utami", email: "nadia.u@design.co.id", stars: 145, card: "*7740", tier: "Green Member" }
];

const defaultActivities = [
  { text: "Hadiah bintang diklaim oleh Maximilian Top (1x Croissant Gratis)", time: "10 menit lalu", type: "reward" },
  { text: "Pesanan masuk baru #SB-1048 dari aplikasi mobile", time: "18 menit lalu", type: "order" },
  { text: "Bahan sirup karamel restock +24 botol ke inventory", time: "1 jam lalu", type: "system" },
  { text: "Member baru Siti Rahma bergabung lewat kode referral", time: "2 jam lalu", type: "member" },
  { text: "Penjualan menu Refresher melompat 20% selama siang hari", time: "3 jam lalu", type: "analytics" }
];

const defaultStaff = [
  { id: "S-01", name: "Maximilian Top", role: "Store Manager", shift: "Pagi", status: "Aktif", rating: "4.8" },
  { id: "S-02", name: "Siti Rahma", role: "Shift Supervisor", shift: "Siang", status: "Aktif", rating: "4.9" },
  { id: "S-03", name: "Budi Santoso", role: "Barista", shift: "Pagi", status: "Istirahat", rating: "4.5" },
  { id: "S-04", name: "Aria Nugraha", role: "Barista", shift: "Siang", status: "Off", rating: "4.2" },
  { id: "S-05", name: "Nadia Utami", role: "Barista", shift: "Malam", status: "Aktif", rating: "4.7" }
];

const defaultInventory = [
  { id: "I-01", name: "Espresso Beans House Blend", category: "Kopi", qty: 8.5, maxQty: 25, unit: "kg", status: "Cukup" },
  { id: "I-02", name: "Caramel Syrup Sauce", category: "Sirup", qty: 2.0, maxQty: 20, unit: "botol", status: "Hampir Habis" },
  { id: "I-03", name: "Whole Milk Premium", category: "Susu", qty: 4.0, maxQty: 50, unit: "kotak", status: "Hampir Habis" },
  { id: "I-04", name: "Starbucks Cup Grande Size", category: "Kemasan", qty: 450.0, maxQty: 500, unit: "pcs", status: "Cukup" },
  { id: "I-05", name: "Chocolate Croissant Dough", category: "Makanan", qty: 0.0, maxQty: 30, unit: "pcs", status: "Habis" }
];

const defaultPromotions = [
  { id: "P-01", name: "Double Star Wednesday Event", code: "DBLSTAR", type: "Rewards Boost", value: "2x Bintang", period: "Rabu", status: "Aktif" },
  { id: "P-02", name: "Morning Coffee Boost Discount", code: "MORNINGCOFFEE", type: "Potongan Langsung", value: "Rp 10.000", period: "07:00 - 10:00", status: "Aktif" },
  { id: "P-03", name: "Frappuccino Friday BOGO Promo", code: "FRIDAYBOGO", type: "Beli 1 Gratis 1", value: "BOGO", period: "Jumat", status: "Dijadwalkan" },
  { id: "P-04", name: "Summer Refresher Special", code: "SUMMERSIP", type: "Persentase Diskon", value: "15%", period: "Juni - Juli", status: "Berakhir" }
];

// Initialize database
if (!localStorage.getItem("sb_products")) localStorage.setItem("sb_products", JSON.stringify(defaultProducts));
if (!localStorage.getItem("sb_orders")) localStorage.setItem("sb_orders", JSON.stringify(defaultOrders));
if (!localStorage.getItem("sb_members")) localStorage.setItem("sb_members", JSON.stringify(defaultMembers));
if (!localStorage.getItem("sb_activities")) localStorage.setItem("sb_activities", JSON.stringify(defaultActivities));
if (!localStorage.getItem("sb_staff")) localStorage.setItem("sb_staff", JSON.stringify(defaultStaff));
if (!localStorage.getItem("sb_inventory")) localStorage.setItem("sb_inventory", JSON.stringify(defaultInventory));
if (!localStorage.getItem("sb_promotions")) localStorage.setItem("sb_promotions", JSON.stringify(defaultPromotions));

let products = JSON.parse(localStorage.getItem("sb_products"));
let orders = JSON.parse(localStorage.getItem("sb_orders"));
let members = JSON.parse(localStorage.getItem("sb_members"));
let activities = JSON.parse(localStorage.getItem("sb_activities"));
let staff = JSON.parse(localStorage.getItem("sb_staff"));
let inventory = JSON.parse(localStorage.getItem("sb_inventory"));
let promotions = JSON.parse(localStorage.getItem("sb_promotions"));

// Refresh page tables
function refreshAllTables() {
  renderProductTable();
  renderOrderTable();
  renderMemberTable();
  renderDashboardOrders();
  renderActivityFeed();
  updateStatsSummary();
  // Operations Pages
  renderStaffTable();
  renderInventoryTable();
  renderPromoTable();
}

function updateStatsSummary() {
  // Calculate dynamic stats
  const activeOrders = orders.filter(o => o.status === "Diproses").length;
  const totalRev = orders.filter(o => o.status === "Selesai").reduce((sum, o) => sum + o.total, 0) + 12485000;
  
  document.getElementById("stat-revenue").innerText = `Rp ${totalRev.toLocaleString("id-ID")}`;
  document.getElementById("stat-orders").innerText = `${activeOrders} Pesanan`;
  document.getElementById("stat-members").innerText = `${members.length + 23} Terdaftar`;
}

// =========================================================================
// VIEW RENDER FUNCTIONS
// =========================================================================

// 1. Dashboard Recent Orders
function renderDashboardOrders() {
  const tbody = document.querySelector("#dashboard-recent-orders-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  // Take latest 4 orders
  orders.slice(0, 4).forEach(order => {
    let badgeClass = "badge-info";
    if (order.status === "Selesai") badgeClass = "badge-success";
    if (order.status === "Dibatalkan") badgeClass = "badge-danger";
    if (order.status === "Diproses") badgeClass = "badge-warning";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${order.id}</strong></td>
      <td>${order.customer}</td>
      <td><span style="font-size: 1.3rem; color: var(--text-secondary);">${order.items}</span></td>
      <td><span class="badge ${badgeClass}">${order.status}</span></td>
      <td><strong>Rp ${order.total.toLocaleString("id-ID")}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

// 2. Activity Feed
function renderActivityFeed() {
  const container = document.getElementById("activity-log-feed");
  if (!container) return;
  container.innerHTML = "";
  
  activities.forEach(act => {
    let iconSvg = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    if (act.type === "reward") {
      iconSvg = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.783-.57-.372-1.81.587-1.81H9.75a1 1 0 00.95-.69l1.519-4.674z"/></svg>`;
    } else if (act.type === "order") {
      iconSvg = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`;
    }
    
    const li = document.createElement("li");
    li.className = "activity-feed-item";
    li.innerHTML = `
      <div class="activity-icon-node">${iconSvg}</div>
      <div class="activity-details">
        <div class="activity-title">${act.text}</div>
        <div class="activity-time">${act.time}</div>
      </div>
    `;
    container.appendChild(li);
  });
}

// 3. Product Manager Table
function renderProductTable() {
  const tbody = document.getElementById("product-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const filterCat = document.getElementById("filter-product-category").value;
  const searchVal = document.getElementById("search-product-input").value.toLowerCase();
  
  let filteredProducts = products.filter(p => {
    const matchCat = filterCat === "all" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(searchVal);
    return matchCat && matchSearch;
  });

  document.getElementById("product-table-showing-info").innerText = `Menampilkan ${filteredProducts.length} produk`;

  filteredProducts.forEach(p => {
    let fillGradient = "#edebe9";
    if (p.category === "Espresso") fillGradient = "#e8d8c8";
    if (p.category === "Refresher") fillGradient = "#ffd4d4";
    if (p.category === "Frappuccino") fillGradient = "#d8f5d8";
    if (p.category === "Food") fillGradient = "#fff9ea";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="product-row-img" style="background-color: ${fillGradient};">
          <svg viewBox="0 0 100 100" width="28" height="28" fill="#1E3932"><path d="M70 30c0-10-8-18-18-18S34 20 34 30v40c0 10 8 18 18 18s18-8 18-18V30zm-18-8c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z"/></svg>
        </div>
      </td>
      <td><span class="product-name-primary">${p.name}</span></td>
      <td><span class="badge badge-success">${p.category}</span></td>
      <td><strong>Rp ${p.price.toLocaleString("id-ID")}</strong></td>
      <td><span style="color: var(--sb-gold); font-weight: 600;">★ ${p.stars}</span></td>
      <td>
        <span class="badge ${p.stock < 15 ? 'badge-danger' : 'badge-info'}">
          ${p.stock} Pcs
        </span>
      </td>
      <td>
        <div class="table-row-actions">
          <button class="btn-table-action edit" onclick="openEditProductModal('${p.id}')" title="Edit">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button class="btn-table-action delete" onclick="deleteProductConfirm('${p.id}')" title="Hapus">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("filter-product-category").addEventListener("change", renderProductTable);
document.getElementById("search-product-input").addEventListener("input", renderProductTable);

// 4. Order History Table
function renderOrderTable() {
  const tbody = document.getElementById("order-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const filterStatus = document.getElementById("filter-order-status").value;
  const searchVal = document.getElementById("search-order-input").value.toLowerCase();
  
  let filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = o.customer.toLowerCase().includes(searchVal) || o.id.toLowerCase().includes(searchVal);
    return matchStatus && matchSearch;
  });

  filteredOrders.forEach(o => {
    let badgeClass = "badge-info";
    if (o.status === "Selesai") badgeClass = "badge-success";
    if (o.status === "Dibatalkan") badgeClass = "badge-danger";
    if (o.status === "Diproses") badgeClass = "badge-warning";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${o.id}</strong></td>
      <td><strong>${o.customer}</strong></td>
      <td><span class="badge badge-info">${o.type}</span></td>
      <td><span style="font-size: 1.3rem;">${o.items}</span></td>
      <td>${o.date}</td>
      <td><span class="badge ${badgeClass}">${o.status}</span></td>
      <td><strong>Rp ${o.total.toLocaleString("id-ID")}</strong></td>
      <td>
        <div style="display:flex; gap: 0.5rem;">
          <button class="btn-secondary" style="font-size: 1.1rem; padding: 0.4rem 1rem;" onclick="updateOrderStatus('${o.id}', 'Selesai')">Selesai</button>
          <button class="btn-secondary" style="font-size: 1.1rem; padding: 0.4rem 1rem; color: var(--color-danger); border-color: rgba(200, 32, 20, 0.2);" onclick="updateOrderStatus('${o.id}', 'Dibatalkan')">Batal</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("filter-order-status").addEventListener("change", renderOrderTable);
document.getElementById("search-order-input").addEventListener("input", renderOrderTable);

// Status Update for Orders
window.updateOrderStatus = function(orderId, newStatus) {
  orders = orders.map(o => {
    if (o.id === orderId) {
      // Log activity on transition
      if (o.status !== newStatus) {
        logActivity(`Status pesanan ${orderId} diubah menjadi: ${newStatus}`, "order");
      }
      return { ...o, status: newStatus };
    }
    return o;
  });
  localStorage.setItem("sb_orders", JSON.stringify(orders));
  showToast(`Pesanan ${orderId} berhasil diupdate ke ${newStatus}.`, "success");
  refreshAllTables();
};

// Helper to log system activity
function logActivity(text, type = "system") {
  activities.unshift({ text, time: "Baru saja", type });
  localStorage.setItem("sb_activities", JSON.stringify(activities));
}

// 5. Star Members Table
function renderMemberTable() {
  const tbody = document.getElementById("member-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const searchVal = document.getElementById("search-member-input").value.toLowerCase();
  
  let filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchVal));

  filteredMembers.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=006241&color=fff&rounded=true" width="34" height="34" alt="Member Avatar">
      </td>
      <td><strong>${m.name}</strong></td>
      <td>${m.email}</td>
      <td>
        <span style="font-size: 1.5rem; color: var(--sb-gold); font-weight: 700;">
          ★ ${m.stars}
        </span>
      </td>
      <td><code>${m.card}</code></td>
      <td><span class="badge ${m.tier === 'Gold Member' ? 'badge-warning' : 'badge-success'}">${m.tier}</span></td>
      <td>
        <span style="font-size: 1.2rem;">
          ${m.stars >= 100 ? '☕ 1x Minuman Gratis' : 'Kumpulkan bintang'}
        </span>
      </td>
      <td>
        <button class="btn-action-primary" style="font-size: 1.2rem; padding: 0.6rem 1.2rem;" onclick="addStarsToMember('${m.id}')">
          +10 Bintang
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("search-member-input").addEventListener("input", renderMemberTable);

// Add stars interaction
window.addStarsToMember = function(memberId) {
  members = members.map(m => {
    if (m.id === memberId) {
      const newStars = m.stars + 10;
      // Upgrade tier if needed
      let currentTier = m.tier;
      if (newStars >= 120 && m.tier !== "Gold Member") {
        currentTier = "Gold Member";
        logActivity(`Kenaikan level! Member ${m.name} telah mencapai Gold Level.`, "member");
        showToast(`✓ Member ${m.name} naik ke tingkat Gold Tier!`, "success");
      }
      return { ...m, stars: newStars, tier: currentTier };
    }
    return m;
  });
  localStorage.setItem("sb_members", JSON.stringify(members));
  showToast("Bintang berhasil ditambahkan ke akun member.", "success");
  refreshAllTables();
};

// =========================================================================
// OPERATIONS: 1. STAFF & SHIFTS
// =========================================================================

function renderStaffTable() {
  const tbody = document.getElementById("staff-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const filterShift = document.getElementById("filter-staff-shift").value;
  const searchVal = document.getElementById("search-staff-input").value.toLowerCase();
  
  let filteredStaff = staff.filter(s => {
    const matchShift = filterShift === "all" || s.shift === filterShift;
    const matchSearch = s.name.toLowerCase().includes(searchVal);
    return matchShift && matchSearch;
  });

  filteredStaff.forEach(s => {
    let statusClass = "badge-success";
    if (s.status === "Istirahat") statusClass = "badge-warning";
    if (s.status === "Off") statusClass = "badge-danger";

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1E3932&color=fff&rounded=true" width="34" height="34" alt="Staff Avatar">
      </td>
      <td><strong>${s.name}</strong></td>
      <td><span style="font-size: 1.3rem; color: var(--text-secondary);">${s.role}</span></td>
      <td><span class="badge badge-info">Shift ${s.shift}</span></td>
      <td><span class="badge ${statusClass}">${s.status}</span></td>
      <td><span style="color: var(--sb-gold); font-weight:600;">★ ${s.rating}</span></td>
      <td>
        <div style="display:flex; gap:0.5rem;">
          <select class="chart-filter-select" style="padding: 0.2rem 0.5rem; font-size: 1.2rem;" onchange="changeStaffStatus('${s.id}', this.value)">
            <option value="Aktif" ${s.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
            <option value="Istirahat" ${s.status === 'Istirahat' ? 'selected' : ''}>Istirahat</option>
            <option value="Off" ${s.status === 'Off' ? 'selected' : ''}>Off Duty</option>
          </select>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("filter-staff-shift").addEventListener("change", renderStaffTable);
document.getElementById("search-staff-input").addEventListener("input", renderStaffTable);

window.changeStaffStatus = function(staffId, newStatus) {
  staff = staff.map(s => {
    if (s.id === staffId) {
      if (s.status !== newStatus) {
        logActivity(`Status kerja ${s.name} diubah menjadi: ${newStatus}`, "system");
      }
      return { ...s, status: newStatus };
    }
    return s;
  });
  localStorage.setItem("sb_staff", JSON.stringify(staff));
  showToast("Status kerja barista berhasil diubah.", "success");
  renderStaffTable();
};

// Add new staff Modal trigger
document.getElementById("btn-add-new-staff").addEventListener("click", () => {
  const bodyContent = `
    <div style="display:flex; flex-direction:column; gap: 1.5rem; text-align: left;">
      <div class="form-group-block">
        <label class="form-label-text">Nama Lengkap Barista</label>
        <input type="text" class="form-control-input" id="new-staff-name" placeholder="Misal: Andi Wijaya">
      </div>
      
      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Jabatan / Role</label>
          <select class="form-control-input" id="new-staff-role">
            <option value="Barista">Barista</option>
            <option value="Shift Supervisor">Shift Supervisor</option>
            <option value="Store Manager">Store Manager</option>
          </select>
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Shift Hari Ini</label>
          <select class="form-control-input" id="new-staff-shift">
            <option value="Pagi">Shift Pagi</option>
            <option value="Siang">Shift Siang</option>
            <option value="Malam">Shift Malam</option>
          </select>
        </div>
      </div>
    </div>
  `;

  window.showCustomModal("Tambah Staf Barista Baru", bodyContent, "Tambah Staf", () => {
    const name = document.getElementById("new-staff-name").value;
    const role = document.getElementById("new-staff-role").value;
    const shift = document.getElementById("new-staff-shift").value;

    if (!name) {
      showToast("Nama staf tidak boleh kosong!", "error");
      return;
    }

    const newId = `S-0${staff.length + 1}`;
    const newStaff = { id: newId, name, role, shift, status: "Aktif", rating: "5.0" };

    staff.push(newStaff);
    localStorage.setItem("sb_staff", JSON.stringify(staff));

    logActivity(`Menambahkan staf baru ke jadwal: ${name} (${role})`, "system");
    showToast(`✓ Berhasil mendaftarkan staf: ${name}`, "success");
    renderStaffTable();
  });
});

// =========================================================================
// OPERATIONS: 2. INVENTORY & SUPPLY CHAIN
// =========================================================================

function renderInventoryTable() {
  const tbody = document.getElementById("inventory-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterStatus = document.getElementById("filter-inventory-status").value;
  const searchVal = document.getElementById("search-inventory-input").value.toLowerCase();

  let filteredInventory = inventory.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(searchVal);
    
    let matchStatus = true;
    if (filterStatus === "Cukup") matchStatus = i.status === "Cukup";
    else if (filterStatus === "Hampir Habis") matchStatus = i.status === "Hampir Habis";
    else if (filterStatus === "Habis") matchStatus = i.status === "Habis";

    return matchSearch && matchStatus;
  });

  filteredInventory.forEach(item => {
    let statusClass = "badge-success";
    if (item.status === "Hampir Habis") statusClass = "badge-warning";
    if (item.status === "Habis") statusClass = "badge-danger";

    // Calculate percentage progress bar
    let percentage = Math.min(100, Math.round((item.qty / item.maxQty) * 100));
    let progressColor = "var(--sb-green-accent)";
    if (item.status === "Hampir Habis") progressColor = "var(--sb-gold)";
    if (item.status === "Habis") progressColor = "var(--color-danger)";

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td><span class="badge badge-info">${item.category}</span></td>
      <td><strong>${item.qty}</strong></td>
      <td><code>${item.unit}</code></td>
      <td>
        <div style="display:flex; align-items:center; gap:0.8rem; width:100%;">
          <div style="background-color: var(--bg-tertiary); border-radius: 5px; height: 8px; flex-grow: 1; position: relative; overflow:hidden;">
            <div style="background-color: ${progressColor}; height:100%; width: ${percentage}%;"></div>
          </div>
          <span style="font-size: 1.2rem; font-weight:600; width: 30px; text-align:right;">${percentage}%</span>
        </div>
      </td>
      <td><span class="badge ${statusClass}">${item.status}</span></td>
      <td>
        <button class="btn-action-primary" style="font-size: 1.1rem; padding: 0.4rem 1rem;" onclick="restockInventoryItem('${item.id}')">
          Restock +10
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("filter-inventory-status").addEventListener("change", renderInventoryTable);
document.getElementById("search-inventory-input").addEventListener("input", renderInventoryTable);

window.restockInventoryItem = function(itemId) {
  inventory = inventory.map(item => {
    if (item.id === itemId) {
      const newQty = item.qty + 10;
      let newStatus = "Cukup";
      const pct = (newQty / item.maxQty) * 100;
      if (pct <= 0) newStatus = "Habis";
      else if (pct < 20) newStatus = "Hampir Habis";

      logActivity(`Restock inventaris: ${item.name} (+10 ${item.unit})`, "system");
      return { ...item, qty: newQty, status: newStatus };
    }
    return item;
  });
  localStorage.setItem("sb_inventory", JSON.stringify(inventory));
  showToast("Inventaris berhasil di-restock.", "success");
  renderInventoryTable();
};

// Reorder all low stock items automatically
document.getElementById("btn-reorder-all-low").addEventListener("click", () => {
  let lowItems = inventory.filter(i => i.status === "Hampir Habis" || i.status === "Habis");
  if (lowItems.length === 0) {
    showToast("Semua persediaan bahan baku di store mencukupi.", "success");
    return;
  }

  showConfirmModal("Konfirmasi Pesan Bahan Baku", `Apakah Anda ingin memesan restock otomatis ke Supplier untuk ${lowItems.length} bahan baku yang menipis?`, () => {
    inventory = inventory.map(item => {
      if (item.status === "Hampir Habis" || item.status === "Habis") {
        const addedQty = Math.round(item.maxQty - item.qty);
        logActivity(`Pemesanan otomatis ke supplier: ${item.name} (+${addedQty} ${item.unit})`, "system");
        return { ...item, qty: item.maxQty, status: "Cukup" };
      }
      return item;
    });
    localStorage.setItem("sb_inventory", JSON.stringify(inventory));
    showToast("✓ Pemesanan restock terkirim ke supplier. Persediaan terisi penuh!", "success");
    renderInventoryTable();
  });
});


// =========================================================================
// OPERATIONS: 3. CAMPAIGNS & PROMOTIONS
// =========================================================================

function renderPromoTable() {
  const tbody = document.getElementById("promo-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterStatus = document.getElementById("filter-promo-status").value;
  const searchVal = document.getElementById("search-promo-input").value.toLowerCase();

  let filteredPromos = promotions.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchVal) || p.code.toLowerCase().includes(searchVal);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  filteredPromos.forEach(p => {
    let statusClass = "badge-success";
    if (p.status === "Dijadwalkan") statusClass = "badge-info";
    if (p.status === "Berakhir") statusClass = "badge-danger";

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td><code>${p.code}</code></td>
      <td>${p.type}</td>
      <td><span style="font-weight: 600; color: var(--sb-green-accent);">${p.value}</span></td>
      <td>${p.period}</td>
      <td><span class="badge ${statusClass}">${p.status}</span></td>
      <td>
        <button class="btn-secondary" style="font-size: 1.1rem; padding: 0.4rem 1rem;" onclick="togglePromoStatus('${p.id}')">
          ${p.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("filter-promo-status").addEventListener("change", renderPromoTable);
document.getElementById("search-promo-input").addEventListener("input", renderPromoTable);

window.togglePromoStatus = function(promoId) {
  promotions = promotions.map(p => {
    if (p.id === promoId) {
      let nextStatus = p.status === "Aktif" ? "Berakhir" : "Aktif";
      logActivity(`Mengubah status promo ${p.name} menjadi: ${nextStatus}`, "analytics");
      return { ...p, status: nextStatus };
    }
    return p;
  });
  localStorage.setItem("sb_promotions", JSON.stringify(promotions));
  showToast("Status promosi berhasil diubah.", "success");
  renderPromoTable();
};

// Create new promo modal
document.getElementById("btn-add-new-promo").addEventListener("click", () => {
  const bodyContent = `
    <div style="display:flex; flex-direction:column; gap: 1.5rem; text-align: left;">
      <div class="form-group-block">
        <label class="form-label-text">Nama Kampanye Promo</label>
        <input type="text" class="form-control-input" id="new-promo-name" placeholder="Misal: Autumn Latte Special Discount">
      </div>

      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Kode Voucher</label>
          <input type="text" class="form-control-input" id="new-promo-code" placeholder="AUTUMNLATTE">
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Masa Berlaku / Hari</label>
          <input type="text" class="form-control-input" id="new-promo-period" placeholder="Senin - Rabu">
        </div>
      </div>
      
      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Tipe Diskon</label>
          <select class="form-control-input" id="new-promo-type">
            <option value="Rewards Boost">Rewards Boost</option>
            <option value="Potongan Langsung">Potongan Langsung</option>
            <option value="Beli 1 Gratis 1">Beli 1 Gratis 1</option>
            <option value="Persentase Diskon">Persentase Diskon</option>
          </select>
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Besar Diskon / Nilai</label>
          <input type="text" class="form-control-input" id="new-promo-value" placeholder="25% atau Rp 15.000">
        </div>
      </div>
    </div>
  `;

  window.showCustomModal("Buat Kampanye Promo Baru", bodyContent, "Buat Promo", () => {
    const name = document.getElementById("new-promo-name").value;
    const code = document.getElementById("new-promo-code").value.toUpperCase();
    const period = document.getElementById("new-promo-period").value;
    const type = document.getElementById("new-promo-type").value;
    const value = document.getElementById("new-promo-value").value;

    if (!name || !code) {
      showToast("Nama promo dan kode voucher tidak boleh kosong!", "error");
      return;
    }

    const newId = `P-0${promotions.length + 1}`;
    const newPromo = { id: newId, name, code, type, value, period, status: "Dijadwalkan" };

    promotions.push(newPromo);
    localStorage.setItem("sb_promotions", JSON.stringify(promotions));

    logActivity(`Membuat promo baru: ${name} (Kode: ${code})`, "analytics");
    showToast(`✓ Promo ${name} dijadwalkan!`, "success");
    renderPromoTable();
  });
});

// =========================================================================
// MODAL SYSTEM
// =========================================================================

const modalOverlay = document.getElementById("modal-overlay");
const btnModalClose = document.getElementById("btn-modal-close");
const btnModalSecondary = document.getElementById("btn-modal-secondary");
const btnModalPrimary = document.getElementById("btn-modal-primary");

let modalSuccessCallback = null;

window.showCustomModal = function(title, bodyHTML, primaryBtnText = "Simpan", successCallback = null) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-body").innerHTML = bodyHTML;
  btnModalPrimary.innerText = primaryBtnText;
  
  modalSuccessCallback = successCallback;
  
  modalOverlay.classList.add("active");
};

window.closeModal = function() {
  modalOverlay.classList.remove("active");
};

btnModalClose.addEventListener("click", window.closeModal);
btnModalSecondary.addEventListener("click", window.closeModal);

btnModalPrimary.addEventListener("click", () => {
  if (modalSuccessCallback) {
    modalSuccessCallback();
  }
  window.closeModal();
});

// Confirmation Modal helper
window.showConfirmModal = function(title, message, onConfirm) {
  window.showCustomModal(title, `<p style="font-size: 1.5rem; line-height: 1.6;">${message}</p>`, "Ya, Lanjutkan", onConfirm);
};

// =========================================================================
// PRODUCT CRUD - MODAL TRIGGERS
// =========================================================================

// Add product modal
document.getElementById("btn-add-new-product").addEventListener("click", () => {
  const bodyContent = `
    <div style="display:flex; flex-direction:column; gap: 1.5rem; text-align: left;">
      <div class="form-group-block">
        <label class="form-label-text">Nama Produk Kopi</label>
        <input type="text" class="form-control-input" id="new-prod-name" placeholder="Misal: Vanilla Sweet Cream Cold Brew">
      </div>
      
      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Kategori Menu</label>
          <select class="form-control-input" id="new-prod-category">
            <option value="Espresso">Espresso</option>
            <option value="Frappuccino">Frappuccino</option>
            <option value="Refresher">Refresher</option>
            <option value="Tea">Teas</option>
            <option value="Food">Bakery & Food</option>
          </select>
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Harga Jual (IDR)</label>
          <input type="number" class="form-control-input" id="new-prod-price" placeholder="48000">
        </div>
      </div>

      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Star Points Klaim</label>
          <input type="number" class="form-control-input" id="new-prod-stars" value="100">
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Stok Bahan / Cups</label>
          <input type="number" class="form-control-input" id="new-prod-stock" value="100">
        </div>
      </div>
    </div>
  `;

  window.showCustomModal("Tambah Menu Produk Baru", bodyContent, "Tambah Menu", () => {
    const name = document.getElementById("new-prod-name").value;
    const category = document.getElementById("new-prod-category").value;
    const price = parseFloat(document.getElementById("new-prod-price").value) || 0;
    const stars = parseInt(document.getElementById("new-prod-stars").value) || 100;
    const stock = parseInt(document.getElementById("new-prod-stock").value) || 0;

    if (!name) {
      window.showToast("Nama produk tidak boleh kosong!", "error");
      return;
    }

    const newId = String(products.length + 1);
    const newProd = { id: newId, name, category, price, stars, stock };
    
    products.push(newProd);
    localStorage.setItem("sb_products", JSON.stringify(products));
    
    logActivity(`Menambahkan menu produk baru: ${name}`, "system");
    window.showToast(`Berhasil menambahkan produk: ${name}`, "success");
    refreshAllTables();
  });
});

// Edit product modal
window.openEditProductModal = function(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;

  const bodyContent = `
    <div style="display:flex; flex-direction:column; gap: 1.5rem; text-align: left;">
      <div class="form-group-block">
        <label class="form-label-text">Nama Produk Kopi</label>
        <input type="text" class="form-control-input" id="edit-prod-name" value="${prod.name}">
      </div>
      
      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Kategori Menu</label>
          <select class="form-control-input" id="edit-prod-category">
            <option value="Espresso" ${prod.category === 'Espresso' ? 'selected' : ''}>Espresso</option>
            <option value="Frappuccino" ${prod.category === 'Frappuccino' ? 'selected' : ''}>Frappuccino</option>
            <option value="Refresher" ${prod.category === 'Refresher' ? 'selected' : ''}>Refresher</option>
            <option value="Tea" ${prod.category === 'Tea' ? 'selected' : ''}>Teas</option>
            <option value="Food" ${prod.category === 'Food' ? 'selected' : ''}>Bakery & Food</option>
          </select>
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Harga Jual (IDR)</label>
          <input type="number" class="form-control-input" id="edit-prod-price" value="${prod.price}">
        </div>
      </div>

      <div class="form-grid-row">
        <div class="form-group-block">
          <label class="form-label-text">Star Points Klaim</label>
          <input type="number" class="form-control-input" id="edit-prod-stars" value="${prod.stars}">
        </div>
        <div class="form-group-block">
          <label class="form-label-text">Stok Bahan / Cups</label>
          <input type="number" class="form-control-input" id="edit-prod-stock" value="${prod.stock}">
        </div>
      </div>
    </div>
  `;

  window.showCustomModal("Edit Menu Produk", bodyContent, "Simpan Perubahan", () => {
    const name = document.getElementById("edit-prod-name").value;
    const category = document.getElementById("edit-prod-category").value;
    const price = parseFloat(document.getElementById("edit-prod-price").value) || 0;
    const stars = parseInt(document.getElementById("edit-prod-stars").value) || 0;
    const stock = parseInt(document.getElementById("edit-prod-stock").value) || 0;

    products = products.map(p => {
      if (p.id === id) {
        return { ...p, name, category, price, stars, stock };
      }
      return p;
    });

    localStorage.setItem("sb_products", JSON.stringify(products));
    window.showToast(`Menu ${name} berhasil diubah.`, "success");
    refreshAllTables();
  });
};

// Delete product
window.deleteProductConfirm = function(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;

  window.showConfirmModal("Hapus Menu", `Apakah Anda yakin ingin menghapus produk "${prod.name}" dari menu starbucks?`, () => {
    products = products.filter(p => p.id !== id);
    localStorage.setItem("sb_products", JSON.stringify(products));
    
    logActivity(`Menghapus menu produk: ${prod.name}`, "system");
    window.showToast(`Produk ${prod.name} telah dihapus.`, "error");
    refreshAllTables();
  });
};

// =========================================================================
// TOAST ALERT NOTIFICATIONS SYSTEM
// =========================================================================

window.showToast = function(message, type = "normal") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast-popup-item ${type}`;
  
  let iconSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  if (type === "success") {
    iconSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Trigger reflow & animation
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Auto remove toast
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// =========================================================================
// CHART INITIALIZATION (CHART.JS)
// =========================================================================

let chartInstances = {};

function getChartThemeColors() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    text: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    gridLines: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    tooltipBg: isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
    tooltipText: isDark ? "#ffffff" : "#000000"
  };
}

function destroyCharts() {
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
    }
  });
  chartInstances = {};
}

function initCharts() {
  const colors = getChartThemeColors();
  
  // Canvas check
  const ctxSales = document.getElementById("salesTrendsChart");
  const ctxCategory = document.getElementById("categoryRatioChart");
  const ctxMonthly = document.getElementById("monthlySalesChart");
  const ctxHourly = document.getElementById("hourlyPeakChart");

  if (!ctxSales) return; // Wait until view is active/rendered

  // 1. Line Area Chart (Sales Trends)
  chartInstances.sales = new Chart(ctxSales, {
    type: 'line',
    data: {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      datasets: [{
        label: 'Penjualan Hari Ini',
        data: [8200000, 9500000, 7100000, 11400000, 10800000, 14900000, 12845000],
        borderColor: '#00754A',
        backgroundColor: 'rgba(0, 117, 74, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#006241',
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: colors.gridLines },
          ticks: { color: colors.text }
        },
        y: {
          grid: { color: colors.gridLines },
          ticks: {
            color: colors.text,
            callback: function(value) { return 'Rp ' + (value/1000000) + 'M'; }
          }
        }
      }
    }
  });

  // 2. Doughnut Chart (Category Sales Ratio)
  chartInstances.category = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: ['Espresso', 'Frappuccino', 'Refresher', 'Food & Teas'],
      datasets: [{
        data: [45, 25, 18, 12],
        backgroundColor: ['#1E3932', '#00754A', '#cba258', '#EDEBE9'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: colors.text }
        }
      }
    }
  });

  // 3. Monthly Sales Analytics Chart
  chartInstances.monthly = new Chart(ctxMonthly, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [{
        label: 'Pendapatan Toko (Juta Rp)',
        data: [198, 220, 245, 280, 265, 305],
        backgroundColor: '#00754A',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: colors.gridLines },
          ticks: { color: colors.text }
        },
        y: {
          grid: { color: colors.gridLines },
          ticks: { color: colors.text }
        }
      }
    }
  });

  // 4. Hourly peak transaction chart
  chartInstances.hourly = new Chart(ctxHourly, {
    type: 'line',
    data: {
      labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      datasets: [{
        label: 'Jumlah Transaksi',
        data: [42, 28, 65, 38, 55, 78, 40],
        borderColor: '#cba258',
        backgroundColor: 'rgba(203, 162, 88, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: colors.gridLines },
          ticks: { color: colors.text }
        },
        y: {
          grid: { color: colors.gridLines },
          ticks: { color: colors.text }
        }
      }
    }
  });
}

// Initial Call
refreshAllTables();
if (isLogged) {
  initCharts();
}
