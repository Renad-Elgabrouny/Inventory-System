import OrderService from "../../services/orderService.js";
import { AuthService } from "../../services/authService.js";
import { ActivityService } from "../../services/activityLogService.js";

let allOrders = [];
let editingOrderId = null;


async function renderAreaContent() {
  const res = await fetch("../../pages/orders.html");
  const html = await res.text();
  document.querySelector(".contentArea").innerHTML = html;
}


export async function loadOrderWindow() {
  try {
    await renderAreaContent();
    bindGlobalActions();
    await loadData();
    setupFilters();
  } catch (err) {
    console.error(err);
  }
}



export async function initOrders() {
  await loadData();
  setupFilters();
  bindGlobalActions();
}

async function loadData() {
  allOrders = await OrderService.getall();
  renderTable(allOrders);
  populateSupplierFilter();
}

async function renderTable(orders) {
  const tbody = document.getElementById("tbody");
  if (!tbody) return;

  tbody.innerHTML = orders
    .map(
      (order) => `
        <tr>
            <td class="ps-4 fw-bold">${order.id}</td>
            <td>${order.supplierName}<br><small class="text-muted">ID: ${order.supplierId}</small></td>
            <td>${order.productName}<br><small class="text-muted">SKU: ${order.sku}</small></td>
            <td>${order.quantity}</td>
            <td><span class="badge rounded-pill ${getStatusClass(order.status)}">${order.status}</span></td>
            <td>${order.date}</td>
            <td class="text-end pe-4">
                ${order.status === "pending"
          ? `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="handleEdit('${order.id}')">Edit</button>
                    <button class="btn btn-sm btn-success me-1" onclick="handleReceive('${order.id}')">Receive</button>
                `
          : ""
        }
                <button class="btn btn-sm btn-outline-danger" onclick="handleDelete('${order.id}')">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function setupFilters() {
  const searchInput =
    document.querySelector(".search") ||
    document.querySelector('input[placeholder*="Search by product"]');
  const selects = document.querySelectorAll("select");
  const statusSelect = selects[0];
  const supplierSelect = selects[1];

  if (!searchInput || !statusSelect || !supplierSelect) return;

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusSelect.value.toLowerCase();
    const supplierValue = supplierSelect.value.toLowerCase();

    const filtered = allOrders.filter((order) => {
      const matchesSearch =
        order.productName.toLowerCase().includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm) ||
        order.supplierName.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusValue === "status: all" || order.status === statusValue;
      const matchesSupplier =
        supplierValue === "supplier: all" ||
        order.supplierName.toLowerCase() === supplierValue;

      return matchesSearch && matchesStatus && matchesSupplier;
    });
    renderTable(filtered);
  };

  searchInput.addEventListener("input", applyFilters);
  statusSelect.addEventListener("change", applyFilters);
  supplierSelect.addEventListener("change", applyFilters);
}


function populateSupplierFilter() {
  const selects = document.querySelectorAll("select");
  if (selects.length < 2) return;
  const supplierSelect = selects[1];
  const uniqueSuppliers = [
    ...new Set(allOrders.map((o) => o.supplierName).filter(Boolean))
  ];

  supplierSelect.innerHTML =
    `<option selected>Supplier: All</option>` +
    uniqueSuppliers
      .map((name) => `<option value="${name.toLowerCase()}">${name}</option>`)
      .join("");
}

export function bindGlobalActions() {
  window.saveOrder = async function () {
    const sId = document.getElementById("supplierId").value.trim();
    const pId = document.getElementById("productId").value.trim();
    const qty = parseInt(document.getElementById("quantity").value);

    if (!sId || !pId || isNaN(qty)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    let actionType = "";
    if (editingOrderId) {
      const existing = allOrders.find((o) => o.id === editingOrderId);
      await OrderService.update(editingOrderId, {
        ...existing,
        supplierId: sId,
        productId: pId,
        quantity: qty,
      });
      actionType = "Order Updated";
      editingOrderId = null;
    } else {
      await OrderService.create(sId, pId, qty);
      actionType = "Order Created";
    }

    await ActivityService.createActivity({
      action: actionType,
      entity: "orders",
      userId: AuthService.getCurrentUser().id,
      date: new Date().toISOString().split("T")[0],
    });

    window.closeModal();
    await loadData();
  };

  window.handleReceive = async function (id) {
    if (confirm("Mark as Received?")) {
      await OrderService.receive(id);
      await ActivityService.createActivity({
        action: "Order Received",
        entity: "orders",
        userId: AuthService.getCurrentUser().id,
        date: new Date().toISOString().split("T")[0],
      });
      await loadData();
    }
  };

  window.handleDelete = async function (id) {
    if (confirm("Delete this order?")) {
      await OrderService.delete(id);
      await ActivityService.createActivity({
        action: "Order Deleted",
        entity: "orders",
        userId: AuthService.getCurrentUser().id,
        date: new Date().toISOString().split("T")[0],
      });
      await loadData();
    }
  };

  window.handleEdit = function (id) {
    const order = allOrders.find((o) => o.id === id);
    if (!order || order.status !== "pending") return;

    editingOrderId = id;
    document.getElementById("modalTitle").innerText = "Edit Order: " + id;
    document.getElementById("supplierId").value = order.supplierId;
    document.getElementById("productId").value = order.productId;
    document.getElementById("quantity").value = order.quantity;
    document.getElementById("modal").style.display = "flex";
  };

  window.openCreateModal = function () {
    editingOrderId = null;
    document.getElementById("modalTitle").innerText = "New Order";
    document.getElementById("supplierId").value = "";
    document.getElementById("productId").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("modal").style.display = "flex";
  };

  window.closeModal = function () {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
  };
}

function getStatusClass(status) {
  if (status === "received") return "bg-success-subtle text-success";
  if (status === "pending") return "bg-warning-subtle text-dark";
  if (status === "canceled") return "bg-danger-subtle text-danger";
  return "bg-secondary-subtle text-secondary";
}