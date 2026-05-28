const API_URL = "http://127.0.0.1:5000";

function getToken() {
    return localStorage.getItem("token");
}

export async function login(username, password) {
    const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    });

    return response.json();
}

export async function register(username, password, role) {
    const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
    });

    return response.json();
}

export async function getProducts() {
    const response = await fetch(`${API_URL}/products`, {
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
    });

    return response.json();
}

export async function createProduct(product) {
    const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
    });

    return response.json();
}

export async function deleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
    });

    return response.json();
}

export async function getCategories() {
    const response = await fetch(`${API_URL}/categories`, {
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
    });

    return response.json();
}

export async function createCategory(category) {
    const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(category),
    });

    return response.json();
}

export async function orderProduct(id, quantity) {
    const response = await fetch(`${API_URL}/products/${id}/order`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ quantity: Number(quantity) }),
    });

    return response.json();
}

export async function restockProduct(id, quantity) {
    const response = await fetch(`${API_URL}/products/${id}/restock`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ quantity: Number(quantity) }),
    });

    return response.json();
}