import React, { useEffect, useState } from "react";
import {
    getUsers,
    register,
    updateUser,
    updateUserStatus,
} from "../services/api";
import AddUserModal from "../components/AddUserModal";

function Users() {
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState("");

    async function loadUsers() {
    const data = await getUsers();
    setUsers(data.data || []);
    }

    useEffect(() => {
    loadUsers();
    }, []);

    function handleEdit(user) {
    setEditingUser(user);
    setShowAddModal(true);
    }

    async function handleInactive(id) {
    await updateUserStatus(id, "Inactive");
    setMessage("User marked as inactive");
    loadUsers();
    }

    async function handleSaveUser(data) {
    if (editingUser) {
        await updateUser(editingUser.id, {
        username: data.username,
        role: data.role,
        });

        setMessage("User updated successfully");
    } else {
        await register(data.username, data.password, data.role);
        setMessage("User added successfully");
    }

    setShowAddModal(false);
    setEditingUser(null);
    loadUsers();
    }

    return (
    <div className="bg-[#faf8ff] min-h-screen p-8">
        <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
            User Management
            </h2>
            <p className="text-slate-500">
            Control access levels and manage team member permissions.
            </p>
        </div>

        <button
            onClick={() => {
            setEditingUser(null);
            setShowAddModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
            + Add New User
        </button>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-white border rounded-xl p-6 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-500 mb-2 uppercase">
                Role Filter
            </label>
            <select className="w-full border rounded-lg px-4 py-3">
                <option>All Roles</option>
                <option>Admin</option>
                <option>Staff</option>
            </select>
            </div>

            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-500 mb-2 uppercase">
                Status Filter
            </label>
            <select className="w-full border rounded-lg px-4 py-3">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
            </select>
            </div>

            <button className="text-indigo-600 font-semibold pt-6">
            Clear Filters
            </button>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-indigo-600 text-white rounded-xl p-6 shadow-md">
            <p className="text-sm uppercase tracking-widest text-indigo-100 mb-2">
            Total Active Users
            </p>
            <h3 className="text-5xl font-bold">
            {users.filter((user) => user.status !== "Inactive").length}
            </h3>
            <p className="mt-4 text-indigo-100">Users from MySQL database</p>
        </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead>
                <tr className="bg-slate-100 border-b">
                <th className="px-6 py-4 text-sm text-slate-500 uppercase">
                    User Details
                </th>
                <th className="px-6 py-4 text-sm text-slate-500 uppercase text-center">
                    Role
                </th>
                <th className="px-6 py-4 text-sm text-slate-500 uppercase text-center">
                    Status
                </th>
                <th className="px-6 py-4 text-sm text-slate-500 uppercase">
                    Last Login
                </th>
                <th className="px-6 py-4 text-sm text-slate-500 uppercase text-right">
                    Actions
                </th>
                </tr>
            </thead>

            <tbody>
                {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {user.username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                        <p className="font-semibold text-slate-900">
                            {user.username}
                        </p>
                        <p className="text-sm text-slate-500">
                            user_id: {user.id}
                        </p>
                        </div>
                    </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "Admin"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-cyan-100 text-cyan-700"
                        }`}
                    >
                        {user.role}
                    </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                        {user.status || "Active"}
                    </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                    {user.last_login || "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                    <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 mr-3"
                    >
                        Edit
                    </button>

                    {user.status !== "Inactive" && (
                        <button
                        onClick={() => handleInactive(user.id)}
                        className="text-orange-600 font-medium"
                        >
                        Inactive
                        </button>
                    )}
                    </td>
                </tr>
                ))}

                {users.length === 0 && (
                <tr>
                    <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-500"
                    >
                    No users found or admin access required.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-t">
            <p className="text-sm text-slate-500">Showing {users.length} users</p>

            <div className="flex gap-2">
            <button className="border px-4 py-2 rounded-lg">Previous</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                1
            </button>
            <button className="border px-4 py-2 rounded-lg">Next</button>
            </div>
        </div>
        </div>

        {showAddModal && (
        <AddUserModal
            editingUser={editingUser}
            onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
            }}
            onSave={handleSaveUser}
        />
        )}

        {message && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-xl">
            {message}
        </div>
        )}
    </div>
    );
}

export default Users;
