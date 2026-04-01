import { initProductPage } from "../../services/productService.js";
let modalInstance;

export const initModal = async () => {
    const res = await fetch('../../components/modal.html');
    const html = await res.text();

    document.getElementById('modal-container').innerHTML = html;

    const modalElement = document.getElementById('staticBackdrop');

    if (!modalElement) {
        console.error("Modal not found!");
        return;
    }

    modalInstance = new bootstrap.Modal(modalElement, {
        focus: true
    });

};// initialize the modal by taking instance from modal class in bootstrap

export const openModal = (title, content) => {
    document.getElementById('staticBackdropLabel').textContent = title;

    const body = document.getElementById('modal-body');
    body.innerHTML = content;

    modalInstance.show();

    return document.getElementById('staticBackdrop');
};// open (show) the modal popup by show() funtion

export const closeModal = () => {
    modalInstance?.hide();
};// close modal by hide() function


let searcharr = [];
let currentEditId = null;

$(document).on("click", ".supplier", function () {
    $(this).addClass("active-item");
    $(".contentArea").load("./pages/suppliers.html", function () {
        const table = document.querySelector(".suppdata");
        const body = document.createElement("tbody");
        const searcharr = [];
        let emailvar = 0;

        $(".addSupplier").hide();

        function showData(data) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                const tr = document.createElement("tr");
                const ssn = document.createElement("td");
                ssn.style.cssText = `color: rgba(100, 116, 139, 1);`;
                ssn.classList.add("d-none");
                ssn.classList.add("d-lg-table-cell");
                const name = document.createElement("td");
                name.style.cssText = `font-size:16px`;
                const phone = document.createElement("td");
                phone.style.cssText = `color: rgba(100, 116, 139, 1);`;
                const email = document.createElement("td");
                email.style.cssText = `color:rgb(37, 99, 235);`;
                email.classList.add("d-none");
                email.classList.add("d-md-table-cell");
                const continent = document.createElement("td");
                continent.style.cssText = `color: rgb(37, 99, 235)`;
                continent.classList.add("d-none");
                continent.classList.add("d-lg-table-cell");
                const country = document.createElement("td");
                country.style.cssText = `color: rgba(100, 116, 139, 1);`;
                const city = document.createElement("td");
                city.style.cssText = `color: rgba(100, 116, 139, 1);`;
                city.classList.add("d-none");
                city.classList.add("d-lg-table-cell");
                const street = document.createElement("td");
                street.style.cssText = `color: rgba(100, 116, 139, 1);`;
                street.classList.add("d-none");
                street.classList.add("d-lg-table-cell");
                const actionsTd = document.createElement("td");
                actionsTd.innerHTML = `
                    <i class="fa-solid fa-pen me-3 actions edit-supplier" supplierId="${item.id}" style="cursor:pointer;color:#9333ea;font-size:15px"></i><i class="fa-regular fa-trash-can actions delete-supplier" supplierId="${item.id}" style="cursor:pointer;color:#9333ea;font-size:15px"></i>
                `;

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
                tr.appendChild(actionsTd);
                body.appendChild(tr);
                tr.classList.add(item.id);
                table.appendChild(body);
            }
        }

        let updatedSupplier = 0;
        async function getSupplier(id) {
            try {
                const response = await fetch("http://localhost:3000/suppliers/" + id);
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
                console.log("Added supplier:", data);
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
                let data = null;
                try {
                    data = await response.json();
                } catch {
                    data = { message: "Deleted successfully (no response body)" };
                }
                console.log("RES", data);
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
                return data;
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

        $("#addbutt").click(function () {
            $(".addSupplier").show();
            $(".container").hide();
            $(".modify").hide();
        })

        $(".cancel").click(function () {
            $(".addSupplier").hide();
            $(".container").show();
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
            $(".container").show();
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
        $(document).on("click", ".delete-supplier", function () {
            const id = $(this).attr("supplierId");
            openDeleteModal(id);
        });
        $(document).on("click", ".edit-supplier", function () {
            $(".submit").hide();
            $(".modify").show();
            const id = $(this).attr("supplierId");
            $(".addSupplier").show();
            $(".container").hide();
            getSupplier(id)
            $(".modify").click(function (e) {
                e.preventDefault();
                updateSupplier(id)
            })
        });

        const supplier = document.querySelector("#supplier");
        supplier.addEventListener("input", function (e) {
            console.log(e.target.value);
            const result = searcharr.filter(sup => sup.name.includes(e.target.value));
            body.innerHTML = "";
            showData(result);
        })
    });
});




const productItem = document.querySelector(".products");

document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    if (!menu) {
        console.error(".menu element not found!");
        return;
    }

    menu.addEventListener("click", async function (e) {
        const productItem = e.target.closest(".product-item");
        if (!productItem) return;
        document.querySelectorAll(".menu > div").forEach(item => {
            item.classList.remove("active-item");
        });
        productItem.classList.add("active-item");
        try {
            const res = await fetch("./pages/products.html");
            const html = await res.text();
            const contentArea = document.querySelector(".contentArea");
            if (!contentArea) throw new Error(".contentArea not found");
            contentArea.innerHTML = html;
            initProductPage();
        } catch (error) {
            console.error("Error loading product page:", error);
        }
    });
});
// const report = document.querySelector(".report");

// report.addEventListener("click", async function () {
//     document.querySelectorAll(".menu > div").forEach(item => {
//         item.classList.remove("active-item");
//     });

//     report.classList.add("active-item");

//     try {
//         const res = await fetch("./pages/reports.html");
//         const html = await res.text();
//         document.querySelector(".contentArea").innerHTML = html;
//         // const module = await import("../../services/reportService.js");
//         // initProductPage();
//         const script = document.createElement("script");
//         script.src = "../services/reportService.js";
//         // script.type = "module"; // optional
//         document.body.appendChild(script);
//     } catch (error) {
//         console.error("Error loading product page:", error);
//     }
// });