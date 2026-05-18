import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.svg';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { isTokenExpired } from '../utils/isTokenExpired';
import { useDebounce } from '../hooks/useDebounce';
import { FaBars, FaTimes, FaHome, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        if (isTokenExpired(token)) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2 || location.pathname !== '/') {
      setSuggestions([]);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_DOMAIN}/listings/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch {
        setSuggestions([]);
      }
    };
    load();
  }, [debouncedQuery, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applySearch = (query) => {
    const trimmed = query.trim();
    if (location.pathname !== '/') {
      navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
    } else {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set('q', trimmed);
      else next.delete('q');
      setSearchParams(next);
    }
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applySearch(searchQuery);
  };

  const handleSignUp = () => {
    navigate('/signup');
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleList = () => {
    navigate('/listing/new');
    setIsMenuOpen(false);
  };

  const handleLogo = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search destinations..."
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ff385c] text-white p-2 rounded-full hover:bg-[#e63650] transition"
      >
        <FaSearch className="h-4 w-4" />
      </button>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                onClick={() => {
                  setSearchQuery(item);
                  applySearch(item);
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogo}>
            <img src={logo} alt="logo" className="h-8" />
            <span className="text-lg font-semibold text-gray-800 hidden sm:block">NestHub</span>
          </div>

          {location.pathname === '/' && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={suggestionsRef}>
              {searchForm}
            </div>
          )}

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleList}
              className="text-gray-700 hover:text-[#ff385c] transition flex items-center"
            >
              <FaHome className="mr-2" />
              <span>NestHub your home</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-[#ff385c] border border-[#ff385c] rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e63650] transition"
                >
                  Sign Up
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 border border-[#ff385c] text-[#ff385c] rounded-lg hover:bg-red-50 transition"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#ff385c] focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {location.pathname === '/' && (
              <div className="mb-4" ref={suggestionsRef}>
                {searchForm}
              </div>
            )}

            <button
              onClick={handleList}
              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
            >
              <FaHome className="mr-2" />
              <span>NestHub your home</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={handleSignUp}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Sign Up
                </button>
                <button
                  onClick={handleLogin}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
