import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";

function App() {
  const [page, setPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const navItems = [
    ["dashboard", "Dashboard"],
    ["categories", "Categories"],
    ["products", "Products"],
    ["inventory", "Inventory"],
    ["users", "Users"],
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col py-6 fixed left-0 top-0 h-screen">
        <div className="px-6 mb-8">
          <h1 className="text-2xl font-bold text-indigo-700">StockFlow</h1>
          <p className="text-sm text-slate-500">Management v2.4</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                page === key
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "products" && <Products />}
        {page === "categories" && <Categories />}
        {page === "inventory" && <Inventory />}
        {page === "users" && <Users />}
      </main>
    </div>
  );
}

export default App;