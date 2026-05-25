import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import landingphoto from "../assets/hero-canteen.jpg";
import howitworks from "../assets/howitworks.jpg";
import PartnerPage from "./PartnerPage";

const LandingPage = () => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (!state?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return (
    <div id="hero" className="min-h-screen bg-white flex flex-col">

      <NavBar />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Hero */}
        <section className="flex flex-col md:flex-row items-center justify-between mt-8 md:mt-16 scroll-mt-24 gap-8 md:gap-0">
          <div className="w-full md:w-1/2 text-left max-w-lg">

            <div className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-full px-3 py-1 mb-4 shadow-sm">
              <span className="text-gray-400 text-xs">âœ¦</span>
              <span className="text-sm text-gray-500">Live in 3 schools this term</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              <span className="text-gray-900">Skip the line.</span><br />
              <span className="text-gray-400">Eat sooner.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
              BiteHub is the smart canteen pre-order system for schools. Students
              order ahead and pick up â€” no lines, no chaos, no sold-out surprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => navigate("/auth")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Start ordering <span>â†’</span>
              </button>
              <button
                onClick={() => navigate("/partner")}
                className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Become a school partner
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                Avg pickup in 4 mins
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                QR pickup verification
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[480px] h-[240px] sm:h-[300px] md:h-[340px]">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white rounded-xl shadow-md px-4 py-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                <span className="text-sm font-semibold text-gray-800">42 orders today</span>
              </div>
              <div className="w-full h-full bg-green-200 rounded-2xl border border-green-300">
                <img src={landingphoto} alt="Landing" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        <hr className="my-12 md:my-16 border-gray-200" />

        {/* Features */}
        <section id="features" className="py-12 md:py-24 scroll-mt-24 bg-gray-50 p-4 sm:p-6 md:p-10 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border"><h3 className="font-semibold">Mobile-first PWA</h3><p className="text-sm text-gray-600 mt-1">Install on any phone. Works offline-ready.</p></div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border"><h3 className="font-semibold">Live menu</h3><p className="text-sm text-gray-600 mt-1">See what's still in stock â€” updated in real time.</p></div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border"><h3 className="font-semibold">Smart notifications</h3><p className="text-sm text-gray-600 mt-1">Know exactly when your order is ready.</p></div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border"><h3 className="font-semibold">QR pickup</h3><p className="text-sm text-gray-600 mt-1">Show your code at the counter â€” no name shouting.</p></div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border"><h3 className="font-semibold">Auto inventory</h3><p className="text-sm text-gray-600 mt-1">Sellers' stock deducts automatically per order.</p></div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border"><h3 className="font-semibold">Sales analytics</h3><p className="text-sm text-gray-600 mt-1">Sellers track best-sellers, peak hours, revenue.</p></div>
          </div>
        </section>

        <hr className="my-12 md:my-16 border-gray-200" />

        {/* How it Works */}
        <section id="how" className="py-2 scroll-mt-24 flex flex-col md:flex-row gap-8 md:gap-16 items-center bg-white p-4 sm:p-6 md:p-10 rounded-3xl">
          <div className="w-full md:w-1/2">
            <img src={howitworks} alt="How it works" className="w-full h-[250px] sm:h-[350px] md:h-[500px] object-cover rounded-3xl shadow-md" />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Three taps, then it's lunch.</h2>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed">
              BiteHub keeps the ordering process simple, fast, and stress-free for students.
            </p>
            <div className="space-y-4 md:space-y-5">
              {[
                { n: 1, title: "Browse & pre-order", desc: "Pick from the live menu and order before breaktime starts." },
                { n: 2, title: "Receive your pickup code", desc: "Every order gets a unique code and digital receipt for easy claiming." },
                { n: 3, title: "Pick up and go", desc: "Skip long queues and claim your food immediately once it's ready." },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-4 bg-gray-50 border border-gray-100 p-4 md:p-5 rounded-2xl">
                  <div className="min-w-[40px] md:min-w-[45px] h-[40px] md:h-[45px] rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm md:text-base">{n}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="my-12 md:my-16 border-gray-200" />

        {/* Pricing */}
        <section id="pricing" className="py-12 md:py-24 scroll-mt-24 bg-gray-50 p-4 sm:p-6 md:p-10 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Simple, school-friendly pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">
              <h3 className="font-bold text-base md:text-lg">Student</h3>
              <p className="text-green-600 font-semibold">Free</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>âœ“ Pre-order & pickup</li>
                <li>âœ“ Order history</li>
                <li>âœ“ QR receipt</li>
                <li>âœ“ Push notifications</li>
              </ul>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">
              <h3 className="font-bold text-base md:text-lg">Canteen Seller</h3>
              <p className="text-green-600 font-semibold">â‚±799/mo</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>âœ“ Inventory & menu management</li>
                <li>âœ“ Real-time orders</li>
                <li>âœ“ Sales analytics</li>
                <li>âœ“ Auto receipts</li>
              </ul>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">
              <h3 className="font-bold text-base md:text-lg">School Partner</h3>
              <p className="text-green-600 font-semibold">Custom</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>âœ“ Multi-stall control</li>
                <li>âœ“ Admin dashboard</li>
                <li>âœ“ Account verification</li>
                <li>âœ“ Priority support</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="my-12 md:my-16 border-gray-200" />

        {/* For Schools */}
        <section id="schools" className="scroll-mt-24 py-2">
          <PartnerPage showNavbar={false} />
        </section>

        <hr className="mt-12 md:mt-16 border-gray-200" />

        <footer className="mt-8 py-6 text-center text-sm text-gray-500">
          Â© 2026 BiteHub. Made for hungry students.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
