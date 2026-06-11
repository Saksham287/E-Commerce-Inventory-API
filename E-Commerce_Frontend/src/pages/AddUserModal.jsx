import React, { useEffect, useState } from "react";

function AddUserModal({ editingUser, onClose, onSave }) {
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    role: "Staff",
  });

  useEffect(() => {
    if (editingUser) {
      setUserForm({
        username: editingUser.username || "",
        password: "",
        role: editingUser.role || "Staff",
      });
    } else {
      setUserForm({
        username: "",
        password: "",
        role: "Staff",
      });
    }
  }, [editingUser]);

  function handleChange(e) {
    const { name, value } = e.target;

    setUserForm({
      ...userForm,
      [name]: value,
    });
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

    onSave(userForm);
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

          {!editingUser && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Enter password"
              />
            </div>
          )}

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