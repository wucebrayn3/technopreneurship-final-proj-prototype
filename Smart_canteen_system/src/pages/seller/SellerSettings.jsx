import React, { useState, useEffect } from "react";
import { createReport, logout, getSellerSettings, updateSellerSettings } from "../../api";
import { useNavigate } from "react-router-dom";

const SellerSettings = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [pickupWindow, setPickupWindow] = useState("");
  const [saved, setSaved] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getSellerSettings();
      if (data) {
        setStoreName(data.store_name || "");
        setPickupWindow(data.pickup_window || "10:30 \u2013 12:30");
      }
    })();
  }, []);

  const handleSave = async () => {
    const r = await updateSellerSettings({ store_name: storeName, pickup_window: pickupWindow });
    if (r.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSubmitIssue = async () => {
    if (!issueText.trim()) return;
    const r = await createReport({ subject: "Seller Issue", description: issueText, role: "seller" });
    if (r.ok) {
      setSubmitted(true);
      setIssueText("");
      setShowReportIssue(false);
    }
  };

  const handleUnsubscribe = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="px-10 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Store Info</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Window</label>
              <input type="text" value={pickupWindow} onChange={(e) => setPickupWindow(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">Save Changes</button>
              {saved && <span className="text-sm text-green-600">{'\u2705'} Saved</span>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Report an Issue</h2>
          <p className="text-sm text-gray-400 mb-4">Encountered a problem? Let us know.</p>
          {submitted && (
            <div className="mb-4 bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-lg">{'\u2705'} Issue submitted! We'll look into it.</div>
          )}
          {!showReportIssue ? (
            <button onClick={() => { setShowReportIssue(true); setSubmitted(false); }}
              className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Report Issue</button>
          ) : (
            <div className="flex flex-col gap-3">
              <textarea rows={4} value={issueText} onChange={(e) => setIssueText(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              <div className="flex gap-3">
                <button onClick={handleSubmitIssue} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">Submit</button>
                <button onClick={() => setShowReportIssue(false)} className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-red-500 mb-1">Unsubscribe</h2>
          <p className="text-sm text-gray-400 mb-4">Going out of business? Removing your account will deactivate your store and all your menu items.</p>
          <button onClick={handleUnsubscribe}
            className="border border-red-200 text-red-400 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">Unsubscribe</button>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
