// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert("Login failed: " + error.message);
    } else {
      // Force a hard browser reload to the admin dashboard
      window.location.href = "/admin";
    }
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 border border-[#F3D9CE]">
        <h1 className="text-2xl text-[#2E2624] mb-6 text-center font-serif">Admin Portal</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-[#6B5F5A] mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full px-3 py-2 border border-[#F3D9CE] focus:outline-none focus:border-[#D98C7A]" 
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B5F5A] mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-3 py-2 border border-[#F3D9CE] focus:outline-none focus:border-[#D98C7A]" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D98C7A] text-white py-3 hover:bg-[#C4735F] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}