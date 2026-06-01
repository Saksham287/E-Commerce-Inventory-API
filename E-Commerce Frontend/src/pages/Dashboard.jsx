import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../services/api";

function Dashboard({ setPage }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadData() {
      const productData = await getProducts();
      const categoryData = await getCategories();

      setProducts(productData.data || []);
      setCategories(categoryData.data || []);
    }

    loadData();
  }, []);

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStockItems = products.filter((p) => Number(p.stock_quantity) <= 10).length;

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
          onClick={() => setPage && setPage("products")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          + Add New Product
        </button>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <p className="text-sm text-slate-500 uppercase">Total Products</p>
            <h2 className="text-4xl font-bold mt-3 text-indigo-700">{totalProducts}</h2>
            <p className="text-green-600 mt-2"> </p>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <p className="text-sm text-slate-500 uppercase">Categories</p>
            <h2 className="text-4xl font-bold mt-3 text-cyan-600">{totalCategories}</h2>
            <p className="text-slate-500 mt-2">Active</p>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-200 p-6 shadow-sm">
            <p className="text-sm text-red-500 uppercase">Low Stock Alerts</p>
            <h2 className="text-4xl font-bold text-red-600 mt-3">{lowStockItems}</h2>
            <p className="text-red-500 mt-2">{lowStockItems > 0 ? "Critical" : " "}</p>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <p className="text-sm text-slate-500 uppercase">Inventory Value</p>
            <h2 className="text-3xl font-bold mt-3 text-emerald-600">
              ${totalInventoryValue.toFixed(2)}
            </h2>
            <p className="text-green-600 mt-2"> </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Product Inventory Trends</h3>
              <select className="border rounded-lg px-3 py-2">
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
                <span className="text-slate-400">No inventory trend data yet</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-8">Category Distribution</h3>

            <div className="space-y-6">
              {categories.length > 0 ? (
                categories.slice(0, 4).map((category) => (
                  <div key={category.id}>
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

            <button className="mt-8 text-indigo-600 font-semibold">
              View Detailed Report ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
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

          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <div className="h-full min-h-[240px] bg-slate-100 flex items-center justify-center text-slate-400">
              Logistics image/card
            </div>
          </div>

          <div className="bg-indigo-700 text-white rounded-xl p-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-4">Inventory Forecasting</h3>
            <p className="text-indigo-100">
              Forecasting insights will appear when enough inventory history is available.
            </p>
            <button className="mt-6 border border-white/30 bg-white/10 px-4 py-2 rounded-lg">
              View Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;