const API_BASE_URL = "http://127.0.0.1:5000";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.msg || "Request failed");
  }

  return data;
}

/* AUTH */

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(response);

  const token = data.token || data.access_token;

  if (token) {
    localStorage.setItem("token", token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("role", data.user.role);
  } else {
    localStorage.setItem("username", username);
  }

  return data;
}

export async function register(username, password, role) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username, password, role }),
  });

  return handleResponse(response);
}

/* DASHBOARD */

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

/* PRODUCTS */

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products?page=1&limit=1000`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
}

export async function updateProduct(productId, productData) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function orderProduct(productId, quantity) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/order`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ quantity: Number(quantity) }),
  });

  return handleResponse(response);
}

export async function restockProduct(productId, quantity) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/restock`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ quantity: Number(quantity) }),
  });

  return handleResponse(response);
}

/* CATEGORIES */

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function createCategory(categoryData) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  });

  return handleResponse(response);
}

export async function updateCategory(categoryId, categoryData) {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  });

  return handleResponse(response);
}

export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

/* USERS */

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

export async function updateUser(userId, userData) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

export async function updateUserStatus(userId, status) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}