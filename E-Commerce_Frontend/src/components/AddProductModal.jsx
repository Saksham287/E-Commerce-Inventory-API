import React, { useState } from "react";
import { createProduct } from "../services/api";

function AddProductModal({
  show = false,
  categories = [],
  onClose,
  handleClose,
  onProductAdded = () => {},
}) {
  const closeModal = onClose || handleClose || (() => {});

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
    category_id: "",
  });

  if (!show) return null;

  async function handleSave() {
    if (
      !productForm.name ||
      !productForm.sku ||
      !productForm.price ||
      !productForm.stock_quantity ||
      !productForm.category_id
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createProduct({
        name: productForm.name,
        sku: productForm.sku,
        price: Number(productForm.price),
        stock_quantity: Number(productForm.stock_quantity),
        category_id: Number(productForm.category_id),
      });

      setProductForm({
        name: "",
        sku: "",
        price: "",
        stock_quantity: "",
        category_id: "",
      });

      onProductAdded();
      closeModal();

      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[600px] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Product</h2>

          <button onClick={closeModal} className="text-gray-500 text-xl">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border rounded-lg px-4 py-3"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="SKU"
            className="border rounded-lg px-4 py-3"
            value={productForm.sku}
            onChange={(e) =>
              setProductForm({ ...productForm, sku: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border rounded-lg px-4 py-3"
            value={productForm.price}
            onChange={(e) =>
              setProductForm({ ...productForm, price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            className="border rounded-lg px-4 py-3"
            value={productForm.stock_quantity}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                stock_quantity: e.target.value,
              })
            }
          />

          <select
            className="border rounded-lg px-4 py-3 col-span-2"
            value={productForm.category_id}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                category_id: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={closeModal} className="px-5 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;