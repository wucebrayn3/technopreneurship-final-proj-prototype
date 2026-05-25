import React, { useState, useEffect } from "react";
import { getMyOrders } from "../../api";

const CustomerHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getMyOrders();
      setOrders(data.filter(o => o.status === "Picked Up" || o.status === "Cancelled"));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
          <div className="text-5xl">{'\u{1F9FE}'}</div>
          <h2 className="text-xl font-bold text-gray-900">No completed orders</h2>
          <p className="text-gray-400 text-sm">Your completed orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{order.order_number}</h3>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()} \u2014 {order.items.map(i => `${i.name || `#${i.menu_item_id}`} x${i.quantity}`).join(", ")}</p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-gray-900">{'\u20B1'}{order.total_amount}</span>
                <span className={`text-xs font-semibold ${order.status === "Picked Up" ? "text-green-600" : "text-red-400"}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHistory;
