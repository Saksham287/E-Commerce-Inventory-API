import React, { useState } from "react";
import { login } from "../services/api";

function Login({ onLogin }) {
    const [username, setUsername] = useState("admin1");
    const [password, setPassword] = useState("mypassword123");
    const [message, setMessage] = useState("");

    async function handleLogin(e) {
    e.preventDefault();
    const data = await login(username, password);

    if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        onLogin();
    } else {
        setMessage(data.message || "Login failed");
    }
    }

    return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <section className="p-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome back</h1>
            <p className="text-slate-500 mb-8">Enter your credentials to manage inventory.</p>

            <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-semibold mb-2">Username</label>
                <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700">
                Login to StockFlow
            </button>
            </form>

            {message && <p className="text-red-500 mt-4">{message}</p>}
        </section>

        <section className="bg-indigo-700 text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">StockFlow Inventory API</h2>

            <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-bold text-lg">Real-time Inventory</h3>
                <p className="text-indigo-100">Instantly sync products and stock levels.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-bold text-lg">Secure JWT Authentication</h3>
                <p className="text-indigo-100">Role-based access with Admin and Staff permissions.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-bold text-lg">Fast API Performance</h3>
                <p className="text-indigo-100">Flask + MySQL backend optimized for inventory management.</p>
            </div>
            </div>
        </section>
        </div>
    </main>
    );
}

export default Login;