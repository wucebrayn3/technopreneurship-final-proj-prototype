import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bitehublogo2 from "../assets/BiteHub2white.jpg";
import { login, register } from "../api";

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");
  const [selectedRole, setRole] = useState("student");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "", school: "", name: "", store_name: "" });

  const roleMap = { student: "customer", seller: "seller", admin: "admin" };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignIn = async () => {
    setError("");
    const r = await login(form.username, form.password);
    if (r.ok) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller");
      else navigate("/customer");
    } else {
      const d = await r.json();
      setError(d.error || d.detail || "Login failed");
    }
  };

  const handleSignUp = async () => {
    setError("");
    const role = roleMap[selectedRole] || "customer";
    const data = {
      username: form.username,
      email: form.email,
      password: form.password,
      role,
      school: form.school,
      store_name: role === "seller" ? form.store_name : "",
    };
    const r = await register(data);
    if (r.ok) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller");
      else navigate("/customer");
    } else {
      const d = await r.json();
      setError(Object.values(d).flat().join(", ") || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-green-600 text-white flex flex-col justify-between px-10 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={bitehublogo2} alt="BiteHub Logo" className="w-full h-full object-cover scale-[1.7]" />
          </div>
          <span className="text-xl font-bold">BiteHub</span>
        </div>
        <div className="mb-60">
          <h1 className="text-5xl font-bold mb-4 leading-tight">Lunch, but smarter.</h1>
          <p className="text-base text-green-100 max-w-sm leading-relaxed">
            Pre-order from your school canteen, pay digitally, and pick up with a code. No lines. No drama.
          </p>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-8 w-[420px]">
          {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>}

          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${tab === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`} onClick={() => setTab("signin")}>Sign in</button>
            <button className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${tab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`} onClick={() => setTab("signup")}>Create account</button>
          </div>

          {tab === "signin" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button onClick={handleSignIn} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors">Sign in</button>
            </div>
          )}

          {tab === "signup" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="flex gap-2">
                  {[
                    { value: "student", label: "Student" },
                    { value: "seller", label: "Seller" },
                  ].map((role) => (
                    <button key={role.value} onClick={() => setRole(role.value)}
                      className={`flex-1 py-2 px-3 rounded-full border text-sm font-medium transition-colors ${selectedRole === role.value ? "border-green-600 text-green-700 bg-green-50" : "border-gray-200 text-gray-600 bg-white"}`}>
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input name="school" value={form.school} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              {selectedRole === "seller" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input name="store_name" value={form.store_name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button onClick={handleSignUp} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors">Create account</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
