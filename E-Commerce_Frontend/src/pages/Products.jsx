import React, { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  getCategories,
  deleteProduct,
  updateProduct,
} from "../services/api";
import AddProductModal from "../components/AddProductModal";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
    category_id: "",
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const productsPerPage = 15;

  const currentRole = localStorage.getItem("role");
  const isAdmin = currentRole === "Admin";

  useEffect(() => {
    loadData();
  }, []);

  function extractArray(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.products)) return response.products;
    if (Array.isArray(response?.categories)) return response.categories;
    return [];
  }

  async function loadData() {
    try {
      const productData = await getProducts();
      const categoryData = await getCategories();

      setProducts(extractArray(productData));
      setCategories(extractArray(categoryData));
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setCategories([]);
    }
  }

  function getCategoryName(categoryId) {
    const category = categories.find(
      (cat) => String(cat.id) === String(categoryId)
    );

    return category ? category.name : "No Category";
  }

  function getStockStatus(stockQuantity) {
    const stock = Number(stockQuantity);

    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  }

  function handleFilterChange(callback) {
    callback();
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  function openEditModal(product) {
    if (!isAdmin) return;

    setSelectedProduct(product);
    setEditForm({
      name: product.name || "",
      sku: product.sku || "",
      price: product.price || "",
      stock_quantity: product.stock_quantity || "",
      category_id: product.category_id || "",
    });
    setShowEditModal(true);
  }

  function closeEditModal() {
    setShowEditModal(false);
    setSelectedProduct(null);
  }

  function handleEditChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    if (!isAdmin) {
      alert("Admin access required");
      return;
    }

    if (!selectedProduct) return;

    try {
      await updateProduct(selectedProduct.id, editForm);
      await loadData();
      closeEditModal();
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.message || "Failed to update product");
    }
  }

  async function handleDelete(productId) {
    if (!isAdmin) {
      alert("Admin access required");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      await loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product");
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const productSku = product.sku?.toLowerCase() || "";
      const productCategoryId = String(product.category_id || "");
      const productPrice = Number(product.price || 0);
      const productStatus = getStockStatus(product.stock_quantity);

      const matchesSearch =
        productName.includes(search.toLowerCase()) ||
        productSku.includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        productCategoryId === String(categoryFilter);

      const matchesStatus =
        statusFilter === "all" || productStatus === statusFilter;

      const matchesMinPrice =
        minPrice === "" || productPrice >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || productPrice <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [products, search, categoryFilter, statusFilter, minPrice, maxPrice]);

  const totalValue = filteredProducts.reduce((total, product) => {
    return (
      total + Number(product.price || 0) * Number(product.stock_quantity || 0)
    );
  }, 0);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products Management</h1>
          <p>Inventory › Products</p>
        </div>

        {isAdmin && (
          <button
            className="add-product-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Product
          </button>
        )}
      </div>

      <div className="products-top">
        <div className="filters-card">
          <div className="filter-group">
            <label>Search Product</label>
            <input
              type="text"
              placeholder="Search by name or SKU"
              value={search}
              onChange={(e) =>
                handleFilterChange(() => setSearch(e.target.value))
              }
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) =>
                handleFilterChange(() => setCategoryFilter(e.target.value))
              }
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) =>
                  handleFilterChange(() => setMinPrice(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) =>
                  handleFilterChange(() => setMaxPrice(e.target.value))
                }
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <div className="status-buttons">
              <button
                className={statusFilter === "all" ? "active" : ""}
                onClick={() => handleFilterChange(() => setStatusFilter("all"))}
              >
                All
              </button>

              <button
                className={statusFilter === "In Stock" ? "active" : ""}
                onClick={() =>
                  handleFilterChange(() => setStatusFilter("In Stock"))
                }
              >
                In Stock
              </button>

              <button
                className={statusFilter === "Low Stock" ? "active" : ""}
                onClick={() =>
                  handleFilterChange(() => setStatusFilter("Low Stock"))
                }
              >
                Low Stock
              </button>

              <button
                className={statusFilter === "Out of Stock" ? "active" : ""}
                onClick={() =>
                  handleFilterChange(() => setStatusFilter("Out of Stock"))
                }
              >
                Out of Stock
              </button>
            </div>
          </div>

          <button className="clear-filter-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="value-card">
          <h3>Total Value</h3>
          <h2>
            {totalValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h2>
          <p>Products: {filteredProducts.length}</p>
        </div>
      </div>

      <div className="products-table-card">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Details</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              {isAdmin && <th className="actions-head">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const status = getStockStatus(product.stock_quantity);

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-avatar">
                        {product.name?.charAt(0).toUpperCase()}
                      </div>
                    </td>

                    <td>
                      <strong>{product.name}</strong>
                      <p>PID-{product.id}</p>
                    </td>

                    <td>{product.sku}</td>

                    <td>
                      {Number(product.price || 0).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>

                    <td>{product.stock_quantity} units</td>

                    <td>{getCategoryName(product.category_id)}</td>

                    <td>
                      <span
                        className={`status-pill ${
                          status === "In Stock"
                            ? "in-stock"
                            : status === "Low Stock"
                            ? "low-stock"
                            : "out-stock"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="empty-row">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <p>
            {filteredProducts.length === 0
              ? "Showing 0 of 0 products"
              : `Showing ${(page - 1) * productsPerPage + 1}-${Math.min(
                  page * productsPerPage,
                  filteredProducts.length
                )} of ${filteredProducts.length} products`}
          </p>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isAdmin && showAddModal && (
        <AddProductModal
          show={showAddModal}
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onProductAdded={() => {
            setShowAddModal(false);
            loadData();
          }}
        />
      )}

      {isAdmin && showEditModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Product</h2>

            <form onSubmit={handleEditSubmit}>
              <label>Product Name</label>
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
              />

              <label>SKU</label>
              <input
                name="sku"
                value={editForm.sku}
                onChange={handleEditChange}
                required
              />

              <label>Price</label>
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                required
              />

              <label>Stock Quantity</label>
              <input
                name="stock_quantity"
                type="number"
                value={editForm.stock_quantity}
                onChange={handleEditChange}
                required
              />

              <label>Category</label>
              <select
                name="category_id"
                value={editForm.category_id}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal}>
                  Cancel
                </button>

                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;