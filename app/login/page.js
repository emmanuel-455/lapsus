"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [pseudonym, setPseudonym] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonym, pin }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Login failed.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("anon_user", JSON.stringify({ id: data.id, pseudonym: data.pseudonym }));
      router.push("/");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left side: Login form */}
      <div className="w-full md:w-1/2 bg-slate-100 flex flex-col h-screen">
        {/* Logo */}
        <div className="p-4">
          {/* <a href="/" className="text-xl font-extrabold text-[#3C0061] tracking-tight">
            Lapsus
          </a> */}
        </div>

        <div className="flex justify-center items-start md:items-center flex-1 mt-[70px] md:mt-0 px-4">
          <div className="w-full  max-w-md">
            <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
            <small className="text-gray-500 text-xs">
              Enter your pseudonym and 4-digit PIN to return to your anonymous space.
            </small>

            <form onSubmit={handleLogin} className="space-y-6 mt-5">
              <div>
                <label className="text-sm mb-1 block">Pseudonym</label>
                <input
                  type="text"
                  placeholder="e.g. QuietFalcon"
                  value={pseudonym}
                  onChange={(e) => setPseudonym(e.target.value)}
                  required
                  className="w-full text-sm outline-none bg-white border p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">PIN</label>
                <input
                  type="password"
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  required
                  className="w-full text-sm outline-none bg-white border p-2 rounded-xl"
                />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>
                  New?{" "}
                  <a href="/signup" className="text-[#3C0061] underline hover:text-[#3C0061]">
                    Create an account
                  </a>
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#3C0061] text-white py-2 px-6 text-sm rounded-xl"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side: Branding - Only on desktop */}
      <div className="hidden md:flex w-1/2 bg-[#3C0061] items-center justify-center text-white text-center px-10">
        <div>
          <h2 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-purple-400">Lapsus</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            A space where thoughts are free. On <span className="italic">Lapsus</span>, you speak anonymously,
            without judgment, without pressure — just pure, unfiltered expression.
          </p>
        </div>
      </div>
    </div>
  );
}
