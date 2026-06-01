import React, { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct, getCategories } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
    category_id: "",
  });

  async function loadData() {
    const productData = await getProducts();
    const categoryData = await getCategories();

    setProducts(productData.data || []);
    setCategories(categoryData.data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate() {
    await createProduct({
      name: form.name,
      sku: form.sku,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      category_id: Number(form.category_id),
    });

    setForm({
      name: "",
      sku: "",
      price: "",
      stock_quantity: "",
      category_id: "",
    });

    setShowForm(false);
    loadData();
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    loadData();
  }

  const totalValue = products.reduce((total, product) => {
    return total + Number(product.price || 0) * Number(product.stock_quantity || 0);
  }, 0);

  return (
    <div className="bg-[#faf8ff] min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Products Management</h2>
          <p className="text-slate-500">Inventory › Products</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Stock"
            value={form.stock_quantity}
            onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
          />

          <select
            className="border rounded-lg px-4 py-3"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
              {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            className="md:col-span-5 bg-indigo-600 text-white py-3 rounded-lg font-semibold"
          >
            Save Product
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-slate-500 mb-2 uppercase">Category</label>
              <select className="w-full border rounded-lg py-2 px-3">
                <option>All Categories</option>
                {categories.map((category) => (
                  <option key={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2 uppercase">
                Price Range
              </label>
              <input className="w-full" max="5000" min="0" step="50" type="range" />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2 uppercase">Status</label>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-full border border-indigo-600 bg-indigo-50 text-indigo-600 text-sm">
                  All
                </button>
                <button className="px-3 py-2 rounded-full border text-slate-500 text-sm">
                  In Stock
                </button>
                <button className="px-3 py-2 rounded-full border text-slate-500 text-sm">
                  Low Stock
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Total Value</h3>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
          <p className="mt-4 text-indigo-100">Products: {products.length}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">Image</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">Product Details</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">SKU</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">Price</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">Stock</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">Category</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">Status</th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const stock = Number(product.stock_quantity);
                let status = "In Stock";
                let statusClass = "bg-emerald-50 text-emerald-600";

                if (stock === 0) {
                  status = "Out of Stock";
                  statusClass = "bg-red-50 text-red-600";
                } else if (stock <= 10) {
                  status = "Low Stock";
                  statusClass = "bg-amber-50 text-amber-600";
                }

                return (
                  <tr key={product.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {product.name?.charAt(0) || "P"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">PID-{product.id}</p>
                    </td>

                    <td className="px-6 py-4">{product.sku}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.stock_quantity} units</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                        {product.category_id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 mr-3">Edit</button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No products found. Click Add Product to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-t">
          <p className="text-sm text-slate-500">
            Showing {products.length} products
          </p>

          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded-lg">Previous</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">1</button>
            <button className="border px-4 py-2 rounded-lg">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;