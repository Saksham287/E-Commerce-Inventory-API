import React, { useState } from "react";
import { updateProduct } from "../services/api";

function EditProductModal({ product, categories, onClose, onProductUpdated }) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    sku: product.sku || "",
    price: product.price || "",
    stock_quantity: product.stock_quantity || "",
    category_id: product.category_id || "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateProduct(product.id, formData);
      onProductUpdated();
      onClose();
    } catch (error) {
      alert(error.message || "Failed to update product");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />

          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            required
          />

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />

          <input
            name="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={handleChange}
            placeholder="Stock Quantity"
            required
          />

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
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
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;