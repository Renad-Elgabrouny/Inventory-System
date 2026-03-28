import {add_Product_API, adjsment_stock, adjustment_API, categoryName, product, Product_API} from "../services/fetch.js"

function initProductPage(){
    
let _name = document.getElementById("name")
let category = document.getElementById("category") 
let supplier = document.getElementById("supplier") 
let stock = document.getElementById("stock") 
let recorded = document.getElementById("recorded") 
let update_Recorded = document.getElementById("update_Recorded") 
let sku = document.getElementById("sku") 
let image = document.getElementById("image") 
let add = document.getElementById("add") 
let body = document.querySelector(".body")
let form = document.querySelector(".form")
let Edit_form = document.querySelector(".Edit_form")
let addProduct = document.querySelector(".addProduct")
let clouse = document.querySelector(".clouse")
let adjsment = document.querySelector(".adjsment")
let Editeclouse = document.querySelector(".Editeclouse")
let Update_name = document.getElementById("Update_name") 
let Update_category = document.getElementById("Update_category") 
let Update_supplier = document.getElementById("Update_supplier") 
let Update_sku = document.getElementById("Update_sku") 
let Update_image = document.getElementById("Update_image") 
let update = document.getElementById("update") 
let search = document.getElementById("search")
let showProducts = document.querySelector(".showProducts")
let adjClouse = document.querySelector(".adjClouse")


form.style.display="none"
Edit_form.style.display="none"


let product_data = Array.isArray(product)? product : []
let adjustment_data = Array.isArray(adjsment_stock)? adjsment_stock : []
let category_data = Array.isArray(categoryName)? categoryName : []

 

function Show_Table(value){
     body.innerHTML+=`
    <tr>
    <td><img src="${value.image}" width="90" height="60"></td>
    <td class="pro_name">${value.name}</td>
    <td>${value.category}</td>
    <td>${value.supplier}</td>
    <td><div class="level"></div><span class="value">${value.stock}</span></td>
    <td>${value.Reorder_Level}</td>
    <td>${value.sku}</td>
    <td><button data-id="${value.id}"  class="edit">✎</button> <button data-id="${value.id}" class="delete">🗑</button></td>
    </tr>
    `
}



function Render(){
    body.innerHTML = ""
    product_data.forEach((item)=>{
        Show_Table(item)
   
})
Stock_status()
edit_Product()
Delete_Product()
}

let pro_name = document.querySelectorAll(".pro_name")

pro_name.forEach((item)=>{
    item.addEventListener("click",()=>{
    console.log("yesssssss");
    
})
})
    


add.addEventListener("click",async(e)=>{
    e.preventDefault()

   

    add_Product_API(_name,category,supplier,stock,recorded,sku,image)

    
})

function edit_Product(){
    let edit = document.querySelectorAll(".edit")
    edit.forEach((btn)=>{
        btn.addEventListener("click",(e)=>{
            e.preventDefault()
            const edit_Btn = btn.dataset.id
            Edit_form.style.display=""
            showProducts.style.display="none"
            
            product_data.forEach((item)=>{
                if(edit_Btn == item.id){
                    
                    Update_name.value = item.name
                    Update_category.value = item.category
                    Update_sku.value = item.sku
                    Update_supplier.value = item.supplier
                    update_Recorded.value = item.Reorder_Level
                    Update_image.value = item.image
                    update.dataset.id=item.id
                    
                }
            })
            
            
        })
    })
    
}

update.addEventListener("click",async(e)=>{
        e.preventDefault()
    let submit_id = update.dataset.id
    showProducts.style.display=""
    
    const response = await fetch(`${Product_API}/${submit_id}`,{
        method:"PATCH",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
            name:Update_name.value,
            category:Update_category.value,
            sku:Update_sku.value,
            supplier:Update_supplier.value,
             Reorder_Level : update_Recorded.value ,
            image:Update_image.value,
        })
    })
    const data = await response.json()
    alert("updated successfully")
})
        
    function Search_Product(){
        search.addEventListener("input",()=>{
        body.innerHTML=""
        product_data.forEach((item)=>{
            if(item.name.includes(search.value)||
            item.category.includes(search.value) ||
            item.supplier.includes(search.value) ||
            item.sku.includes(search.value)||
            item.stock.includes(search.value)
        ){
              Show_Table(item)
        }
    })
         edit_Product()
         Delete_Product()
})
    
    }
    
     function Delete_Product(){
                let deletes = document.querySelectorAll(".delete")
                deletes.forEach((del)=>{
                    del.addEventListener("click",async()=>{
                        let id = del.dataset.id
                    
                        const res = await fetch(`http://localhost:3000/product/${id}`,{
                            method:"DELETE"
                        })
                        const data = await res.json()
                        alert("The Product Deleted successfully")
                        
                    })
                })
            }


console.log(category_data);


    addProduct.addEventListener("click",()=>{
    form.style.display=""
    showProducts.style.display="none"
     category.innerHTML = `<option class="options" value="">select Category</option>`
     let Unique_Category = [...new Set(category_data.map(item=>item.name))]
     Unique_Category.forEach((cat)=>{
        category.innerHTML+=`<option class="options" value="${cat}">${cat}</option>`
     })
})
clouse.addEventListener("click",()=>{
                form.style.display="none"
                showProducts.style.display=""
            })
            Editeclouse.addEventListener("click",()=>{
                Edit_form.style.display="none"
                showProducts.style.display=""
            })
            
            function Stock_status(){
                let level = document.querySelectorAll(".level")
            product_data.forEach((ite,index)=>{
                if(+ite.stock < +ite.Reorder_Level){
                    level[index].style.backgroundColor = "red"
                    // alert(`you must purchase ${ite.name}`)
                }else if(+ite.stock <= (+ite.Reorder_Level*2)){
                        level[index].style.backgroundColor = "orange"
                }else{
                        level[index].style.backgroundColor = "green"
                }
            })
            }
                
 

    





Search_Product()
Render()














let adjsmentForm = document.getElementById("adjsmentForm")
let Adjasment_Name = document.getElementById("Adjasment_Name")
let Adjasment_quantity = document.getElementById("Adjasment_quantity")
let Adjasment_category = document.getElementById("Adjasment_category")
let action = document.getElementById("action")
let reason = document.getElementById("reason")
let adj_BTN = document.getElementById("adj_BTN")
let stock_adjsment = document.querySelector(".adjsment")
let container = document.querySelector(".container")
let amount = document.getElementById("amount")

adjsmentForm.style.display="none"
amount.style.display="none"

stock_adjsment.addEventListener("click",()=>{
    adjsmentForm.style.display=""
    showProducts.style.display="none"
    Adjasment_Name.innerHTML = `<option class="options" value="">select Product</option>`
    let unique_adjustment_product = [...new Set(product_data.map(item=>item.sku))]

    unique_adjustment_product.forEach((pro)=>{
        Adjasment_Name.innerHTML+=`<option class="options" value="${pro}">${pro}</option>`
    })
})

Adjasment_Name.addEventListener("change",()=>{

    product_data.forEach((item)=>{
        if(item.sku == Adjasment_Name.value){
            Adjasment_quantity.value = item.stock
            Adjasment_category.value = item.category
            adj_BTN.dataset.id = item.id
        }
    })
})

action.addEventListener("change",()=>{
    if(action.value == "decrease"){
        amount.style.display=""
        container.innerHTML=`
        <label for="amount" >You Want to decrease to </label>
        `
    }else if(action.value == "increase"){
        amount.style.display=""
        container.innerHTML=`
        <label for="amount" >You Want to increase to </label>
        `
    }
})

adj_BTN.addEventListener("click",async(e)=>{
    e.preventDefault()
    console.log(amount.value);
   
        product_data.forEach((item)=>{
            let result = +item.stock - +amount.value
            console.log(result);
            
        })
        const res = await fetch(`${Product_API}/${adj_BTN.dataset.id}`,{
        method:"PATCH",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
            stock:amount.value
        })
        
    })
    const data = await res.json()
            Add_adjustment()
        
    

})


async function Add_adjustment(){
    let NewResult;
    if(action.value == "decrease"){
    NewResult = Adjasment_quantity.value - amount.value
}else{
    NewResult =   +amount.value - +Adjasment_quantity.value
    
    }
    const res = await fetch(adjustment_API,{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
            product_Name:Adjasment_Name.value,
            type:action.value,
            quantity: NewResult.toString(),
            reason:reason.value,
            old_Quantity : Adjasment_quantity.value,
            New_Quantity : amount.value 
        })
    })
    const data = await res.json()
}
adjClouse.addEventListener("click",()=>{
    adjsmentForm.style.display="none"
    showProducts.style.display=""
})
}
initProductPage()