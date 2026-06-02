import React, { useEffect, useState } from "react";

function AddUserModal({ onSave, onClose, editingUser }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Staff",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        username: editingUser.username,
        password: "",
        role: editingUser.role,
      });
    }
  }, [editingUser]);

  function handleSave() {
    if (!form.username || (!editingUser && !form.password)) {
      alert("Please fill all required fields");
      return;
    }

    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          {!editingUser && (
            <input
              type="password"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          <select
            className="w-full border rounded-lg px-4 py-3"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Admin</option>
            <option>Staff</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-5 py-2 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            {editingUser ? "Update User" : "Save User"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;