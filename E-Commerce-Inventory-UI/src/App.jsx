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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "220px", background: "#111827", color: "white", padding: "20px" }}>
        <h2>Inventory API</h2>

        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("products")}>Products</button>
        <button onClick={() => setPage("categories")}>Categories</button>
        <button onClick={() => setPage("inventory")}>Inventory</button>
        <button onClick={() => setPage("users")}>Users</button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: "30px" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "products" && <Products />}
        {page === "categories" && <Categories />}
        {page === "inventory" && <Inventory />}
        {page === "users" && <Users />}
      </main>
    </div>
  );
}

export default App;