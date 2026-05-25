import React from "react";
import NavBar from "./NavBar";

const PartnerPage = ({ showNavbar = true }) => {
  return (
    <div className={`bg-white flex flex-col ${showNavbar ? "min-h-screen" : ""}`}>

      {showNavbar && <NavBar />}

      <div className={showNavbar ? "flex-1 max-w-[1280px] mx-auto px-8 w-full py-10" : "w-full"}>

        <div className="bg-[#1a2e1a] rounded-2xl px-16 py-14 flex flex-row items-center gap-12">

          {/* Left */}
          <div className="flex-1 text-white">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Pilot a faster canteen at your school.
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md">
              We're seeking school partners to pilot a faster and more efficient canteen experience.
              Students get their lunch back. Sellers get better margins. Admins get visibility.
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Free 30-day pilot · No setup fee
            </div>
          </div>

          {/* Right form */}
          <div className="bg-white rounded-2xl p-8 w-[420px] flex-none shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Partner inquiry</h2>
            <div className="space-y-3">
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Your name" />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Email" />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="School name" />
              <textarea rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="Tell us about your canteen setup" />
              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors">
                Request pilot
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PartnerPage;