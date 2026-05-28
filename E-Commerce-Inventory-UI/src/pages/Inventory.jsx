import React, { useState } from "react";
import { orderProduct, restockProduct } from "../services/api";
function Inventory() {
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");

    async function handleOrder() {
    const data = await orderProduct(productId, quantity);
    setMessage(data.message || data.status);
    }

    async function handleRestock() {
    const data = await restockProduct(productId, quantity);
    setMessage(data.message || data.status);
    }

    return (
    <div>
        <h1>Inventory Operations</h1>

        <input placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
        <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <button onClick={handleOrder}>Order Product</button>
        <button onClick={handleRestock}>Restock Product</button>

        <p>{message}</p>
    </div>
    );
}

export default Inventory;