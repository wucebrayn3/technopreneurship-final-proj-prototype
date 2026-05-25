import React, { useState, useEffect, useRef } from "react";
import { getMenu, createOrder, getMyOrders, getSellers, cancelOrder, getMyReceipts, deleteReceipt } from "../../api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



const tabs = ["Menu", "Cart", "Orders", "Receipt"];
const categories = ["All", "Signature", "Mains", "Snacks", "Drinks", "Desserts"];

const CustomerMenu = ({ setCartCount }) => {
  const [activeTab, setActiveTab] = useState("Menu");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStep, setPaymentStep] = useState("select");
  const [orderNumber, setOrderNumber] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [s, ords, r] = await Promise.all([getSellers(), getMyOrders(), getMyReceipts()]);
      setSellers(s);
      setOrders(ords);
      setReceipts(r);
      setLoading(false);
    })();
  }, []);

  const loadMenu = async (sellerId) => {
    setLoading(true);
    const items = await getMenu(sellerId);
    setMenuItems(items);
    setSelectedSeller(sellers.find(s => s.id === sellerId));
    setCart({});
    setLoading(false);
  };

  const goBackToSellers = () => {
    setSelectedSeller(null);
    setMenuItems([]);
    setCart({});
  };

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((i) => i.category === activeCategory);

  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const increaseQty = (id) => setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  const decreaseQty = (id) => {
    setCart((prev) => {
      if (prev[id] <= 1) { const u = { ...prev }; delete u[id]; return u; }
      return { ...prev, [id]: prev[id] - 1 };
    });
  };
  const removeItem = (id) => setCart((prev) => { const u = { ...prev }; delete u[id]; return u; });
  const clearCart = () => setCart({});

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((i) => i.id.toString() === id);
    return sum + (item ? parseFloat(item.price) * qty : 0);
  }, 0);

  useEffect(() => {
    if (setCartCount) setCartCount(cartCount);
  }, [cartCount, setCartCount]);

  const handleCheckout = () => {
    if (cartCount === 0 || !selectedSeller) return;
    setShowPayment(true);
    setPaymentStep("select");
    setPaymentMethod(null);
  };

  const handleConfirmPayment = () => setPaymentStep("confirm");

  const handlePaymentSuccess = async () => {
    const itemsPayload = Object.entries(cart).map(([id, qty]) => ({
      menu_item_id: parseInt(id), quantity: qty,
    }));
    const r = await createOrder({
      seller: selectedSeller.id,
      items: itemsPayload,
      total_amount: cartTotal,
      payment_method: paymentMethod,
    });
    if (r.ok) {
      const data = await r.json();
      setOrderNumber(data.order.order_number);
      setLastReceipt(data.receipt);
      setPaymentStep("success");
      clearCart();
      const [ords, rcpts] = await Promise.all([getMyOrders(), getMyReceipts()]);
      setOrders(ords);
      setReceipts(rcpts);
    }
  };

  const handleDonePayment = () => {
    setShowPayment(false);
    setActiveTab("Receipt");
  };

  const handleCancelOrder = async (orderId) => {
    const r = await cancelOrder(orderId);
    if (r.ok) {
      const ords = await getMyOrders();
      setOrders(ords);
    }
  };

  const handleDeleteReceipt = async (receiptId) => {
    const r = await deleteReceipt(receiptId);
    if (r.ok) {
      setReceipts(receipts.filter((rec) => rec.id !== receiptId));
      if (selectedReceiptId === receiptId) setSelectedReceiptId(null);
    }
  };

  const handleExportPNG = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, { backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `receipt-${selectedReceipt?.receipt_number || "download"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleExportPDF = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, { backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`receipt-${selectedReceipt?.receipt_number || "download"}.pdf`);
  };

  const selectedReceipt = receipts.find((r) => r.id === selectedReceiptId) || lastReceipt;

  const sellerName = selectedSeller?.store_name || selectedSeller?.username || "";

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedSeller ? (
            <button onClick={goBackToSellers} className="text-green-600 hover:underline mr-2 text-base font-medium">{'\u2190'} All Sellers</button>
          ) : null}
          {selectedSeller ? sellerName : "Sellers"}
        </h1>
        <div className="flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full">
          <span>{'\u{1F550}'}</span>Pickup 10:30 \u2013 12:30
        </div>
      </div>

      {/* Seller / Menu tabs shown only when a seller is selected */}
      {selectedSeller && (
        <div className="flex gap-2 mb-4 border-b pb-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {tab}
              {tab === "Cart" && cartCount > 0 && (
                <span className="ml-1.5 bg-white text-green-600 text-xs rounded-full px-1.5 py-0.5 font-bold">{cartCount}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── SELLER SELECTION ── */}
      {!selectedSeller && (
        <>
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading sellers...</div>
          ) : sellers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
              <div className="text-5xl">{'\u{1F3EA}'}</div>
              <h2 className="text-2xl font-bold text-gray-900">No sellers yet</h2>
              <p className="text-gray-400 text-sm max-w-xs">No canteens are registered yet. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sellers.map((seller) => (
                <button key={seller.id} onClick={() => loadMenu(seller.id)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left hover:border-green-300 hover:shadow-md transition-all">
                  <div className="text-4xl mb-3">{'\u{1F3EA}'}</div>
                  <h3 className="text-lg font-bold text-gray-900">{seller.store_name || seller.username}</h3>
                  <p className="text-sm text-gray-400 mt-1">{seller.school}</p>
                  <p className="text-xs text-gray-400 mt-1">{'\u{1F550}'} {seller.pickup_window}</p>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── SELLER MENU ── */}
      {selectedSeller && activeTab === "Menu" && (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>{cat}</button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading menu...</div>
          ) : menuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
              <div className="text-5xl">{'\u{1F371}'}</div>
              <h2 className="text-xl font-bold text-gray-900">No menu items</h2>
              <p className="text-gray-400 text-sm">This seller hasn't added any menu items yet.</p>
              <button onClick={goBackToSellers} className="text-green-600 hover:underline text-sm font-medium">{'\u2190'} Back to sellers</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="relative">
                    <div className="w-full h-36 bg-gray-100 rounded-xl overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                    {!item.is_available ? (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Sold out</span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Available</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-gray-900">{'\u20B1'}{item.price}</span>
                    {cart[item.id] ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center">{'\u2212'}</button>
                        <span className="text-sm font-semibold w-4 text-center">{cart[item.id]}</span>
                        <button onClick={() => increaseQty(item.id)} className="w-7 h-7 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item.id)}
                        disabled={!item.is_available}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!item.is_available ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── CART ── */}
      {selectedSeller && activeTab === "Cart" && (
        <div className="mt-6">
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-[420px] shadow-xl">
                {paymentStep === "select" && (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Choose Payment Method</h2>
                    <p className="text-sm text-gray-400 mb-6">Total: <span className="font-bold text-gray-900">{'\u20B1'}{cartTotal}</span></p>
                    <div className="flex flex-col gap-3 mb-6">
                      {[
                        { id: "gcash", label: "GCash", icon: "\u{1F4F1}", desc: "Pay via GCash mobile wallet" },
                        { id: "maya", label: "Maya", icon: "\u{1F4B3}", desc: "Pay via Maya digital wallet" },
                        { id: "cash", label: "Cash on Pickup", icon: "\u{1F4B5}", desc: "Pay when you pick up your order" },
                      ].map((method) => (
                        <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${paymentMethod === method.id ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}>
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                            <p className="text-xs text-gray-400">{method.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleConfirmPayment} disabled={!paymentMethod}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${paymentMethod ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>Continue</button>
                      <button onClick={() => setShowPayment(false)} className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  </>
                )}

                {paymentStep === "confirm" && (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm Payment</h2>
                    <p className="text-sm text-gray-400 mb-6">Paying <span className="font-bold text-gray-900">{'\u20B1'}{cartTotal}</span> via <span className="font-bold text-gray-900 capitalize">{paymentMethod === "cash" ? "Cash on Pickup" : paymentMethod}</span></p>
                    {paymentMethod === "gcash" && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
                        <p className="text-3xl mb-2">{'\u{1F4F1}'}</p>
                        <p className="text-sm font-semibold text-blue-700">GCash Mock Payment</p>
                        <p className="text-xs text-blue-500 mt-1">Send {'\u20B1'}{cartTotal} to <span className="font-bold">0917-BENTO-PH</span></p>
                      </div>
                    )}
                    {paymentMethod === "maya" && (
                      <div className="bg-green-50 rounded-xl p-4 mb-6 text-center">
                        <p className="text-3xl mb-2">{'\u{1F4B3}'}</p>
                        <p className="text-sm font-semibold text-green-700">Maya Mock Payment</p>
                        <p className="text-xs text-green-500 mt-1">Send {'\u20B1'}{cartTotal} to <span className="font-bold">0961-BENTO-PH</span></p>
                      </div>
                    )}
                    {paymentMethod === "cash" && (
                      <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-center">
                        <p className="text-3xl mb-2">{'\u{1F4B5}'}</p>
                        <p className="text-sm font-semibold text-yellow-700">Cash on Pickup</p>
                        <p className="text-xs text-yellow-600 mt-1">Please prepare exact amount: <span className="font-bold">{'\u20B1'}{cartTotal}</span></p>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={handlePaymentSuccess} className="flex-1 py-3 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 text-white transition-colors">
                        {paymentMethod === "cash" ? "Confirm Order" : "I've Paid"}
                      </button>
                      <button onClick={() => setPaymentStep("select")} className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
                    </div>
                  </>
                )}

                {paymentStep === "success" && (
                  <div className="text-center">
                    <div className="text-5xl mb-4">{'\u{1F389}'}</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-sm text-gray-400 mb-4">Your unique order number is:</p>
                    <div className="bg-green-50 rounded-xl py-4 px-6 mb-4">
                      <p className="text-3xl font-black text-green-700 tracking-widest">{orderNumber}</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-6">Show this number when picking up your order.</p>
                    <button onClick={handleDonePayment} className="w-full py-3 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 text-white transition-colors">View Receipt</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedSeller ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
              <div className="text-5xl">{'\u{1F6D2}'}</div>
              <h2 className="text-xl font-bold text-gray-900">Select a seller first</h2>
              <button onClick={goBackToSellers} className="text-green-600 hover:underline text-sm font-medium">{'\u2190'} Browse sellers</button>
            </div>
          ) : cartCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
              <div className="text-5xl">{'\u{1F6D2}'}</div>
              <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="text-gray-400 text-sm">Go to Menu and add some items!</p>
              <button onClick={() => setActiveTab("Menu")} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">Browse Menu</button>
            </div>
          ) : (
            <div className="max-w-lg">
              <p className="text-xs text-gray-400 mb-3">Ordering from: <span className="font-semibold text-gray-700">{sellerName}</span></p>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-900">{cartCount} item(s) in cart</h2>
                <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 transition-colors">Clear all</button>
              </div>
              <div className="space-y-3">
                {Object.entries(cart).map(([id, qty]) => {
                  const item = menuItems.find((i) => i.id.toString() === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-400">{'\u20B1'}{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2 mx-4">
                        <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center">{'\u2212'}</button>
                        <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                        <button onClick={() => increaseQty(item.id)} className="w-7 h-7 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center">+</button>
                      </div>
                      <span className="font-bold text-gray-900 w-16 text-right">{'\u20B1'}{parseFloat(item.price) * qty}</span>
                      <button onClick={() => removeItem(item.id)} className="ml-3 text-gray-300 hover:text-red-400 transition-colors text-lg">{'\u2715'}</button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-lg font-bold text-gray-900">{'\u20B1'}{cartTotal}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition-colors">Checkout</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS ── */}
      {activeTab === "Orders" && (
        <div className="mt-6">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
              <div className="text-5xl">{'\u{1F9FE}'}</div>
              <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
              <p className="text-gray-400 text-sm">Place your first order to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-lg">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-400">{order.items.map(i => `${i.name || `#${i.menu_item_id}`} x${i.quantity}`).join(", ")}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.status === "Ready" ? "bg-green-50 text-green-700" : order.status === "Preparing" ? "bg-yellow-50 text-yellow-700" : order.status === "Picked Up" ? "bg-blue-50 text-blue-600" : order.status === "Cancelled" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                      {order.status === "Pending" && (
                        <button onClick={() => handleCancelOrder(order.id)}
                          className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RECEIPT ── */}
      {activeTab === "Receipt" && (
        <div className="mt-6 max-w-lg">
          {receipts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
              <div className="text-5xl">{'\u{1F4C4}'}</div>
              <h2 className="text-xl font-bold text-gray-900">No receipts yet</h2>
              <p className="text-gray-400 text-sm">Your receipts will appear here after checkout.</p>
            </div>
          ) : selectedReceiptId && selectedReceipt ? (
            <div>
              <button onClick={() => setSelectedReceiptId(null)}
                className="text-sm text-gray-500 hover:text-gray-800 mb-4 block">&larr; All Receipts</button>
              <div ref={receiptRef} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Receipt</h2>
                  <span className="text-xs font-mono bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold">{selectedReceipt.order_number || selectedReceipt.receipt_number}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{selectedReceipt.seller_name}</p>
                <p className="text-xs text-gray-400 mb-4">{new Date(selectedReceipt.created_at).toLocaleString()}</p>
                {selectedReceipt.items && selectedReceipt.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm mb-2 text-gray-700">
                    <span>{item.name} \u00D7 {item.quantity}</span>
                    <span>{'\u20B1'}{parseFloat(item.price || 0) * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-4 border-t pt-3">
                  <span>Total</span>
                  <span>{'\u20B1'}{selectedReceipt.total}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <p>Receipt #: {selectedReceipt.receipt_number}</p>
                  <p>Payment: {selectedReceipt.payment_method}</p>
                  <p>Order: {selectedReceipt.order}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleExportPNG}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Save as PNG</button>
                <button onClick={handleExportPDF}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Save as PDF</button>
                <button onClick={() => handleDeleteReceipt(selectedReceipt.id)}
                  className="border border-red-200 text-red-400 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Delete</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">All Receipts</p>
              {receipts.map((rec) => (
                <button key={rec.id} onClick={() => setSelectedReceiptId(rec.id)}
                  className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-green-300 transition-all flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{rec.receipt_number}</p>
                    <p className="text-xs text-gray-400">{rec.seller_name} \u00B7 {new Date(rec.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{'\u20B1'}{rec.total}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
