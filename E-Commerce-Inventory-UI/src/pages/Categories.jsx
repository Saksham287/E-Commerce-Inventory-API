import React, { useEffect, useState } from "react";
import { getCategories, createCategory } from "../services/api";
function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    async function loadCategories() {
    const data = await getCategories();
    setCategories(data.data || []);
    }

    useEffect(() => {
    loadCategories();
    }, []);

    async function handleCreate() {
    await createCategory({ name, description });
    loadCategories();
    }

    return (
    <div>
        <h1>Categories</h1>

        <input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <button onClick={handleCreate}>Add Category</button>

        <table border="1" cellPadding="10">
        <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            </tr>
        </thead>

        <tbody>
            {categories.map((category) => (
            <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

export default Categories;