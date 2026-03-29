import { AuthService } from "../../services/authService.js";
import { loadUserWindow } from "./users.js";
import { loadLogWindow } from "./activityLog.js";
import { initModal, openModal, closeModal } from "../components/modal.js";
import { ActivityService } from "../../services/activityLogService.js";
import { initProductPage } from "../../services/productService.js";
import { initReportPage } from "../../services/reportService.js";
// Selectors
const menu = document.querySelector(".menu");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const profile = document.querySelector(".user-profile");
const usersItem = document.querySelector(".users");
const supplierItem = document.querySelector(".supplier");
let dashboardHTML = "";

// APIs
const Product_API = "http://localhost:3000/product";
const Supplier_API = "http://localhost:3000/suppliers";
const Activity_API = "http://localhost:3000/activityLogs";
const Category_API = "http://localhost:3000/categories";
const Users_API = "http://localhost:3000/users";
const Adjustment_API = "http://localhost:3000/adjustment";


function checkRole() {
  const usr = AuthService.getCurrentUser();

  if (!usr) {
    usersItem.classList.add("d-none");
    return;
  }

  usersItem.classList.toggle("d-none", usr.role !== "admin");
}

function renderUserProfile() {
  const usr = AuthService.getCurrentUser();

  if (!usr) {
    profile.innerText = "Guest";
    return;
  }

  profile.innerText = usr.name;
}


async function loadCategoryDropdown() {
  try {
    const res = await fetch(Category_API);
    const categories = res.ok ? await res.json() : [];
    const dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.innerHTML = `<li><a class="dropdown-item" href="#">All</a></li>`;
    categories.forEach((cat) => {
      dropdownMenu.innerHTML += `<li><a class="dropdown-item" href="#">${cat.name}</a></li>`;
    });
  } catch (err) {
    console.error("Failed to load categories for dropdown:", err);
  }
}


async function loadReportsPage() {
  try {
    const res = await fetch("../../pages/reports.html");
    const html = await res.text();
    document.querySelector(".contentArea").innerHTML = html;
    if (typeof initReportPage === "function") initReportPage();
  } catch (err) {
    console.error("Failed to load reports page:", err);
  }
}

function clearCategoryDropdown() {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  if (dropdownMenu) dropdownMenu.innerHTML = `<li><a class="dropdown-item" href="#">All</a></li>`;
}

function renderCardsData(allProducts, allSuppliers) {
  const totalProductsEl = document.querySelector(".total-products h5");
  const totalSuppliersEl = document.querySelector(".total-suppliers h5");
  const lowStockItemsEl = document.querySelector(".low-stock-items h5");
  const inventoryValuesEl = document.querySelector(".inventory-values h5");

  if (totalProductsEl) totalProductsEl.textContent = allProducts.length.toLocaleString();
  if (totalSuppliersEl) totalSuppliersEl.textContent = allSuppliers.length;

  const lowStockItems = allProducts.filter((p) => +p.stock < +p.Reorder_Level);
  if (lowStockItemsEl) lowStockItemsEl.textContent = lowStockItems.length;

  const totalUnits = allProducts.reduce((sum, p) => sum + (+p.stock || 0), 0);
  if (inventoryValuesEl) inventoryValuesEl.textContent = totalUnits.toLocaleString() + " units";
}

function renderLowStockTable(allProducts) {
  const tbody = document.querySelector(".low-stock-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const lowItems = allProducts.filter((p) => +p.stock < +p.Reorder_Level);
  if (lowItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No low stock items 🎉</td></tr>`;
    return;
  }
  lowItems.forEach((item) => {
    const color = +item.stock <= 10 ? "text-danger" : "text-warning";
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.sku}</td>
        <td class="${color}">${item.stock} units</td>
        <td>${item.Reorder_Level}</td>
      </tr>`;
  });
}

function renderActivityTable(activities, users) {
  const tbody = document.querySelector(".activity-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!activities || activities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No recent activity</td></tr>`;
    return;
  }
  const userMap = {};
  users.forEach((u) => { userMap[u.id] = u.name; });
  [...activities].reverse().slice(0, 5).forEach((log) => {
    const userName = userMap[log.userId] || log.userId;
    tbody.innerHTML += `
      <tr>
        <td>${log.action}</td>
        <td>${log.entity}</td>
        <td>${userName}</td>
        <td>${log.date}</td>
      </tr>`;
  });
}


async function loadDashboardData() {
  try {
    const [productsRes, suppliersRes, activityRes, usersRes] = await Promise.all([
      fetch(Product_API),
      fetch(Supplier_API),
      fetch(Activity_API),
      fetch(Users_API),
    ]);
    const allProducts = productsRes.ok ? await productsRes.json() : [];
    const allSuppliers = suppliersRes.ok ? await suppliersRes.json() : [];
    const activities = activityRes.ok ? await activityRes.json() : [];
    const users = usersRes.ok ? await usersRes.json() : [];
    renderCardsData(allProducts, allSuppliers);
    renderLowStockTable(allProducts);
    renderActivityTable(activities, users);
  } catch (error) {
    console.error("Dashboard load error:", error);
  }
}



function restoreDashboard() {
  const contentArea = document.querySelector(".contentArea");
  if (!contentArea || !dashboardHTML) return;

  contentArea.innerHTML = dashboardHTML;
  loadDashboardData();
  loadCategoryDropdown();
  initQuickActions();
}
async function loadProductsPage() {
  try {
    const res = await fetch("../../pages/products.html");
    const html = await res.text();
    document.querySelector(".contentArea").innerHTML = html;

    // Call the initialization for the products page
    if (typeof initProductPage === "function") {
      initProductPage();
    }

  } catch (err) {
    console.error("Failed to load products page:", err);
  }
}

async function openAddProductModal() {
  const res = await fetch(Category_API);
  const categories = res.ok ? await res.json() : [];

  const categoryOptions = categories
    .map((c) => `<option value="${c.name}">${c.name}</option>`)
    .join("");

  const content = `
    <form id="add-product-form">
      <div class="mb-3">
        <label class="form-label">Product Name</label>
        <input type="text" id="dp-name" class="form-control" placeholder="e.g. Laptop" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Category</label>
        <select id="dp-category" class="form-select" required>
          <option value="">Select Category</option>
          ${categoryOptions}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Supplier</label>
        <input type="text" id="dp-supplier" class="form-control" placeholder="Supplier name" required />
      </div>
      <div class="row">
        <div class="col mb-3">
          <label class="form-label">Stock</label>
          <input type="number" id="dp-stock" class="form-control" placeholder="0" required />
        </div>
        <div class="col mb-3">
          <label class="form-label">Reorder Level</label>
          <input type="number" id="dp-reorder" class="form-control" placeholder="0" required />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">SKU</label>
        <input type="text" id="dp-sku" class="form-control" placeholder="e.g. LAP-001" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Image URL <small class="text-muted">(optional)</small></label>
        <input type="text" id="dp-image" class="form-control" placeholder="https://..." />
      </div>
      <button type="submit" class="btn w-100" style="background-color:#9333ea;color:white">
        <i class="fa-solid fa-plus me-1"></i> Add Product
      </button>
    </form>
  `;

  const modalEl = openModal("Add Product", content);

  modalEl.querySelector("#add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = modalEl.querySelector("#dp-name").value.trim();
    const category = modalEl.querySelector("#dp-category").value;
    const supplier = modalEl.querySelector("#dp-supplier").value.trim();
    const stock = modalEl.querySelector("#dp-stock").value;
    const reorder = modalEl.querySelector("#dp-reorder").value;
    const sku = modalEl.querySelector("#dp-sku").value.trim();
    const image = modalEl.querySelector("#dp-image").value.trim();

    if (!name || !category || !supplier || !stock || !reorder || !sku) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const postRes = await fetch(Product_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, supplier, stock, Reorder_Level: reorder, sku, image }),
      });
      if (!postRes.ok) throw new Error("Failed to add product");
      alert("Product added successfully!");
      closeModal();
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  });
}

async function openAddCategoryModal() {
  const res = await fetch(Category_API);
  const categories = res.ok ? await res.json() : [];

  const listItems = categories.length
    ? categories.map((cat) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>${cat.name}</span>
          <button class="btn btn-sm btn-outline-danger delete-cat-btn" data-id="${cat.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </li>`).join("")
    : `<li class="list-group-item text-muted">No categories yet.</li>`;

  const content = `
    <div class="d-flex gap-2 mb-3">
      <input type="text" id="new-cat-name" class="form-control" placeholder="Category name..." />
      <button id="save-cat-btn" class="btn" style="background-color:#9333ea;color:white;white-space:nowrap">
        <i class="fa-solid fa-plus me-1"></i> Add
      </button>
    </div>
    <ul class="list-group" id="cat-list">
      ${listItems}
    </ul>
  `;

  const modalEl = openModal("Add Category", content);

  modalEl.querySelector("#save-cat-btn").addEventListener("click", async () => {
    const name = modalEl.querySelector("#new-cat-name").value.trim();
    if (!name) { alert("Please enter a category name."); return; }
    await fetch(Category_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: [] }),
    });
    loadCategoryDropdown();
    openAddCategoryModal();
  });

  modalEl.querySelector("#cat-list").addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-cat-btn");
    if (!btn) return;
    if (!confirm("Delete this category?")) return;
    await fetch(`${Category_API}/${btn.dataset.id}`, { method: "DELETE" });
    loadCategoryDropdown();
    openAddCategoryModal();
  });
}

async function openAdjustStockModal() {
  const res = await fetch(Product_API);
  const products = res.ok ? await res.json() : [];

  const uniqueSkus = [...new Set(products.map((p) => p.sku))];
  const skuOptions = uniqueSkus
    .map((sku) => `<option value="${sku}">${sku}</option>`)
    .join("");

  const content = `
    <div id="adj-form">
      <div class="mb-3">
        <label class="form-label">Select Product (SKU)</label>
        <select id="adj-sku" class="form-select">
          <option value="">select Product</option>
          ${skuOptions}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Current Stock</label>
        <input type="number" id="adj-quantity" class="form-control" disabled placeholder="—" />
      </div>
      <div class="mb-3">
        <label class="form-label">Category</label>
        <input type="text" id="adj-category" class="form-control" disabled placeholder="—" />
      </div>
      <div class="mb-3">
        <label class="form-label">Action</label>
        <select id="adj-action" class="form-select">
          <option value="">Select action</option>
          <option value="increase">Increase</option>
          <option value="decrease">Decrease</option>
        </select>
      </div>
      <div class="mb-3" id="adj-amount-row" style="display:none">
        <div id="adj-amount-label-wrap"></div>
        <input type="number" id="adj-amount" class="form-control" placeholder="Enter new stock value" min="0" />
      </div>
      <div class="mb-3">
        <label class="form-label">Reason <small class="text-muted">(optional)</small></label>
        <input type="text" id="adj-reason" class="form-control" placeholder="e.g. damage, restock..." />
      </div>
      <button id="adj-btn" class="btn w-100 btn-warning">
        <i class="fa-solid fa-arrow-up-down me-1"></i> Apply Adjustment
      </button>
    </div>
  `;

  const modalEl = openModal("Adjust Stock", content);

  let selectedProduct = null;

  modalEl.querySelector("#adj-sku").addEventListener("change", function () {
    selectedProduct = products.find((p) => p.sku === this.value) || null;
    if (selectedProduct) {
      modalEl.querySelector("#adj-quantity").value = selectedProduct.stock;
      modalEl.querySelector("#adj-category").value = selectedProduct.category;
    } else {
      modalEl.querySelector("#adj-quantity").value = "";
      modalEl.querySelector("#adj-category").value = "";
    }
    // reset action & amount when switching product
    modalEl.querySelector("#adj-action").value = "";
    modalEl.querySelector("#adj-amount-row").style.display = "none";
    modalEl.querySelector("#adj-amount").value = "";
  });

  modalEl.querySelector("#adj-action").addEventListener("change", function () {
    const row = modalEl.querySelector("#adj-amount-row");
    const label = modalEl.querySelector("#adj-amount-label-wrap");
    if (this.value === "decrease") {
      row.style.display = "";
      label.innerHTML = `<label class="form-label">You Want to decrease to</label>`;
    } else if (this.value === "increase") {
      row.style.display = "";
      label.innerHTML = `<label class="form-label">You Want to increase to</label>`;
    } else {
      row.style.display = "none";
    }
    // clear amount when action changes
    modalEl.querySelector("#adj-amount").value = "";
  });

  modalEl.querySelector("#adj-btn").addEventListener("click", async (e) => {
    e.preventDefault();

    if (!selectedProduct) { alert("Please select a product."); return; }

    const action = modalEl.querySelector("#adj-action").value;
    const amountValue = modalEl.querySelector("#adj-amount").value;
    const reason = modalEl.querySelector("#adj-reason").value.trim();

    if (!action) { alert("Please select an action."); return; }
    if (amountValue === "" || +amountValue < 0) { alert("Please enter a valid stock value."); return; }

    const oldStock = +selectedProduct.stock;
    const newStock = +amountValue;

    if (action === "decrease" && newStock > oldStock) {
      alert(`Cannot decrease below 0. Current stock is ${oldStock}.`);
      return;
    }
    if (action === "increase" && newStock <= oldStock) {
      alert(`New value must be greater than current stock (${oldStock}) when increasing.`);
      return;
    }

    const quantity = action === "decrease" ? oldStock - newStock : newStock - oldStock;

    try {
      const patchRes = await fetch(`${Product_API}/${selectedProduct.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stock: amountValue }),
      });
      if (!patchRes.ok) throw new Error("Failed to update stock");

      const adjRes = await fetch(Adjustment_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          product_Name: selectedProduct.sku,
          type: action,
          quantity: quantity.toString(),
          reason: reason,
          old_Quantity: oldStock.toString(),
          New_Quantity: amountValue,
        }),
      });
      if (!adjRes.ok) throw new Error("Failed to save adjustment");

      alert("Stock adjusted successfully!");
      closeModal();
      loadDashboardData();

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  });
}


function initQuickActions() {
  const addBtn = document.querySelector(".btn.add-btn");
  const catBtn = document.querySelector(".btn-outline-primary");
  const adjBtn = document.querySelector(".adjustStock");

  if (addBtn) addBtn.addEventListener("click", openAddProductModal);
  if (catBtn) catBtn.addEventListener("click", openAddCategoryModal);
  if (adjBtn) adjBtn.addEventListener("click", openAdjustStockModal);
}

function checkItems() {
  menu.addEventListener("click", function (e) {
    const item = e.target.closest(".sidebar-item");
    if (!item) return;

    // Remove active state
    sidebarItems.forEach((el) => el.classList.remove("active-item"));
    supplierItem.classList.remove("active-item");
    item.classList.add("active-item");

    // Handle clicks
    if (item.classList.contains("users")) { clearCategoryDropdown(); loadUserWindow(); }
    else if (item.classList.contains("activities")) { clearCategoryDropdown(); loadLogWindow(); }
    else if (item.classList.contains("products")) {
      clearCategoryDropdown();
      loadProductsPage();  // initProductPage is called inside this
    }
    else if (item.classList.contains("dashboard")) { restoreDashboard(); }
    else if (item.classList.contains("report")) {
      clearCategoryDropdown();
      loadReportsPage();
    }
  });

  supplierItem.addEventListener("click", () => clearCategoryDropdown());
}

export async function loadDashboardWindow() {
  await initModal();
  const contentArea = document.querySelector(".contentArea");
  if (contentArea) dashboardHTML = contentArea.innerHTML;
  checkRole();
  renderUserProfile();
  checkItems();
  initQuickActions();
  loadCategoryDropdown();
  loadDashboardData();
}