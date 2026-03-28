
export let product = []
export let adjsment_stock = []
export let categoryName = []
export let Product_API = "http://localhost:3000/product"
export let adjustment_API = "http://localhost:3000/adjustment"
export let categories_API = "http://localhost:3000/categories"

try {
    const res = await fetch(Product_API)
    if(!res.ok){
        throw new Error("Http Error : " + res.status)
    }
    product = await res.json()

    
} catch (error) {
   product = []
    
}
try {
    const res = await fetch(categories_API)
    if(!res.ok){
        throw new Error("Http Error : " + res.status)
    }
    categoryName = await res.json()

    
} catch (error) {
   product = []
    
}

export let add_Product_API = async function(name,category,supplier,stock,recorded,sku,image){
    const res = await fetch( Product_API,{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
            name:name.value,
            category:category.value,
            supplier:supplier.value,
            stock:stock.value,
            Reorder_Level:recorded.value,
            sku:sku.value,
            image:image.value
        })
    })
    const data = await res.json()
    console.log(data);
}