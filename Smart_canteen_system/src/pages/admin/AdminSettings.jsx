import React from "react";

const AdminSettings = () => {
  return (
    <div className="px-10 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Admin Info</h2>
          <p className="text-sm text-gray-400">Admin settings and password management can be configured here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
