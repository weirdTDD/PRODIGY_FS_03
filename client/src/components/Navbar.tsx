import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import logo from "../Assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((state) => state.itemCount());
  const clearCart = useCartStore((state) => state.clearCart);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "COLLECTIONS", path: "/products" },
    { name: "MEN", path: "/men" },
    { name: "WOMEN", path: "/women" },
    { name: "OUR STORY", path: "/about" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Search Icon (Luxury sites prioritize discovery) */}
          <div className="md:flex-1 flex items-center">
            <button
              type="button"
              className="block md:hidden text-gray-700 hover:text-black transition-colors"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <img
              src={logo}
              alt="logo"
              width={50}
              height={50}
              className="hidden md:block text-gray-500 hover:text-black transition-colors"
            />
          </div>

          {/* Center: Logo (Serif font, centered for prestige) */}
          <div className="flex-1 text-center ml-2">
            <Link to="/" className="inline-block">
              <h1 className="text-lg md:text-2xl font-serif tracking-tighter text-black uppercase text-nowrap">
                Thrift Market{" "}
                <span className="font-light italic sm:">Accra</span>
              </h1>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-5 font-bold">
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <User size={22} strokeWidth={1.5} />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm tracking-widest font-medium text-gray-600 hover:text-black uppercase transition-colors"
              >
                Login
              </Link>
            )}

            {/* Cart with minimal badge */}
            <Link to="/cart" className="relative group">
              <ShoppingBag
                size={24}
                strokeWidth={1.5}
                className="text-gray-800 group-hover:text-black"
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Secondary Nav: Centered Links below the logo */}
        <div className="hidden md:flex justify-center pb-4 space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[12px] tracking-[0.2em] font-bold transition-all duration-300 relative group
                ${location.pathname === link.path ? "text-black" : "text-gray-500 hover:text-black "}`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm tracking-widest font-semibold uppercase
                    ${location.pathname === link.path ? "text-black" : "text-gray-600 hover:text-black"}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm tracking-widest font-semibold uppercase text-gray-600 hover:text-black"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm tracking-widest font-semibold uppercase text-gray-600 hover:text-black"
                >
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm tracking-widest font-semibold uppercase text-gray-600 hover:text-black"
              >
                Cart ({itemCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
