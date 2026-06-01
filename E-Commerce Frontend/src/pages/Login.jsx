import React, { useState } from "react";
import { login, register } from "../services/api";

function Login({ onLogin }) {
    const [username, setUsername] = useState("admin1");
    const [password, setPassword] = useState("mypassword123");
    const [role, setRole] = useState("Admin");
    const [message, setMessage] = useState("");
    const [showRegister, setShowRegister] = useState(false);

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

    async function handleRegister() {
    const data = await register(username, password, role);
    setMessage(data.message || "Registered successfully. Now login.");
    }

    return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <section className="p-10">
            <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg mb-6 flex items-center justify-center text-white font-bold">
                SF
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Welcome back
            </h1>

            <p className="text-slate-500">
                Enter your credentials to manage your inventory.
            </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-semibold mb-2">
                Username
                </label>
                <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janesmith_dev"
                />
            </div>

            <div>
                <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold">
                    Password
                </label>
                <span className="text-sm text-indigo-600 font-semibold">
                    Forgot?
                </span>
                </div>

                <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                />
            </div>

            {showRegister && (
                <div>
                <label className="block text-sm font-semibold mb-2">
                    Role
                </label>
                <select
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option>Admin</option>
                    <option>Staff</option>
                </select>
                </div>
            )}

            <div className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm text-slate-500">
                Keep me logged in for 30 days
                </span>
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700"
            >
                Login to StockFlow →
            </button>
            </form>

            <div className="mt-8 pt-5 border-t text-center">
            <p className="text-sm text-slate-500">
                New to the platform?{" "}
                <button
                onClick={() => setShowRegister(!showRegister)}
                className="text-indigo-600 font-semibold"
                >
                Register account
                </button>
            </p>

            {showRegister && (
                <button
                onClick={handleRegister}
                className="mt-4 rounded-lg border border-indigo-600 text-indigo-600 px-5 py-2 font-semibold hover:bg-indigo-50"
                >
                Create Account
                </button>
            )}
            </div>

            {message && <p className="text-red-500 mt-4 text-center">{message}</p>}
        </section>

        <section className="bg-indigo-700 text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">
            StockFlow Inventory API
            </h2>

            <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-bold text-lg">Real-time Inventory</h3>
                <p className="text-indigo-100">
                Instantly sync products and stock levels.
                </p>
            </div>

            <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-bold text-lg">Secure JWT Authentication</h3>
                <p className="text-indigo-100">
                Role-based access with Admin and Staff permissions.
                </p>
            </div>

            <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-bold text-lg">Fast API Performance</h3>
                <p className="text-indigo-100">
                Flask + MySQL backend optimized for inventory management.
                </p>
            </div>
            </div>
        </section>
        </div>
    </main>
    );
}

export default Login;