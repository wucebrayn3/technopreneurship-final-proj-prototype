import React, { useState, useEffect } from "react";
import { getSellerOrders, updateOrderStatus, getSellerSettings } from "../../api";

const statusFlow = ["Pending", "Preparing", "Ready", "Picked Up"];
const statusStyle = {
  Pending: "bg-gray-100 text-gray-600",
  Preparing: "bg-yellow-50 text-yellow-700",
  Ready: "bg-green-50 text-green-700",
  "Picked Up": "bg-blue-50 text-blue-600",
};

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [pickupWindow, setPickupWindow] = useState("10:30 \u2013 12:30");

  const load = async () => {
    setOrders(await getSellerOrders());
    const settings = await getSellerSettings();
    if (settings?.pickup_window) setPickupWindow(settings.pickup_window);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const advanceStatus = async (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      await updateOrderStatus(id, statusFlow[currentIndex + 1]);
      load();
    }
  };

  const filtered = filterStatus === "All" ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
        <div className="flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full">
          <span>{'\u{1F550}'}</span>Pickup {pickupWindow}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
          <div className="text-5xl">{'\u{1F9FE}'}</div>
          <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
          <p className="text-gray-400 text-sm max-w-xs">Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            {["All", ...statusFlow].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === status ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {status}
                {status !== "All" && <span className="ml-1.5 text-xs">({orders.filter((o) => o.status === status).length})</span>}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-xs text-gray-500">{order.customer_name} \u00B7 {new Date(order.created_at).toLocaleTimeString()}</p>
                    <p className="text-xs text-gray-400">{order.items.map(i => `${i.name || `#${i.menu_item_id}`} x${i.quantity}`).join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">{'\u20B1'}{order.total_amount}</span>
                    {order.status !== "Picked Up" && (
                      <button onClick={(e) => { e.stopPropagation(); advanceStatus(order.id); }}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                        {order.status === "Pending" && "Mark as Preparing"}
                        {order.status === "Preparing" && "Mark as Ready"}
                        {order.status === "Ready" && "Mark as Picked Up"}
                      </button>
                    )}
                  </div>
                </div>
                {expandedId === order.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Order Items</p>
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-green-600">{'\u20B1'}{parseFloat(item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500">Payment: {order.payment_method}</p>
                        <p className="text-xs text-gray-500">Customer: {order.customer_name}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">Total: {'\u20B1'}{order.total_amount}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SellerOrders;
