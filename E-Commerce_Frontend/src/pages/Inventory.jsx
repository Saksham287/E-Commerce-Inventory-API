import React, { useEffect, useState } from "react";
import { getProducts, orderProduct, restockProduct } from "../services/api";

function Inventory() {
  const [products, setProducts] = useState([]);

  const [orderProductId, setOrderProductId] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  const [restockProductId, setRestockProductId] = useState("");
  const [restockQuantity, setRestockQuantity] = useState("");

  const [message, setMessage] = useState("");
  const [activeLog, setActiveLog] = useState("all");

  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem("inventoryLogs");
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data.data || data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("inventoryLogs", JSON.stringify(logs));
  }, [logs]);

  function addLog(type, productName, sku, quantity) {
    const user = localStorage.getItem("username") || "Unknown User";

    setLogs((prevLogs) => [
      {
        id: Date.now(),
        type,
        productName,
        sku,
        quantity,
        user,
        time: new Date().toLocaleString(),
      },
      ...prevLogs,
    ]);
  }

  function handleExportCSV() {
    if (products.length === 0) {
      setMessage("No inventory data to export");
      return;
    }

    const headers = ["Product", "SKU", "Current Stock", "Status"];

    const rows = products.map((product) => {
      const stock = Number(product.stock_quantity);

      let status = "In Stock";
      if (stock === 0) status = "Out of Stock";
      else if (stock <= 10) status = "Low Stock";

      return [product.name, product.sku, product.stock_quantity, status];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "inventory.csv";
    link.click();

    URL.revokeObjectURL(url);
    setMessage("CSV exported successfully");
  }

  async function handleOrder() {
    if (!orderProductId || !orderQuantity) {
      setMessage("Please select a product and enter quantity");
      return;
    }

    try {
      const product = products.find(
        (item) => String(item.id) === String(orderProductId)
      );

      const data = await orderProduct(orderProductId, orderQuantity);

      addLog(
        "shipment",
        product?.name || "Unknown Product",
        product?.sku || "-",
        orderQuantity
      );

      setMessage(data.message || data.status || "Shipment completed");

      setOrderProductId("");
      setOrderQuantity("");

      loadProducts();
    } catch (error) {
      setMessage(error.message || "Shipment failed");
    }
  }

  async function handleRestock() {
    if (!restockProductId || !restockQuantity) {
      setMessage("Please select a product and enter quantity");
      return;
    }

    try {
      const product = products.find(
        (item) => String(item.id) === String(restockProductId)
      );

      const data = await restockProduct(restockProductId, restockQuantity);

      addLog(
        "restock",
        product?.name || "Unknown Product",
        product?.sku || "-",
        restockQuantity
      );

      setMessage(data.message || data.status || "Restock completed");

      setRestockProductId("");
      setRestockQuantity("");

      loadProducts();
    } catch (error) {
      setMessage(error.message || "Restock failed");
    }
  }

  const lowStockProducts = products.filter(
    (product) => Number(product.stock_quantity) <= 10
  );

  const filteredLogs =
    activeLog === "all" ? logs : logs.filter((log) => log.type === activeLog);

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

        <button
          onClick={handleExportCSV}
          className="bg-white border text-slate-700 px-6 py-3 rounded-xl font-semibold"
        >
          Export CSV
        </button>
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
              value={orderProductId}
              onChange={(e) => setOrderProductId(e.target.value)}
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
              type="number"
              min="1"
              placeholder="Quantity"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
            />

            <button
              onClick={handleOrder}
              className="text-indigo-600 font-semibold"
            >
              Start Shipment →
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
              value={restockProductId}
              onChange={(e) => setRestockProductId(e.target.value)}
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
              type="number"
              min="1"
              placeholder="Quantity"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
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
              <button
                onClick={() => setActiveLog("all")}
                className={`px-3 py-1 rounded-lg font-semibold ${
                  activeLog === "all"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500"
                }`}
              >
                All Logs
              </button>

              <button
                onClick={() => setActiveLog("restock")}
                className={`px-3 py-1 rounded-lg font-semibold ${
                  activeLog === "restock"
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-500"
                }`}
              >
                Restocks
              </button>

              <button
                onClick={() => setActiveLog("shipment")}
                className={`px-3 py-1 rounded-lg font-semibold ${
                  activeLog === "shipment"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500"
                }`}
              >
                Shipments
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Type
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Product
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  SKU
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Quantity
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  User
                </th>
                <th className="px-6 py-4 text-sm uppercase text-slate-500">
                  Time
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        log.type === "restock"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {log.type === "restock" ? "Restock" : "Shipment"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {log.productName}
                  </td>

                  <td className="px-6 py-4 text-slate-500">{log.sku}</td>

                  <td className="px-6 py-4">{log.quantity}</td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {log.user || "Unknown User"}
                  </td>

                  <td className="px-6 py-4 text-slate-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <p className="p-6 text-slate-500">No logs found.</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-3 bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase text-slate-500 mb-6">
            Activity Stream
          </h3>

          <div className="space-y-6">
            {logs.slice(0, 3).map((log) => (
              <div key={log.id}>
                <p className="font-semibold">
                  {log.type === "restock"
                    ? "Restock Completed"
                    : "Shipment Completed"}
                </p>
                <p className="text-sm text-slate-500">
                  {log.productName} updated by {log.quantity} units by{" "}
                  {log.user || "Unknown User"}.
                </p>
              </div>
            ))}

            {logs.length === 0 && (
              <p className="text-sm text-slate-500">No recent activity yet.</p>
            )}
          </div>

          <button
            onClick={() => setActiveLog("all")}
            className="mt-8 text-indigo-600 font-semibold border rounded-lg w-full py-2"
          >
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