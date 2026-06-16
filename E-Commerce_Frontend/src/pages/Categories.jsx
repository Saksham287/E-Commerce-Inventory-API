import React, { useEffect, useState } from "react";
import {
  getCategories,
  getProducts,
  updateCategory,
  deleteCategory,
} from "../services/api";
import AddProductModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";

function Categories({ setPage }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [search, setSearch] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  const currentRole = localStorage.getItem("role");
  const isAdmin = currentRole === "Admin";

  async function loadData() {
    const categoryData = await getCategories();
    const productData = await getProducts();

    setCategories(categoryData.data || []);
    setProducts(productData.data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalInventoryValue = products.reduce((total, product) => {
    return total + Number(product.price || 0) * Number(product.stock_quantity || 0);
  }, 0);

  const lowStock = products.filter((p) => Number(p.stock_quantity) <= 10).length;

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryProducts = selectedCategory
    ? products.filter(
        (product) => Number(product.category_id) === Number(selectedCategory.id)
      )
    : [];

  function handleView(category) {
    setSelectedCategory(category);
    setOpenActionId(null);
  }

  function handleEdit(category) {
    if (!isAdmin) return;

    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || "",
    });
    setOpenActionId(null);
  }

  async function handleUpdateCategory() {
    if (!isAdmin) {
      alert("Admin access required");
      return;
    }

    if (!editForm.name) {
      alert("Category name is required");
      return;
    }

    await updateCategory(editingCategory.id, editForm);

    setEditingCategory(null);
    setEditForm({ name: "", description: "" });
    loadData();
  }

  async function handleDelete(category) {
    if (!isAdmin) {
      alert("Admin access required");
      return;
    }

    const confirmDelete = window.confirm(`Delete category "${category.name}"?`);
    if (!confirmDelete) return;

    await deleteCategory(category.id);
    setOpenActionId(null);
    loadData();
  }

  return (
    <div className="bg-[#faf8ff] min-h-screen p-8">
      <section className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">
            Categories Management
          </h2>
          <p className="text-slate-500">
            Organize and track your inventory across product segments.
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              + Add Product
            </button>

            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              + Add Category
            </button>
          </div>
        )}
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          onClick={() => setPage("inventory")}
          className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm cursor-pointer hover:shadow-md"
        >
          <p className="text-sm uppercase text-slate-500 mb-2">
            Total Inventory Value
          </p>

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

        <div
          onClick={() => setPage("categories")}
          className="bg-white p-6 rounded-xl border shadow-sm cursor-pointer hover:shadow-md"
        >
          <p className="text-sm text-slate-500">Active Categories</p>
          <h3 className="text-4xl font-bold mt-3">{categories.length}</h3>
          <p className="text-slate-500 mt-2">Across inventory</p>
        </div>

        <div
          onClick={() => setPage("inventory")}
          className="bg-white p-6 rounded-xl border shadow-sm cursor-pointer hover:shadow-md"
        >
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
          <h3 className="text-4xl font-bold mt-3 text-red-600">{lowStock}</h3>
          <p className="text-slate-500 mt-2">Items need attention</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between mb-5">
          <h3 className="text-2xl font-bold">Category Highlights</h3>

          <button
            onClick={() => setPage("products")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            View Gallery ›
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="bg-white border rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md"
            >
              <div className="h-32 bg-gradient-to-r from-indigo-700 to-slate-800 flex items-end p-4">
                <h4 className="text-white font-bold">{category.name}</h4>
              </div>

              <div className="p-4">
                <p className="text-sm text-slate-500">Description</p>
                <p className="font-semibold">
                  {category.description || "No description"}
                </p>

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

      <section className="bg-white border rounded-xl shadow-sm relative overflow-visible">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold">Category Inventory Details</h3>

          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Filter categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-left overflow-visible">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">
                Category Name
              </th>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">
                Description
              </th>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-sm uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="overflow-visible">
            {filteredCategories.map((category) => (
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

                <td className="px-6 py-4 overflow-visible">
                  <div className="relative inline-block overflow-visible">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(
                          openActionId === category.id ? null : category.id
                        );
                      }}
                      className="text-2xl font-black text-slate-700 hover:text-indigo-600 leading-none px-2"
                    >
                      ⋮
                    </button>

                    {openActionId === category.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl w-36 z-[9999]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(category);
                          }}
                          className="block w-full text-left px-4 py-3 hover:bg-slate-100"
                        >
                          View
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(category);
                              }}
                              className="block w-full text-left px-4 py-3 hover:bg-slate-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(category);
                              }}
                              className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 bg-slate-50 flex justify-between rounded-b-xl">
          <p className="text-sm text-slate-500">
            Showing {filteredCategories.length} categories
          </p>

          <button
            onClick={() => setSearch("")}
            className="border px-4 py-2 rounded-lg"
          >
            Clear Filter
          </button>
        </div>
      </section>

      {selectedCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[900px] max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory.name} Products
                </h2>
                <p className="text-slate-500">
                  {categoryProducts.length} products found
                </p>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="text-3xl font-bold text-slate-500 hover:text-red-600"
              >
                ×
              </button>
            </div>

            {categoryProducts.length === 0 ? (
              <p className="text-slate-500">
                No products found in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-xl p-4 shadow-sm hover:shadow-md bg-white"
                  >
                    <h3 className="font-bold text-lg text-slate-900">
                      {product.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      SKU: {product.sku}
                    </p>

                    <p className="text-slate-700 mt-3">
                      Price: ${Number(product.price || 0).toFixed(2)}
                    </p>

                    <p className="text-slate-700">
                      Stock: {product.stock_quantity}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        Number(product.stock_quantity) <= 10
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {Number(product.stock_quantity) <= 10
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && editingCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">
            <h2 className="text-2xl font-bold mb-5">Edit Category</h2>

            <div className="space-y-4">
              <input
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Category Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
              />

              <textarea
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Description"
                rows="4"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingCategory(null)}
                className="border px-5 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateCategory}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <AddProductModal
          show={showAddProductModal}
          categories={categories}
          onClose={() => setShowAddProductModal(false)}
          onProductAdded={() => {
            setShowAddProductModal(false);
            loadData();
          }}
        />
      )}

      {isAdmin && (
        <AddCategoryModal
          show={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          onCategoryAdded={() => {
            setShowAddCategoryModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default Categories;