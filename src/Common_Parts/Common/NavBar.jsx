import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

function NavBar({ hideSearch, profileImage }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Profile Image in NavBar:", profileImage); // Debugging line

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
            className="hidden md:flex items-center cursor-pointer"
            onClick={handleHomeClick}
          >
            <img
              src="/images/Onboarding/onboard01.webp"
              alt="Logo"
              style={{ width: '60px', height: '60px' }}
              className="rounded-full border border-white mr-4"
            />
            <span className="text-4xl font-bold">AudiRAB</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center" style={{ marginLeft: '400px' }}>
          <ul className="hidden md:flex space-x-4">
            <li>
              <Link
                to="/home"
                className={`no-underline focus:outline-none ${location.pathname === '/home' ? 'text-orange-300' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/favorite"
                className={`no-underline focus:outline-none ${location.pathname === '/favorite' ? 'text-orange-300' : ''}`}
              >
                Favorite
              </Link>
            </li>
            <li>
              <Link
                to="/new_story"
                className={`no-underline focus:outline-none ${location.pathname === '/new_story' ? 'text-orange-300' : ''}`}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={`no-underline focus:outline-none ${location.pathname === '/gallery' ? 'text-orange-300' : ''}`}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`no-underline focus:outline-none ${location.pathname === '/profile' ? 'text-orange-300' : ''}`}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4 ml-auto md:ml-0">
          {!hideSearch && (
            <button
              className="text-2xl -ml-52 mr-52"
              style={{ fontSize: '24px' }}
              onClick={toggleSearch}
            >
              <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
            </button>
          )}
        </div>

        {/* Profile Image Circle in the Right Corner */}
        <Link to="/profile" className="absolute top-0 right-0 mt-8 mr-20">
          <div className="bg-white rounded-full w-9 h-9 overflow-hidden cursor-pointer">
            <img src={profileImage || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Link>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      </nav>
    </>
  );
}

export default NavBar;
