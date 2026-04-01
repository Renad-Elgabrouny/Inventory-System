export function initReportPage() {
  const table = document.querySelector(".lowProducts");
  const table2 = document.querySelector(".tableTwo");

  function showData(data) {
    const body = document.createElement("tbody");
    body.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      const tr = document.createElement("tr");
      const name = document.createElement("td");
      name.style.cssText = `color: rgba(100, 116, 139, 1);`;
      const stock = document.createElement("td");
      stock.style.cssText = `font-size:18px;color:red`;
      const reorder = document.createElement("td");
      reorder.style.cssText = `color: rgba(100, 116, 139, 1);`;
      const supplier = document.createElement("td");
      supplier.style.cssText = `color:#9333ea`;
      // const action = document.createElement("td");
      // const button = document.createElement("button");
      // button.value = "Order Now";
      // button.innerText = "Order Now";
      // button.style.cssText = `background-color: #9333ea;padding:6px;border-radius:10px;border:none;color:white`;
      // action.appendChild(button);
      name.textContent = item.name;
      stock.textContent = item.stock;
      reorder.textContent = item.Reorder_Level;
      supplier.textContent = item.supplier;
      tr.appendChild(name);
      tr.appendChild(stock);
      tr.appendChild(reorder);
      tr.appendChild(supplier);
      // tr.appendChild(action);
      body.appendChild(tr);
    }
    table.appendChild(body);
  }

  function showDataprice(data) {
    let sum = 0;
    const totalEl = document.querySelector(".total");
    const body = document.createElement("tbody");
    body.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      const tr = document.createElement("tr");
      const name = document.createElement("td");
      name.style.cssText = `color: rgba(100, 116, 139, 1);`;
      const stock = document.createElement("td");
      stock.style.cssText = `font-size:18px;color:red`;
      const price = document.createElement("td");
      price.style.cssText = `color: rgba(100, 116, 139, 1);`;
      const total = document.createElement("td");
      total.style.cssText = `color:#9333ea`;
      name.textContent = item.name;
      stock.textContent = item.stock;
      price.textContent = item.price;
      total.textContent = item.stock * item.price;
      sum += item.stock * item.price;
      tr.appendChild(name);
      tr.appendChild(stock);
      tr.appendChild(price);
      tr.appendChild(total);
      body.appendChild(tr);
    }
    table2.appendChild(body);
    if (totalEl) totalEl.innerText = sum;
  }

  async function getorders() {
    try {
      const response = await fetch("http://localhost:3000/product");
      if (!response.ok) throw new Error("Failed to fetch products");
      let data = await response.json();
      data = data.filter(item => Number(item.stock) < Number(item.Reorder_Level));
      showData(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  async function getordersandprice() {
    try {
      const response = await fetch("http://localhost:3000/product");
      if (!response.ok) throw new Error("Failed to fetch products");
      let data = await response.json();
      showDataprice(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  getorders();
  getordersandprice();
}