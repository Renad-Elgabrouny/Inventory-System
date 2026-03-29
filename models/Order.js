class Order {
  constructor(id, supplierId, productId, quantity, status, date) {
    this.id = id
    this.supplierId = supplierId
    this.productId = productId
    this.quantity = quantity
    this.status = status || "pending"
    this.date = date || new Date().toISOString().split("T")[0]
  }
}
export default Order