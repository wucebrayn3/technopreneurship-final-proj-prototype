import React, { useState, useEffect } from "react";
import { getMyOrders, getUser } from "../../api";

const CustomerHome = ({ setActiveNav }) => {
  const user = getUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getMyOrders();
      setOrders(data);
      setLoading(false);
    })();
  }, []);

  const activeOrder = orders.find(o => o.status !== "Picked Up" && o.status !== "Cancelled");
  const completedOrders = orders.filter(o => o.status === "Picked Up").slice(0, 3);
  const stats = {
    weekOrders: orders.filter(o => { const d = new Date(o.created_at); const now = new Date(); return d > new Date(now - 7*24*60*60*1000); }).length,
    totalSpent: orders.reduce((s, o) => s + parseFloat(o.total_amount), 0),
    favItem: orders.length > 0 ? orders[0]?.items?.[0]?.name || "N/A" : "N/A",
  };

  return (
    <div className="px-10 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-3xl font-bold text-gray-900">{user?.username || "Customer"}</h1>
          <span className="inline-block mt-1 text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full capitalize">{user?.role || "customer"}</span>
        </div>
        <div className="flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full">
          <span>{'\u{1F550}'}</span>Pickup 10:30 \u2013 12:30
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 mt-16 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl">{'\u{1F371}'}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet!</h2>
            <p className="text-gray-400 text-sm max-w-xs">Browse the canteen menu and place your first order. Skip the line, eat sooner.</p>
          </div>
          <button onClick={() => setActiveNav("Menu")} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Browse Menu \u2192
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {activeOrder && (
            <div className="bg-green-700 text-white rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">Current order \u00B7 {activeOrder.order_number}</p>
                <h2 className="text-xl font-bold mb-1">{activeOrder.status}</h2>
                <p className="text-green-100 text-sm">{activeOrder.items.map(i => `${i.name || `Menu #${i.menu_item_id}`} x${i.quantity}`).join(", ")}</p>
                <p className="text-green-200 text-sm mt-2">{'\u{1F550}'} Pickup window: 10:30 \u2013 12:30</p>
              </div>
              <div className="bg-white rounded-xl w-24 h-24 flex flex-col items-center justify-center gap-1">
                <span className="text-3xl">{'\u25A6'}</span>
                <span className="text-gray-500 text-[10px] font-mono">{activeOrder.order_number}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Orders this week", value: stats.weekOrders.toString(), icon: "\u{1F9FE}" },
              { label: "Total spent", value: `\u20B1${stats.totalSpent}`, icon: "\u{1F4B0}" },
              { label: "Favorite", value: String(stats.favItem), icon: "\u2B50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {completedOrders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Recent orders</h2>
              <div className="flex flex-col gap-3">
                {completedOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.items.map(i => i.name || `#${i.menu_item_id}`).join(", ")}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()} \u00B7 {order.order_number}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{order.status}</span>
                      <span className="text-sm font-semibold text-gray-800">{'\u20B1'}{order.total_amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
