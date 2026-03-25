import Order from "../models/Order.js" 
const URL =  "http://localhost:3000"

class OrderService{
    //w get list of all orders
    async getall() {
        const response = await fetch(`${URL}/orders`)
        return await response.json()
    }

    //w get specific order by id
    async getbyId(id){
        const response = await fetch(`${URL}/orders/${id}`)
        return await response.json()
    }

    //w create a new order and save it's data into the db
    async create(supplierId , productId , quantity){
        const newOrder = new Order(
            Date.now().toString(),
            supplierId,
            productId,
            quantity
        )
        const response = await fetch(`${URL}/orders`,
            {
                method : "put",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(newOrder)
            }
        )
        return await response.json()
    }

    //w edit the order 
    async update(id , updateData){
        const currentorder = await this.getbyId(id)
        if(currentorder.status !== "pending"){
            throw new Error("can't edit this order")
        }
        const response = await fetch(`${URL}/orders/${id}`,
            {
                method : "put",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(updateData)
            }
        )
        return await response.json()
    }

    //w delete the order 
    async delete(id){
        const currentorder = await this.getbyId(id)
        if(currentorder.status !== "pending"){
            throw new Error("can't delete this order")
        }
        await fetch(`${URL}/orders/${id}`, 
            {
                method : "DELETE"
            }
        )
    }
}
export default new OrderService()
