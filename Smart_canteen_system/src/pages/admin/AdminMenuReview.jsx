import React, { useState, useEffect } from "react";
import { getMenu } from "../../api";

const AdminMenuReview = ({ sellerId, onBack }) => {
  const [items, setItems] = useState([]);
  const [sellerName, setSellerName] = useState("");

  useEffect(() => {
    (async () => {
      const data = await getMenu(sellerId);
      setItems(data);
      if (data.length > 0) setSellerName(data[0].seller_name || "");
    })();
  }, [sellerId]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors">&larr; Back to Verifications</button>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Menu Review</h1>
        {sellerName && <p className="text-sm text-gray-500 mt-1">Seller: {sellerName}</p>}
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl">&#x1F374;</div>
          <h2 className="text-xl font-bold text-gray-900">No menu items</h2>
          <p className="text-sm text-gray-400">This seller hasn't created any menu items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {item.image && (
                <div className="w-full h-36 bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <span className="text-sm font-semibold text-green-600">&#x20B1;{parseFloat(item.price).toFixed(2)}</span>
                </div>
                {item.description && <p className="text-xs text-gray-500 mb-3">{item.description}</p>}
                <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMenuReview;
