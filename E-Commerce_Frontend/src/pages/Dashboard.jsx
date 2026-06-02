import React, { useEffect, useState } from "react";
import { getProducts, getCategories, createProduct } from "../services/api";

function Dashboard({ setPage }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [productForm, setProductForm] = useState({
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

  async function handleQuickAdd() {
    if (
      !productForm.name ||
      !productForm.sku ||
      !productForm.price ||
      !productForm.stock_quantity ||
      !productForm.category_id
    ) {
      alert("Please fill all product fields");
      return;
    }

    const result = await createProduct(productForm);

    if (result.status === "success" || result.message) {
      setShowAddProduct(false);

      setProductForm({
        name: "",
        sku: "",
        price: "",
        stock_quantity: "",
        category_id: "",
      });

      loadData();
      alert("Product added successfully");
    }
  }

  const totalProducts = products.length;
  const totalCategories = categories.length;

  const lowStockItems = products.filter(
    (p) => Number(p.stock_quantity) <= 10
  ).length;

  const totalInventoryValue = products.reduce((total, p) => {
    return total + Number(p.price || 0) * Number(p.stock_quantity || 0);
  }, 0);

  return (
    <div className="bg-[#faf8ff] min-h-screen">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-slate-500">
            Real-time snapshots of your warehouse operations.
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 cursor-pointer"
        >
          + Add New Product
        </button>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => setPage("products")}
            className="cursor-pointer bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition"
          >
            <p className="text-sm text-slate-500 uppercase">Total Products</p>
            <h2 className="text-4xl font-bold mt-3 text-indigo-700">
              {totalProducts}
            </h2>
          </div>

          <div
            onClick={() => setPage("categories")}
            className="cursor-pointer bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition"
          >
            <p className="text-sm text-slate-500 uppercase">Categories</p>
            <h2 className="text-4xl font-bold mt-3 text-cyan-600">
              {totalCategories}
            </h2>
            <p className="text-slate-500 mt-2">Active</p>
          </div>

          <div
            onClick={() => setPage("inventory")}
            className="cursor-pointer bg-red-50 rounded-xl border border-red-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition"
          >
            <p className="text-sm text-red-500 uppercase">Low Stock Alerts</p>
            <h2 className="text-4xl font-bold text-red-600 mt-3">
              {lowStockItems}
            </h2>
            <p className="text-red-500 mt-2">
              {lowStockItems > 0 ? "Critical" : " "}
            </p>
          </div>

          <div
            onClick={() => setPage("inventory")}
            className="cursor-pointer bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition"
          >
            <p className="text-sm text-slate-500 uppercase">Inventory Value</p>
            <h2 className="text-3xl font-bold mt-3 text-emerald-600">
              ${totalInventoryValue.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => setPage("inventory")}
            className="cursor-pointer col-span-2 bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Product Inventory Trends</h3>

              <select
                onClick={(e) => e.stopPropagation()}
                className="border rounded-lg px-3 py-2"
              >
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>

            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center">
              {products.length > 0 ? (
                <svg viewBox="0 0 600 250" className="w-full h-full">
                  <path
                    d="M20 180 C120 150, 180 50, 300 90 S450 200, 580 40"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="4"
                  />
                  <circle cx="420" cy="95" r="5" fill="#4f46e5" />
                </svg>
              ) : (
                <span className="text-slate-400">
                  No inventory trend data yet
                </span>
              )}
            </div>
          </div>

          <div
            onClick={() => setPage("categories")}
            className="cursor-pointer bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-8">Category Distribution</h3>

            <div className="space-y-6">
              {categories.length > 0 ? (
                categories.slice(0, 4).map((category) => (
                  <div
                    key={category.id}
                    className="hover:text-indigo-600 transition"
                  >
                    <div className="flex justify-between">
                      <span>{category.name}</span>
                      <span> </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                      <div className="bg-indigo-600 h-2 rounded-full w-[0%]"></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No categories yet</p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPage("categories");
              }}
              className="mt-8 text-indigo-600 font-semibold cursor-pointer"
            >
              View Detailed Report ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div
            onClick={() => setPage("inventory")}
            className="cursor-pointer bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-4">Recent Stock Movements</h3>

            {products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="border-b pb-4">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-slate-500">
                      Stock: {product.stock_quantity}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No recent movements yet</p>
            )}
          </div>

          <div
            onClick={() => setPage("inventory")}
            className="cursor-pointer bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            <div className="h-full min-h-[240px] bg-slate-100 flex items-center justify-center text-slate-400">
              Logistics image/card
            </div>
          </div>

          <div
            onClick={() => setPage("inventory")}
            className="cursor-pointer bg-indigo-700 text-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition"
          >
            <h3 className="text-2xl font-bold mb-4">
              Inventory Forecasting
            </h3>
            <p className="text-indigo-100">
              Forecasting insights will appear when enough inventory history is
              available.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPage("inventory");
              }}
              className="mt-6 border border-white/30 bg-white/10 px-4 py-2 rounded-lg"
            >
              View Insights
            </button>
          </div>
        </div>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[600px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Product</h2>

              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Product Name"
                className="border rounded-lg px-4 py-3"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="SKU"
                className="border rounded-lg px-4 py-3"
                value={productForm.sku}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    sku: e.target.value,
                  })
                }
              />

              <input
                placeholder="Price"
                className="border rounded-lg px-4 py-3"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: e.target.value,
                  })
                }
              />

              <input
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
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleQuickAdd}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;