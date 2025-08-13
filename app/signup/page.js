"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generatePseudonym } from "@/utils/generatePseudonym"; // adjust path if needed

export default function SignupPage() {
  const router = useRouter();
  const [pseudonym, setPseudonym] = useState("");
  const [pin, setPin] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();

    try {
      const res = await fetch("/api/auth/anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonym, pin, id }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err.error);
        return;
      }

      const data = await res.json();
      localStorage.setItem("anon_user", JSON.stringify({ id: data.id, pseudonym: data.pseudonym }));
      router.push("/");
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  };

  const handleGenerateName = () => {
    const randomName = generatePseudonym();
    setPseudonym(randomName);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left side (Form) */}
      <div className="w-full md:w-1/2 bg-slate-100 flex flex-col h-screen">
        {/* Logo */}
        <div className="p-4">
          {/* <a href="/" className="text-xl font-extrabold text-[#3C0061] tracking-tight">
            Lapsus
          </a> */}
        </div>

        <div className="flex justify-center items-start md:items-center flex-1 mt-[70px] md:mt-0 px-4">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-extrabold mb-3">Create Anonymous Account</h2>
            <small className="text-gray-500 text-xs">
              Use a random nickname or choose your own. Your 4-digit PIN lets you log back in later.
            </small>

            <form onSubmit={handleSignup} className="space-y-6 mt-5">
              <div>
                <label className="text-sm mb-1 block">Pseudonym</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. QuietFalcon"
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                    required
                    className="flex-1 text-sm outline-none bg-white border p-2 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateName}
                    className="px-3 py-2 bg-white border rounded-xl hover:bg-gray-200"
                    title="Generate name"
                  >
                    🎲
                  </button>
                </div>
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

              <div className="flex items-start gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  id="agreement"
                  required
                  className="mt-1 accent-blue-600"
                />
                <label htmlFor="agreement">
                  I agree to the{" "}
                  <a href="/legal/terms" className="text-blue-600 underline hover:text-blue-800">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/legal/privacy" className="text-blue-600 underline hover:text-blue-800">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#3C0061] text-white py-2 px-6 text-sm rounded-xl"
                >
                  Create my account
                </button>
              </div>

              <p className="text-xs text-center mt-4 text-gray-700">
                Already have an account?{" "}
                <a href="/login" className="text-[#3C0061] underline hover:text-[#3C0061]">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right side (Branding) - Hidden on small screens */}
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
