"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MdPostAdd, MdHome, MdLogout } from "react-icons/md";

export default function Navbar() {
  const [signedIn, setSignedIn] = useState(false);
  const [pseudonym, setPseudonym] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Check login status whenever the route changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("anon_user"));
    if (user?.pseudonym) {
      setSignedIn(true);
      setPseudonym(user.pseudonym);
    } else {
      setSignedIn(false);
      setPseudonym("");
    }
  }, [pathname]);

  // Change navbar shadow when scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("anon_user");
    setSignedIn(false);
    setPseudonym("");
  };

  return (
    <nav
      className={`flex justify-between items-center px-5 md:px-[50px] py-3 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-extrabold text-[#3C0061] hover:opacity-80 transition-opacity duration-200"
      >
        Lapsus
      </Link>

      {/* Menu Items */}
      <div className="flex items-center gap-8">
        {signedIn && (
          <span className="text-sm text-gray-600 hidden sm:inline animate-fadeIn">
            Welcome, <strong>{pseudonym}</strong>
          </span>
        )}

        <Link
          href="/"
          className="flex items-center gap-1 text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          <MdHome size={25} color="#43a047" />
          <span className="hidden sm:inline text-sm font-medium">Home</span>
        </Link>

        {signedIn && (
          <Link
            href="/createpost"
            className="flex items-center gap-1 text-gray-800 hover:text-blue-600 transition-colors duration-200"
          >
            <MdPostAdd size={26} color="#1e88e5" />
            <span className="hidden sm:inline text-sm font-medium">Post</span>
          </Link>
        )}

        {signedIn ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm transition-transform duration-200 hover:scale-105"
          >
            <MdLogout size={20} />
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-[#3C0061] text-white px-4 py-2 rounded-md hover:bg-[#4a017a] text-sm transition-transform duration-200 hover:scale-105"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
