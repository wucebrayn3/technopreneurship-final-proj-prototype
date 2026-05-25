import React, { useState, useEffect } from "react";
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../../api";

const emptyForm = { name: "", unit: "kg", quantity: "", low_stock_threshold: "" };
const units = ["kg", "L", "pcs", "g", "ml", "pack"];

const SellerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => { setInventory(await getInventory()); setLoading(false); };

  const handleSubmit = async () => {
    if (!form.name || !form.quantity) return;
    const data = { ...form, quantity: Number(form.quantity), low_stock_threshold: Number(form.low_stock_threshold) };
    if (editId !== null) {
      await updateInventoryItem(editId, data);
    } else {
      await createInventoryItem(data);
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, unit: item.unit, quantity: item.quantity, low_stock_threshold: item.low_stock_threshold });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteInventoryItem(id);
    load();
  };

  const lowStockCount = inventory.filter((i) => i.quantity <= i.low_stock_threshold).length;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
          {lowStockCount > 0 && <p className="text-sm text-red-500 mt-1">{'\u26A0\uFE0F'} {lowStockCount} item(s) running low</p>}
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">+ Add Item</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{editId !== null ? "Edit Item" : "New Inventory Item"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Rice" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500">
                {units.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 3" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              {editId !== null ? "Save Changes" : "Add Item"}</button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
              className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="text-5xl">{'\u{1F4E6}'}</div>
            <h2 className="text-xl font-bold text-gray-900">No inventory items yet</h2>
            <p className="text-gray-400 text-sm">Click "+ Add Item" to start tracking your ingredients.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Item</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Unit</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Quantity</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLow = item.quantity <= item.low_stock_threshold;
                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-900">{item.name}</p></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-500">{item.unit}</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{item.quantity} {item.unit}</span></td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isLow ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                        {isLow ? "Low Stock" : "Sufficient"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(item)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="text-xs border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInventory;
