import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOP BAR */}

      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-indigo-700">
            StockFlow Dashboard
          </h1>

          <p className="text-slate-500">
            Real-time warehouse analytics
          </p>
        </div>

        <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700">
          Add New Product
        </button>

      </header>

      {/* MAIN CONTENT */}

      <main className="p-8">

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500 mb-2">
              Total Products
            </p>

            <h2 className="text-4xl font-bold text-indigo-700">
              12,842
            </h2>

            <p className="text-green-600 mt-3">
              +12% this month
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500 mb-2">
              Categories
            </p>

            <h2 className="text-4xl font-bold text-cyan-600">
              142
            </h2>

            <p className="text-slate-500 mt-3">
              Active categories
            </p>
          </div>

          <div className="bg-red-100 p-6 rounded-2xl shadow">
            <p className="text-red-700 mb-2">
              Low Stock Alerts
            </p>

            <h2 className="text-4xl font-bold text-red-700">
              28
            </h2>

            <p className="text-red-500 mt-3">
              Critical inventory
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-slate-500 mb-2">
              Orders Processed
            </p>

            <h2 className="text-4xl font-bold text-emerald-600">
              1,405
            </h2>

            <p className="text-green-600 mt-3">
              +24% growth
            </p>
          </div>

        </div>

        {/* CHART + CATEGORY */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* CHART */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-bold">
                Inventory Trends
              </h3>

              <select className="border rounded-lg px-3 py-2">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>

            <div className="h-[300px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xl">
              Analytics Chart Area
            </div>

          </div>

          {/* CATEGORY */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h3 className="text-2xl font-bold mb-6">
              Category Distribution
            </h3>

            <div className="space-y-5">

              <div>
                <div className="flex justify-between mb-2">
                  <span>Electronics</span>
                  <span>42%</span>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full">
                  <div className="bg-indigo-600 h-3 rounded-full w-[42%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Home & Garden</span>
                  <span>28%</span>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full">
                  <div className="bg-cyan-500 h-3 rounded-full w-[28%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Fashion</span>
                  <span>18%</span>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full">
                  <div className="bg-orange-400 h-3 rounded-full w-[18%]"></div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ACTIVITY */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="text-2xl font-bold mb-6">
            Recent Stock Movements
          </h3>

          <div className="space-y-5">

            <div className="border-b pb-4">
              <p className="font-semibold">
                Restocked: Sony PlayStation 5
              </p>

              <p className="text-slate-500 text-sm">
                Warehouse A • 2 mins ago
              </p>
            </div>

            <div className="border-b pb-4">
                <p className="font-semibold">
                Transfer: KitchenAid Mixer
                </p>

                <p className="text-slate-500 text-sm">
                WH B → WH C • 14 mins ago
                </p>
            </div>

            <div>
                <p className="font-semibold text-red-600">
                Out of Stock: iPhone 15 Pro Case
                </p>

                <p className="text-slate-500 text-sm">
                Online Sales • 45 mins ago
                </p>
            </div>

            </div>

        </div>

        </main>

    </div>
    );
}

export default Dashboard;