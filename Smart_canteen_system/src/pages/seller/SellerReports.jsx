import React, { useState, useEffect } from "react";
import { getSellerOrders } from "../../api";

const SellerReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getSellerOrders();
      setOrders(data);
      setHasData(data.length > 0);
      setLoading(false);
    })();
  }, []);

  const dailySales = {};
  const itemCount = {};
  orders.forEach(o => {
    const day = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailySales[day] = dailySales[day] || { revenue: 0, orders: 0 };
    dailySales[day].revenue += parseFloat(o.total_amount);
    dailySales[day].orders += 1;
    o.items.forEach(i => {
      itemCount[i.name || `#${i.menu_item_id}`] = (itemCount[i.name || `#${i.menu_item_id}`] || 0) + i.quantity;
    });
  });

  const dailySalesArray = Object.entries(dailySales).map(([date, data]) => ({ date, ...data }));
  const bestSellers = Object.entries(itemCount)
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const totalRevenue = dailySalesArray.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = dailySalesArray.reduce((s, d) => s + d.orders, 0);
  const maxRevenue = Math.max(...dailySalesArray.map((d) => d.revenue), 1);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
          <div className="text-5xl">{'\u{1F4C8}'}</div>
          <h2 className="text-xl font-bold text-gray-900">No reports yet</h2>
          <p className="text-gray-400 text-sm max-w-xs">Reports will appear here once you start receiving orders.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Revenue", value: `\u20B1${totalRevenue.toLocaleString()}`, icon: "\u{1F4B0}" },
              { label: "Total Orders", value: totalOrders.toString(), icon: "\u{1F9FE}" },
              { label: "Avg Revenue/Day", value: `\u20B1${Math.round(totalRevenue / Math.max(dailySalesArray.length, 1)).toLocaleString()}`, icon: "\u{1F4CA}" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Daily Revenue</h2>
            <div className="flex items-end gap-4 h-40">
              {dailySalesArray.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">{'\u20B1'}{day.revenue}</span>
                  <div className="w-full bg-green-500 rounded-t-lg transition-all" style={{ height: `${(day.revenue / maxRevenue) * 100}%` }} />
                  <span className="text-xs text-gray-400">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Best Sellers</h2>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 py-3">Item</th>
                  <th className="text-left text-xs font-semibold text-gray-400 py-3">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((item, index) => (
                  <tr key={item.name} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300">#{index + 1}</span>
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3"><span className="text-sm text-gray-600">{item.sold} pcs</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerReports;
