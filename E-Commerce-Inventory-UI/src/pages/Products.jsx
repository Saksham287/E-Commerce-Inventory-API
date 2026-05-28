import React, { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    });

    async function loadProducts() {
    const data = await getProducts();
    setProducts(data.data || []);
    }

    useEffect(() => {
    loadProducts();
    }, []);

    async function handleCreate() {
    await createProduct({
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        category_id: Number(form.category_id),
    });

    loadProducts();
    }

    async function handleDelete(id) {
    await deleteProduct(id);
    loadProducts();
    }

    return (
    <div>
        <h1>Products</h1>

        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="SKU" onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Stock" onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
        <input placeholder="Category ID" onChange={(e) => setForm({ ...form, category_id: e.target.value })} />

        <button onClick={handleCreate}>Add Product</button>

        <table border="1" cellPadding="10">
        <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category ID</th>
            <th>Action</th>
            </tr>
        </thead>

        <tbody>
            {products.map((product) => (
            <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.price}</td>
                <td>{product.stock_quantity}</td>
                <td>{product.category_id}</td>
                <td>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

export default Products;