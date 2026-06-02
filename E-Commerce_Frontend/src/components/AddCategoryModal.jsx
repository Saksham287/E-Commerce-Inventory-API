import React, { useState } from "react";
import { createCategory } from "../services/api";

function AddCategoryModal({ show, onClose, onCategoryAdded }) {
    const [form, setForm] = useState({
    name: "",
    description: "",
    });

    if (!show) return null;

    async function handleSave() {
    if (!form.name) {
        alert("Category name is required");
        return;
    }

    await createCategory(form);

    setForm({
        name: "",
        description: "",
    });

    onCategoryAdded();
    onClose();
    }

    return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-[500px]">
        <h2 className="text-2xl font-bold mb-5">Add Category</h2>

        <div className="space-y-4">
            <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) =>
                setForm({
                ...form,
                name: e.target.value,
                })
            }
            />

            <textarea
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Description"
            rows="4"
            value={form.description}
            onChange={(e) =>
                setForm({
                ...form,
                description: e.target.value,
                })
            }
            />
        </div>

        <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-5 py-2 border rounded-lg">
            Cancel
            </button>

            <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
            >
            Save Category
            </button>
        </div>
        </div>
    </div>
    );
}

export default AddCategoryModal;
