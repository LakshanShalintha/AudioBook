import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

function NavBar({ hideSearch }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleHomeClick = () => {
    navigate('/', { replace: true });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const params = new URLSearchParams(location.search);
    params.set('search', term);

    if (location.pathname === '/favorite') {
      navigate(`/favorite?${params.toString()}`);
    } else {
      navigate(`/gallery?${params.toString()}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const params = new URLSearchParams(location.search);
      params.set('search', searchTerm.trim());

      if (location.pathname === '/favorite') {
        navigate(`/favorite?${params.toString()}`);
      } else {
        navigate(`/gallery?${params.toString()}`);
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center z-50">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-2xl md:hidden mr-4">
            &#9776;
          </button>
          <div
            className="hidden md:flex items-center cursor-pointer ml-16"
            onClick={handleHomeClick}
          >
            <img
              src="/images/Onboarding/onboard01.webp"
              alt="Logo"
              style={{ width: '50px', height: '50px' }}
              className="rounded-full border border-white mr-2"
            />
            <span className="text-5xl font-bold -mt-1">AudiRAB</span>
          </div>
        </div>

        <div className="flex-1 font-bold flex justify-center" style={{ marginLeft: '600px' }}>
          <ul className="hidden md:flex space-x-5">
            <li>
              <Link
                to="/home"
                className={`no-underline focus:outline-none text-[18px] ${
                  location.pathname === '/home' ? 'text-orange-300' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/new_story"
                className={`no-underline focus:outline-none text-[18px] ${
                  location.pathname === '/new_story' ? 'text-orange-300' : ''
                }`}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={`no-underline focus:outline-none text-[18px] ${
                  location.pathname === '/gallery' ? 'text-orange-300' : ''
                }`}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`no-underline focus:outline-none text-[18px] ${
                  location.pathname === '/about' ? 'text-orange-300' : ''
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`no-underline focus:outline-none text-[18px] ${
                  location.pathname === '/profile' ? 'text-orange-300' : ''
                }`}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4 ml-auto md:ml-0 mr-16">
          {!hideSearch && (
            <button
              className="text-2xl ml-2"
              style={{ fontSize: '24px' }}
              onClick={toggleSearch}
            >
              <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
            </button>
          )}
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      </nav>

      <div
        className={`fixed top-20 left-0 right-0 z-60 p-2 bg-gray-800 transition-all duration-300 ${
          isSearchOpen ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
        }`}
        style={{ zIndex: 1000 }}
      >
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full mx-auto transition-all duration-300"
          style={{ maxWidth: '90%', width: '100%', maxWidth: '600px', overflow: 'hidden' }}
        >
          <input
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 rounded-full focus:outline-none transition-all duration-300 ${
              isSearchOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <button
            type="submit"
            className={`text-gray-600 px-4 transition-all duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
    </>
  );
}

export default NavBar;
