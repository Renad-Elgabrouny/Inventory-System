const $ = window.$;
console.log(window.$);
import { Supplier } from "./supplier.js";


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
            const name = document.createElement("td");
            const phone = document.createElement("td");
            const email = document.createElement("td");
            const continent = document.createElement("td");
            const country = document.createElement("td");
            const city = document.createElement("td");
            const street = document.createElement("td");
            const updatetd = document.createElement("td");
            const update = document.createElement("button");
            update.style.cssText = `background-color:blue;padding:2px;color:white;border:none;border-radius:5px`;
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
    fetch("http://localhost:3000/suppliers")
        .then(res => res.json())
        .then(data => {
            showData(data);
            searcharr.push(...data);
    })

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
    
    
    
        $(".submit").click(function(e){
            //e.preventDefault();
            if(!ssc.value||!name.value||!phone.value||!email.value||!continent.value||!country.value||!city.value||!street.value){
                alert("please enter all the fields")
            }
            else if(email.value||name.value){
                if (!email.checkValidity()) {
                    console.log("Invalid email");
                    alert("the email you entered is not valid");
                    return;
                }else {
                    email.setCustomValidity("");
                }
                if(name.value.length < 5){
                    name.setCustomValidity("Must be at least 5 characters");
                    alert("the name must be atleast 5 chars");
                }else {
                    name.setCustomValidity(""); 
                }
            }
            else{
                const supplier = new Supplier();
                supplier.SSC=ssc.value;
                supplier.NAME=name.value;
                supplier.PHONE=phone.value;
                supplier.EMAIL=email.value;
                supplier.CONTINENT=continent.value;
                supplier.COUNTRY=country.value;
                supplier.CITY=city.value;
                supplier.STREET=street.value;
                fetch("http://localhost:3000/suppliers", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ssc: supplier.SSC,
                    name: supplier.NAME,
                    phone: supplier.PHONE,
                    email: supplier.EMAIL,
                    address: {
                        continent: supplier.CONTINENT,
                        country: supplier.COUNTRY,
                        city: supplier.CITY,
                        street: supplier.STREET
                    }
                })
                })
                .then(res => res.json())
                .then(console.log);
            }
        })
    

    $(document).on("click", "#deleteBtn", function(){
        console.log($(this).attr("class"));
        const id = $(this).attr("class");
        fetch("http://localhost:3000/suppliers/"+id, {
            method: 'DELETE'
            }).then(res => res.json()).then(res => {
                console.log("RES", res);
        });
    });
    $(document).on("click", "#updateBtn", function(){
        $(".submit").hide();
        console.log($(this).attr("class"));
        const id = $(this).attr("class");
        $(".addSupplier").show();
        $(".container").hide();
        fetch("http://localhost:3000/suppliers/"+id)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                ssc.value = data.ssc;
                name.value = data.name;
                phone.value = data.phone;
                email.value = data.email;
                continent.value = data.address.continent;
                country.value = data.address.country;
                city.value = data.address.city;
                street.value = data.address.street;
                $(".modify").click(function(e){
                    e.preventDefault();
                    fetch("http://localhost:3000/suppliers/"+id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ssc:ssc.value,
                        name:name.value,
                        phone:phone.value,
                        email:email.value,
                        address: {
                            continent: continent.value,
                            country: country.value,
                            city: city.value,
                            street: street.value
                        }
                    })
                })
                .then(res => res.json())
                .then(console.log);
            })
        })
    });
    const supplier = document.querySelector("#supplier");
    supplier.addEventListener("input",function(e){
        console.log(e.target.value);
        const result = searcharr.filter(sup => sup.name.includes(e.target.value));
        body.innerHTML = "";
        showData(result);
    })
})