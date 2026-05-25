import React, { useState, useEffect } from "react";
import { getSellerMenu, createMenuItem, updateMenuItem, deleteMenuItem, getInventory } from "../../api";

const emptyForm = { name: "", description: "", price: "", category: "Mains" };
const categories = ["Mains", "Snacks", "Drinks", "Desserts", "Signature"];

const SellerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([{ name: "", qty: "" }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { load(); }, []);
  const load = async () => { setMenuItems(await getSellerMenu()); setLoading(false); };

  const openForm = async (item = null) => {
    const inv = await getInventory();
    setInventory(inv);
    if (item) {
      setForm({ name: item.name, description: item.description, price: item.price, category: item.category });
      setEditId(item.id);
      setImageFile(null);
      setImagePreview(item.image || null);
      const ings = item.ingredients_required || {};
      const rows = Object.keys(ings).length > 0
        ? Object.entries(ings).map(([name, qty]) => ({ name, qty: String(qty) }))
        : [{ name: "", qty: "" }];
      setIngredients(rows);
    } else {
      setForm(emptyForm);
      setEditId(null);
      setImageFile(null);
      setImagePreview(null);
      setIngredients([{ name: "", qty: "" }]);
    }
    setShowForm(true);
  };

  const addIngredientRow = () => setIngredients([...ingredients, { name: "", qty: "" }]);
  const removeIngredientRow = (i) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, idx) => idx !== i));
  };
  const updateIngredient = (i, field, value) => {
    const copy = [...ingredients];
    copy[i][field] = value;
    setIngredients(copy);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;
    const ingredientsObj = {};
    ingredients.forEach(ing => {
      if (ing.name && ing.qty) ingredientsObj[ing.name] = Number(ing.qty);
    });
    const data = imageFile ? new FormData() : {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      ingredients_required: ingredientsObj,
    };
    if (imageFile) {
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', Number(form.price));
      data.append('category', form.category);
      data.append('ingredients_required', JSON.stringify(ingredientsObj));
      data.append('image', imageFile);
    }
    if (editId !== null) {
      await updateMenuItem(editId, data);
    } else {
      await createMenuItem(data);
    }
    setShowForm(false);
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
    load();
  };

  const handleEdit = (item) => openForm(item);

  const handleDelete = async (id) => { await deleteMenuItem(id); load(); };

  const toggleAvailable = async (item) => {
    await updateMenuItem(item.id, { is_available: !item.is_available });
    load();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Menu Management</h1>
        <button onClick={() => openForm()}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">+ Add Item</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{editId !== null ? "Edit Item" : "New Menu Item"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Chicken Adobo Rice Bowl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (\u20B1)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 75" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Classic adobo over warm jasmine rice" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500">
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
              }} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              {imagePreview && (
                <div className="mt-2 relative inline-block">
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{'\u2715'}</button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Ingredients Required</label>
              <button type="button" onClick={addIngredientRow}
                className="text-xs text-green-600 hover:text-green-700 font-semibold">+ Add ingredient</button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option value="">-- Select ingredient --</option>
                    {inventory.map((inv) => (
                      <option key={inv.id} value={inv.name}>{inv.name}</option>
                    ))}
                  </select>
                  <input type="number" step="0.01" min="0" value={ing.qty} onChange={(e) => updateIngredient(i, "qty", e.target.value)}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Qty" />
                  <span className="text-sm text-gray-500 w-12">
                    {inventory.find((inv) => inv.name === ing.name)?.unit || ""}
                  </span>
                  <button onClick={() => removeIngredientRow(i)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none px-1">{'\u2715'}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              {editId !== null ? "Save Changes" : "Add Item"}</button>
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="text-5xl">{'\u{1F371}'}</div>
            <h2 className="text-xl font-bold text-gray-900">No menu items yet</h2>
            <p className="text-gray-400 text-sm">Click "+ Add Item" to add your first menu item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Image</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Item</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Category</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Price</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{item.category}</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{'\u20B1'}{item.price}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleAvailable(item)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${item.is_available ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                      {item.is_available ? "Available" : "Sold Out"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerMenu;
