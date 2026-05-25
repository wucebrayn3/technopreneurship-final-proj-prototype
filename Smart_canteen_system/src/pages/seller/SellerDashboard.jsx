import React, { useState, useEffect } from "react";
import { getSellerOrders, getInventory, getUser } from "../../api";

const SellerDashboard = () => {
  const user = getUser();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const o = await getSellerOrders();
      setOrders(o);
      const inv = await getInventory();
      setInventory(inv);
      setLoading(false);
    })();
  }, []);

  const todayOrders = orders.slice(0, 5);
  const lowStockItems = inventory.filter(i => i.quantity <= i.low_stock_threshold);
  const stats = {
    ordersToday: orders.filter(o => { const d = new Date(o.created_at); const now = new Date(); return d.toDateString() === now.toDateString(); }).length,
    revenueToday: orders.filter(o => { const d = new Date(o.created_at); const now = new Date(); return d.toDateString() === now.toDateString(); }).reduce((s, o) => s + parseFloat(o.total_amount), 0),
    itemsSold: orders.filter(o => o.status === "Picked Up").reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0),
    pendingOrders: orders.filter(o => o.status === "Pending" || o.status === "Preparing").length,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user?.store_name || user?.username || "Store"}</h1>
          <span className="inline-block mt-1 text-xs font-medium bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full capitalize">{user?.role || "seller"}</span>
        </div>
        <div className="flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full">
          <span>{'\u{1F550}'}</span>Pickup 10:30 \u2013 12:30
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
          <div className="text-5xl">{'\u{1F4CA}'}</div>
          <h2 className="text-2xl font-bold text-gray-900">No data yet!</h2>
          <p className="text-gray-400 text-sm max-w-xs">Start adding menu items and inventory to see your dashboard data here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Orders Today", value: stats.ordersToday.toString(), icon: "\u{1F9FE}" },
              { label: "Revenue Today", value: `\u20B1${stats.revenueToday.toLocaleString()}`, icon: "\u{1F4B0}" },
              { label: "Items Sold", value: stats.itemsSold.toString(), icon: "\u{1F371}" },
              { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: "\u23F3" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Orders</h2>
              <div className="flex flex-col gap-3">
                {todayOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.order_number}</p>
                      <p className="text-xs text-gray-400">{order.items.map(i => i.name || `#${i.menu_item_id}`).join(", ")} \u00B7 {new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      order.status === "Ready" ? "bg-green-50 text-green-700" : order.status === "Preparing" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">{'\u26A0\uFE0F'} Low Stock Alerts</h2>
              <div className="flex flex-col gap-3">
                {lowStockItems.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">All items sufficiently stocked!</p>
                ) : (lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">{item.quantity} left</span>
                  </div>
                )))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
