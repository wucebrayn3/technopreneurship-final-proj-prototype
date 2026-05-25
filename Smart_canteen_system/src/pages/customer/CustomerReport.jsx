import React, { useState } from "react";
import { createReport } from "../../api";

const CustomerReport = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) return;
    const r = await createReport({ subject, description, role: "customer" });
    if (r.ok) {
      setSubmitted(true);
      setSubject("");
      setDescription("");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h1>
      <p className="text-sm text-gray-500 mb-6">Tell us what went wrong \u2014 our admin team responds within 24h.</p>
      {submitted && (
        <div className="mb-6 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">{'\u2705'} Report submitted! Our admin team will respond within 24h.</div>
      )}
      <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. Order not received" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Describe the issue</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={4} placeholder="Tell us what went wrong..." />
        </div>
        <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">Submit Report</button>
      </div>
    </div>
  );
};

export default CustomerReport;
