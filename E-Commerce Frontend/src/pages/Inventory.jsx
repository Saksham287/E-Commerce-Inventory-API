import React, { useEffect, useState } from "react";
import { getProducts, orderProduct, restockProduct } from "../services/api";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data.data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleOrder() {
    if (!selectedProductId || !quantity) return;

    const data = await orderProduct(selectedProductId, quantity);
    setMessage(data.message || data.status || "Order request completed");
    setQuantity("");
    loadProducts();
  }

  async function handleRestock() {
    if (!selectedProductId || !quantity) return;

    const data = await restockProduct(selectedProductId, quantity);
    setMessage(data.message || data.status || "Restock request completed");
    setQuantity("");
    loadProducts();
  }

  const lowStockProducts = products.filter(
    (product) => Number(product.stock_quantity) <= 10
  );

  return (
    <div className="bg-[#faf8ff] min-h-screen p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">
            Inventory Management
          </h2>
          <p className="text-slate-500">
            Monitor, restock, and track all physical assets across locations.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white border text-slate-700 px-6 py-3 rounded-xl font-semibold">
            Export CSV
          </button>

          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold">
            + New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4">
              🛒
            </div>

            <h3 className="text-2xl font-bold mb-2">Order Product</h3>
            <p className="text-slate-500 mb-6">
              Decrease stock when a customer order is processed.
            </p>

            <select
              className="w-full border rounded-lg px-4 py-3 mb-4"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — Stock: {product.stock_quantity}
                </option>
              ))}
            </select>

            <input
              className="w-full border rounded-lg px-4 py-3 mb-4"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button
              onClick={handleOrder}
              className="text-indigo-600 font-semibold"
            >
              Start Order →
            </button>
          </div>

          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <div className="w-12 h-12 bg-cyan-500 text-white rounded-xl flex items-center justify-center mb-4">
              📦
            </div>

            <h3 className="text-2xl font-bold mb-2">Restock Product</h3>
            <p className="text-slate-500 mb-6">
              Increase stock levels for items currently in inventory.
            </p>

            <select
              className="w-full border rounded-lg px-4 py-3 mb-4"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — Stock: {product.stock_quantity}
                </option>
              ))}
            </select>

            <input
              className="w-full border rounded-lg px-4 py-3 mb-4"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button
              onClick={handleRestock}
              className="text-cyan-600 font-semibold"
            >
              Update Levels →
            </button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase">
              Critical Stock Alerts
            </h3>

            <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold">
              {lowStockProducts.length} ACTION REQUIRED
            </span>
          </div>

          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg flex items-center gap-4 bg-slate-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    ⚠️
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-red-600">
                      {product.stock_quantity} units left
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No critical stock alerts.</p>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-2xl font-bold">Inventory History</h3>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                All Logs
              </button>
              <button className="px-3 py-1 rounded-lg text-slate-500">
                Restocks
              </button>
              <button className="px-3 py-1 rounded-lg text-slate-500">
                Shipments
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Product
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  SKU
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Current Stock
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const stock = Number(product.stock_quantity);

                let status = "In Stock";
                let statusClass = "bg-emerald-100 text-emerald-700";

                if (stock === 0) {
                  status = "Out of Stock";
                  statusClass = "bg-red-100 text-red-700";
                } else if (stock <= 10) {
                  status = "Low Stock";
                  statusClass = "bg-amber-100 text-amber-700";
                }

                return (
                  <tr key={product.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                    <td className="px-6 py-4">{product.stock_quantity}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {products.length === 0 && (
            <p className="p-6 text-slate-500">No inventory data found.</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-3 bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase text-slate-500 mb-6">
            Activity Stream
          </h3>

          <div className="space-y-6">
            <div>
              <p className="font-semibold">Audit Completed</p>
              <p className="text-sm text-slate-500">
                Inventory data synced from database.
              </p>
            </div>

            <div>
              <p className="font-semibold">Supplier Check</p>
              <p className="text-sm text-slate-500">
                Product stock levels reviewed.
              </p>
            </div>

            <div>
              <p className="font-semibold">Threshold Breach</p>
              <p className="text-sm text-slate-500">
                Low stock items detected.
              </p>
            </div>
          </div>

          <button className="mt-8 text-indigo-600 font-semibold border rounded-lg w-full py-2">
            View Full Logs
          </button>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-xl">
          {message}
        </div>
      )}
    </div>
  );
}

export default Inventory;