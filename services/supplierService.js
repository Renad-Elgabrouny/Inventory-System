window.addEventListener("load",function(e){
    table = document.querySelector(".suppdata");
    const body = document.createElement("tbody");
    const searcharr = [];
    let emailvar=0;

    $(".addSupplier").hide();

    function showData(data){
        for(let i=0;i<data.length;i++){
            let item = data[i];
            const tr = document.createElement("tr");
            const ssn = document.createElement("td");
            ssn.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const name = document.createElement("td");
            name.style.cssText=`font-size:18px`;
            const phone = document.createElement("td");
            phone.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const email = document.createElement("td");
            email.style.cssText = `color:rgb(37, 99, 235)`;
            const continent = document.createElement("td");
            continent.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const country = document.createElement("td");
            country.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const city = document.createElement("td");
            city.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const street = document.createElement("td");
            street.style.cssText = `color: rgba(100, 116, 139, 1);`;
            const updatetd = document.createElement("td");
            const update = document.createElement("button");
            update.style.cssText = `background-color:rgb(37, 99, 235);padding:2px;color:white;border:none;border-radius:5px`;
            update.id = "updateBtn";
            update.classList.add(item.id);
            update.value = "Update";
            update.textContent = "Update";
            updatetd.appendChild(update);
            const deletetd = document.createElement("td");
            const deletee = document.createElement("button");
            deletee.style.cssText = `background-color:red;padding:2px;color:white;border:none;border-radius:5px`;
            deletee.id = "deleteBtn";
            deletee.classList.add(item.id);
            deletee.value = "Delete";
            deletee.textContent = "Delete";
            deletetd.appendChild(deletee);
            ssn.textContent = item.ssc;
            name.textContent = item.name;
            phone.textContent = item.phone;
            email.textContent = item.email;
            continent.textContent = item.address.continent;
            country.textContent = item.address.country;
            city.textContent = item.address.city;
            street.textContent = item.address.street;
            tr.appendChild(ssn);
            tr.appendChild(name);
            tr.appendChild(phone);
            tr.appendChild(email);
            tr.appendChild(continent);
            tr.appendChild(country);
            tr.appendChild(city);
            tr.appendChild(street);
            //updatetd.classList.add(item.id)
            tr.appendChild(updatetd);
            //deletetd.classList.add(item.id)
            tr.appendChild(deletetd);
            body.appendChild(tr);
            tr.classList.add(item.id);
            table.appendChild(body);
        }
    }

    let updatedSupplier=0;
    async function getSupplier(id) {
        try {
            const response = await fetch("http://localhost:3000/suppliers/"+id);
            if (!response.ok) {
                throw new Error("Failed to fetch suppliers");
            }
            const data = await response.json();
            ssc.value = data.ssc;
            name.value = data.name;
            phone.value = data.phone;
            email.value = data.email;
            continent.value = data.address.continent;
            country.value = data.address.country;
            city.value = data.address.city;
            street.value = data.address.street;
            } catch (error) {
                console.error("Error:", error.message);
            }
    }
    async function getSuppliers() {
        try {
            const response = await fetch("http://localhost:3000/suppliers");
            if (!response.ok) {
                throw new Error("Failed to fetch suppliers");
            }
            const data = await response.json();
            showData(data);
            searcharr.push(...data);
            } catch (error) {
                console.error("Error:", error.message);
            }
    }
    getSuppliers();

    async function addSupplier() {
        try {
            const response = await fetch("http://localhost:3000/suppliers", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ssc: ssc.value,
                    name: name.value,
                    phone: phone.value,
                    email: email.value,
                    address: {
                        continent: continent.value,
                        country: country.value,
                        city: city.value,
                        street: street.value
                    }
                })
            });
            if (!response.ok) {
                throw new Error("Failed to add supplier");
            }
            const data = await response.json();
            const activityLog = await fetch("http://localhost:3000/activityLogs", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "action":"supplier added",
                    "entity":"supplier",
                    "supplierId":data._id,
                    "date":new Date().toLocaleDateString()
                })
            });
            const activity = await activityLog.json();
            if (!activityLog.ok) {
                throw new Error("Failed to log activity");
            }
            console.log("Added supplier:", data,activity);
        } catch (error) {
            console.error("Error:", error.message);
        }
    }

    async function deleteSupplier(id) {
        try {
            const response = await fetch(`http://localhost:3000/suppliers/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("Failed to delete supplier");
            }
            const activityLog = await fetch("http://localhost:3000/activityLogs", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "action":"supplier deleted",
                    "entity":"supplier",
                    "supplierId":id,
                    "date":new Date().toLocaleDateString()
                })
            });
            const activity = await activityLog.json();
            if (!activityLog.ok) {
                throw new Error("Failed to log activity");
            }
            let data = null;
                try {
                    data = await response.json();
                } catch {
                    data = { message: "Deleted successfully (no response body)" };
                }
            console.log("RES", data,activity);
        } catch (error) {
            console.error("Error deleting supplier:", error.message);
        }
    }

    async function updateSupplier(id) {
        try {
            const response = await fetch(`http://localhost:3000/suppliers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ssc: ssc.value,
                    name: name.value,
                    phone: phone.value,
                    email: email.value,
                    address: {
                        continent: continent.value,
                        country: country.value,
                        city: city.value,
                        street: street.value
                    }
                })
            });
            if (!response.ok) {
                throw new Error("Failed to update supplier");
            }
            const data = await response.json();
            const activityLog = await fetch("http://localhost:3000/activityLogs", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "action":"supplier updated",
                    "entity":"supplier",
                    "supplierId":id,
                    "date":new Date().toLocaleDateString()
                })
            });
            const activity = await activityLog.json();
            if (!activityLog.ok) {
                throw new Error("Failed to log activity");
            }
            return {data,activity};
        } catch (error) {
            console.error("Error updating supplier:", error.message);
            return null;
        }
    }

    const ssc = document.querySelector("#ssc");
    const name = document.querySelector("#name");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const continent = document.querySelector("#continent");
    const country = document.querySelector("#country");
    const city = document.querySelector("#city");
    const street = document.querySelector("#street");

    $("#addbutt").click(function(){
        $(".addSupplier").show();
        $(".container").hide();
        $(".modify").hide();
    })
    

    $(".submit").click(function (e) {
        if (!ssc.value || !name.value || !phone.value || !email.value ||
            !continent.value || !country.value || !city.value || !street.value) {
            alert("please enter all the fields");
            return;
        }

        email.setCustomValidity("");
        name.setCustomValidity("");
        phone.setCustomValidity("");

        let isValid = true;

        if (!email.checkValidity()) {
            email.setCustomValidity("The Email you entered is Invalid email");
            isValid = false;
        }

        if (name.value.length < 5) {
            name.setCustomValidity("The name Must be at least 5 characters");
            isValid = false;
        }

        if (phone.value.length !== 11) {
            phone.setCustomValidity("The phone Number Must be 11 digits");
            isValid = false;
        }

        if (!isValid) {
            email.reportValidity();
            name.reportValidity();
            phone.reportValidity();
            return;
        }

        addSupplier()
    });
    
    let supplierToDelete = null;
    function openDeleteModal(id) {
        supplierToDelete = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }
    document.getElementById("confirmDelete").addEventListener("click", function () {
        deleteSupplier(supplierToDelete)
        renderSuppliers();
    });
    $(document).on("click", "#deleteBtn", function(){
        console.log($(this).attr("class"));
        const id = $(this).attr("class");
        openDeleteModal(id);
    });

    $(document).on("click", "#updateBtn", function(){
        $(".submit").hide();
        console.log($(this).attr("class"));
        const id = $(this).attr("class");
        $(".addSupplier").show();
        $(".container").hide();
        getSupplier(id)
        $(".modify").click(function(e){
            e.preventDefault();
            updateSupplier(id)
        })
    });

    const supplier = document.querySelector("#supplier");
    supplier.addEventListener("input",function(e){
        console.log(e.target.value);
        const result = searcharr.filter(sup => sup.name.includes(e.target.value));
        body.innerHTML = "";
        showData(result);
    })
    // supplier.addEventListener("input",function(e){
    //     console.log(e.target.value);
    //     const result1 = searcharr.filter(sup => sup.continent.includes(e.target.value));
    //     body.innerHTML = "";
    //     showData(result1);
    // })
})