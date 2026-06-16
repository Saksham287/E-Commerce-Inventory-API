import React, { useEffect, useState } from "react";
import { getWarehouses } from "../services/api";

function AddUserModal({ editingUser, isAdmin, onClose, onSave }) {
  const [warehouses, setWarehouses] = useState([]);

  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    role: "Staff",
    warehouse_id: "",
  });

  useEffect(() => {
    async function loadWarehouses() {
      try {
        const data = await getWarehouses();
        setWarehouses(data.data || []);
      } catch (err) {
        console.error("Failed to load warehouses", err);
      }
    }

    loadWarehouses();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setUserForm({
        username: editingUser.username || "",
        password: "",
        role: editingUser.role || "Staff",
        warehouse_id: editingUser.warehouse_id || "",
      });
    } else {
      setUserForm({
        username: "",
        password: "",
        role: "Staff",
        warehouse_id: "",
      });
    }
  }, [editingUser]);

  function handleChange(e) {
    const { name, value } = e.target;

    setUserForm((prev) => ({
      ...prev,
      [name]: value,
      warehouse_id: name === "role" && value === "Admin" ? "" : prev.warehouse_id,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!userForm.username || !userForm.role) {
      alert("Username and role are required");
      return;
    }

    if (!editingUser && !userForm.password) {
      alert("Password is required for new users");
      return;
    }

    if (isAdmin && userForm.role === "Staff" && !userForm.warehouse_id) {
      alert("Please assign a warehouse to this staff user");
      return;
    }

    onSave({
      ...userForm,
      warehouse_id:
        userForm.role === "Admin" ? null : Number(userForm.warehouse_id),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-5">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Username
            </label>
            <input
              name="username"
              value={userForm.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              {editingUser ? "New Password (optional)" : "Password"}
            </label>
            <input
              name="password"
              type="password"
              value={userForm.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder={
                editingUser
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
            />
          </div>

          {isAdmin ? (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {userForm.role === "Staff" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Assigned Warehouse
                  </label>
                  <select
                    name="warehouse_id"
                    value={userForm.warehouse_id}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3"
                  >
                    <option value="">Select warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.warehouse_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Role
              </label>
              <input
                value={userForm.role}
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-slate-100 text-slate-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              {editingUser ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;