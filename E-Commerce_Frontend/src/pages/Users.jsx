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
  const [error, setError] = useState("");

  const currentRole = localStorage.getItem("role");
  const isAdmin = currentRole === "Admin";

  async function loadUsers() {
    try {
      setError("");
      const data = await getUsers();
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
      setUsers([]);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleEdit(user) {
    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    setEditingUser(user);
    setShowAddModal(true);
  }

  async function handleInactive(id, newStatus) {
    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    try {
      setError("");

      await updateUserStatus(id, newStatus);

      setMessage(`User marked as ${newStatus}`);

      await loadUsers();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update user status");
    }
  }

  async function handleSaveUser(data) {
    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    try {
      setError("");

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

      await loadUsers();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Operation failed");
    }
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

        {isAdmin && (
          <button
            onClick={() => {
              setEditingUser(null);
              setShowAddModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
          >
            + Add New User
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-5 py-4 rounded-xl">
          You have view-only access. Only Admins can add, edit, activate or
          deactivate users.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-xl">
          {error}
        </div>
      )}

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

          <p className="mt-4 text-indigo-100">
            Users from MySQL database
          </p>
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

                {isAdmin && (
                  <th className="px-6 py-4 text-sm text-slate-500 uppercase text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isInactive = user.status === "Inactive";

                return (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : "U"}
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
                          isInactive
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isInactive ? "Inactive" : "Active"}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 mr-4 font-medium"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleInactive(
                              user.id,
                              isInactive ? "Active" : "Inactive"
                            )
                          }
                          className={`font-medium ${
                            isInactive
                              ? "text-emerald-600"
                              : "text-orange-600"
                          }`}
                        >
                          {isInactive ? "Activate" : "Deactivate"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t">
          <p className="text-sm text-slate-500">
            Showing {users.length} users
          </p>
        </div>
      </div>

      {isAdmin && showAddModal && (
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