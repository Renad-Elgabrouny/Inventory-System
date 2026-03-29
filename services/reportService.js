//window.addEventListener("load",function(e){
    const products = [];
    const table = document.querySelector(".lowProducts");
    function showData(data){
        const body = document.createElement("tbody");
        body.innerHTML = "";
        for(let i=0;i<data.length;i++){
            let item = data[i];
            const tr = document.createElement("tr");
            const name = document.createElement("td");
            name.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const stock = document.createElement("td");
            stock.style.cssText=`font-size:18px;color:red`;
            const reorder = document.createElement("td");
            reorder.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const supplier = document.createElement("td");
            supplier.style.cssText = `color:rgb(37, 99, 235)`;
            const action = document.createElement("td");
            const button = document.createElement("button");
            button.value = "Order Now";
            button.innerText = "Order Now";
            button.style.cssText = `background-color: rgb(37, 99, 235);padding:6px;border-radius:10px;border:none;color:white`;
            action.appendChild(button);
            name.textContent = item.name;
            stock.textContent = item.stock;
            reorder.textContent = item.Reorder_Level;
            supplier.textContent = item.supplier;
            // action.textContent = item.action;
            tr.appendChild(name);
            tr.appendChild(stock);
            tr.appendChild(reorder);
            tr.appendChild(supplier);
            tr.appendChild(action);
            body.appendChild(tr);
        }
        table.appendChild(body);
    }
    async function getorders() {
        try {
            const response = await fetch("http://localhost:3000/product");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            let data = await response.json();
            data = data.filter(item => Number(item.stock) < Number(item.Reorder_Level));
            //console.log(data);
            showData(data);
            // searcharr.push(...data);
            } catch (error) {
                console.error("Error:", error.message);
            }
    }
    getorders();

    const table2 = document.querySelector(".tableTwo");
    function showDataprice(data){
        let sum = 0;
        let total = document.querySelector(".total");
        const body = document.createElement("tbody");
        body.innerHTML = "";
        for(let i=0;i<data.length;i++){
            let item = data[i];
            const tr = document.createElement("tr");
            const name = document.createElement("td");
            name.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const stock = document.createElement("td");
            stock.style.cssText=`font-size:18px;color:red`;
            const price = document.createElement("td");
            price.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const total = document.createElement("td");
            total.style.cssText = `color:rgb(37, 99, 235)`;
            name.textContent = item.name;
            stock.textContent = item.stock;
            price.textContent = item.price;
            total.textContent = item.stock*item.price;
            sum += item.stock*item.price;
            tr.appendChild(name);
            tr.appendChild(stock);
            tr.appendChild(price);
            tr.appendChild(total);
            body.appendChild(tr);
        }
        table2.appendChild(body);
        total.innerText = sum;
    }

    async function getordersandprice() {
        try {
            const response = await fetch("http://localhost:3000/product");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            let data = await response.json();
            showDataprice(data);
            // searcharr.push(...data);
            } catch (error) {
                console.error("Error:", error.message);
            }
    }
    getordersandprice()
//})
// "id": "1",
//       "name": "laptopssss",
//       "category": "electronic",
//       "supplier": "karim yasser",
//       "stock": "50",
//       "Reorder_Level": "100",
//       "sku": "lop",
//       "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiQrqGNNTR7xwgo2dIb0enMOFgw_5N3X26dA&s"