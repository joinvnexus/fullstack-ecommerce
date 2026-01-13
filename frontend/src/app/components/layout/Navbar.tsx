"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useCartStore from "@/store/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import SearchBar from "@/app/components/search/SearchBar"; // path ঠিক করো যদি লাগে

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cart } = useCartStore();
  const { totalWishlistItems } = useWishlist();
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const cartQuantity = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Avatar letter
  const avatarLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="text-2xl font-bold text-blue-600">ShopEasy</div>
            </Link>
          </div>

          {/* Desktop Navigation + Search */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } px-1 py-2 text-sm font-medium transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons (Desktop + Mobile) */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar variant="compact" className="w-64 lg:w-80" />
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle search"
            >
              <Search size={22} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalWishlistItems > 9 ? "9+" : totalWishlistItems}
                </span>
              )}
            </Link>

            {/* User / Auth */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {avatarLetter}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="text-sm font-semibold">{user.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/account" className="block px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setIsUserDropdownOpen(false)}>
                        My Account
                      </Link>
                      <Link href="/orders" className="block px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setIsUserDropdownOpen(false)}>
                        My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setIsUserDropdownOpen(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <SearchBar
              variant="expanded"
              autoFocus
              className="flex-1"
              onSearch={() => setIsSearchOpen(false)}
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Close search"
            >
              <X size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block py-3 px-4 rounded-md text-base ${
                  pathname === link.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link href="/account" className="block py-3 px-4 text-gray-800 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                  My Account
                </Link>
                <Link href="/orders" className="block py-3 px-4 text-gray-800 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                  My Orders
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block py-3 px-4 text-gray-800 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/login" className="block py-3 px-4 bg-gray-100 text-center rounded-md hover:bg-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block py-3 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;