import React, { useEffect, useState } from "react";
import { getCategories, createCategory, getProducts } from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadData() {
    const categoryData = await getCategories();
    const productData = await getProducts();

    setCategories(categoryData.data || []);
    setProducts(productData.data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddCategory() {
    if (!name) return;

    await createCategory({ name, description });

    setName("");
    setDescription("");
    setShowForm(false);
    loadData();
  }

  const totalInventoryValue = products.reduce((total, product) => {
    return total + Number(product.price || 0) * Number(product.stock_quantity || 0);
  }, 0);

  const lowStock = products.filter((p) => Number(p.stock_quantity) <= 10).length;

  return (
    <div className="bg-[#faf8ff] min-h-screen p-8">
      <section className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Categories Management</h2>
          <p className="text-slate-500">
            Organize and track your inventory across product segments.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + Add Category
        </button>
      </section>

      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8 grid grid-cols-3 gap-4">
          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border rounded-lg px-4 py-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleAddCategory}
            className="bg-indigo-600 text-white rounded-lg font-semibold"
          >
            Save Category
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm uppercase text-slate-500 mb-2">Total Inventory Value</p>
          <h3 className="text-4xl font-bold text-slate-900">
            ${totalInventoryValue.toFixed(2)}
          </h3>

          <div className="mt-8 h-20 w-full flex items-end gap-1">
            <div className="flex-1 bg-indigo-200 rounded-t h-[40%]"></div>
            <div className="flex-1 bg-indigo-200 rounded-t h-[60%]"></div>
            <div className="flex-1 bg-indigo-200 rounded-t h-[45%]"></div>
            <div className="flex-1 bg-indigo-200 rounded-t h-[80%]"></div>
            <div className="flex-1 bg-indigo-200 rounded-t h-[55%]"></div>
            <div className="flex-1 bg-indigo-200 rounded-t h-[90%]"></div>
            <div className="flex-1 bg-indigo-600 rounded-t h-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Active Categories</p>
          <h3 className="text-4xl font-bold mt-3">{categories.length}</h3>
          <p className="text-slate-500 mt-2">Across inventory</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
          <h3 className="text-4xl font-bold mt-3 text-red-600">{lowStock}</h3>
          <p className="text-slate-500 mt-2">Items need attention</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between mb-5">
          <h3 className="text-2xl font-bold">Category Highlights</h3>
          <button className="text-indigo-600 font-semibold">View Gallery ›</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(categories.length > 0 ? categories.slice(0, 4) : []).map((category, index) => (
            <div key={category.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="h-32 bg-gradient-to-r from-indigo-700 to-slate-800 flex items-end p-4">
                <h4 className="text-white font-bold">{category.name}</h4>
              </div>

              <div className="p-4">
                <p className="text-sm text-slate-500">Description</p>
                <p className="font-semibold">{category.description || "No description"}</p>

                <span className="inline-block mt-3 bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                  STABLE
                </span>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-slate-500">No categories added yet.</p>
          )}
        </div>
      </section>

      <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold">Category Inventory Details</h3>

          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Filter categories..."
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">Category Name</th>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">Description</th>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">Status</th>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold">{category.name}</td>
                <td className="px-6 py-4 text-slate-600">
                  {category.description || "No description"}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    In Stock
                  </span>
                </td>
                <td className="px-6 py-4">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 bg-slate-50 flex justify-between">
          <p className="text-sm text-slate-500">
            Showing {categories.length} categories
          </p>

          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded-lg">Previous</button>
            <button className="border px-4 py-2 rounded-lg">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Categories;