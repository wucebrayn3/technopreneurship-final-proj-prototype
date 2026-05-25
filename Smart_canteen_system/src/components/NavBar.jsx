import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bitehublogo from "../assets/BiteHub.png";

const sections = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "how", label: "How it Works" },
  { id: "pricing", label: "Pricing" },
  { id: "schools", label: "For Schools" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isPartnerPage = location.pathname === "/partner";

  const [activeSection, setActiveSection] = useState("hero");

  const isScrollingToRef = useRef(false);
  const scrollTimerRef = useRef(null);

  // Reset active section when route changes
  useEffect(() => {
    if (isPartnerPage) {
      setActiveSection("schools");
    } else {
      setActiveSection("hero");
    }
  }, [location.pathname, isPartnerPage]);

  // Scroll tracking — only on landing page, locked during programmatic scroll
  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      if (isScrollingToRef.current) return;

      let current = "hero";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  // Handle cross-page navigation (from PartnerPage) using router state
  useEffect(() => {
    if (!isLandingPage) return;

    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        setTimeout(() => {
          isScrollingToRef.current = true;
          setActiveSection(scrollTo);
          el.scrollIntoView({ behavior: "smooth" });
          clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = setTimeout(() => {
            isScrollingToRef.current = false;
          }, 800);
        }, 100);
      }
    }
  }, [isLandingPage, location.state]);

  const scrollToSection = (sectionId) => {
    if (isLandingPage) {
      const el = document.getElementById(sectionId);
      if (el) {
        isScrollingToRef.current = true;
        setActiveSection(sectionId);
        el.scrollIntoView({ behavior: "smooth" });
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          isScrollingToRef.current = false;
        }, 800);
      }
    } else {
      setActiveSection(sectionId);
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(scrollTimerRef.current);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src={bitehublogo} alt="BiteHub Logo" className="w-16 h-16 rounded-full" />
          <span className="text-2xl font-bold text-gray-900">BiteHub</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {sections.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`text-sm font-medium relative transition-colors ${
                  isActive
                    ? "text-green-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-green-600 after:content-['']"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;