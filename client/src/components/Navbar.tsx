import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingBag, User, LogOut } from "lucide-react";
import logo from "../Assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.itemCount());
  const clearCart = useCartStore((state) => state.clearCart);
  const location = useLocation();

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
          <div className=" md:flex-1">
            <img
              src={logo}
              alt="logo"
              width={50}
              height={50}
              className="text-gray-500 hover:text-black transition-colors"
            />
          </div>

          {/* Center: Logo (Serif font, centered for prestige) */}
          <div className="flex-1 text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-xl md:text-3xl font-serif tracking-tighter text-black uppercase">
                Thrift Market <span className="font-light italic">Accra</span>
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
                <button
                  onClick={() => {
                    logout();
                    clearCart();
                  }}
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <LogOut size={22} strokeWidth={1.5} />
                </button>
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
                size={32}
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
      </div>
    </nav>
  );
};

export default Navbar;
