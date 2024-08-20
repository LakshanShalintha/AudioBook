import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

<<<<<<< HEAD
function NavBar({ hideSearch, profileImage }) {
=======
function NavBar({ hideSearch }) {
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  console.log("Profile Image in NavBar:", profileImage); // Debugging line

=======
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
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
<<<<<<< HEAD
              style={{ width: '60px', height: '60px' }}
              className="rounded-full border border-white mr-4"
            />
            <span className="text-4xl font-bold">AudiRAB</span>
=======
              style={{ width: '50px', height: '50px' }}
              className="rounded-full border border-white mr-2"
            />
            <span className="text-2xl font-bold">AudiRAB</span>
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
          </div>
        </div>

        <div className="flex-1 flex justify-center" style={{ marginLeft: '400px' }}>
          <ul className="hidden md:flex space-x-4">
            <li>
<<<<<<< HEAD
              <Link
                to="/home"
                className={`no-underline focus:outline-none ${location.pathname === '/home' ? 'text-orange-300' : ''}`}
              >
=======
              <Link to="/home" className="hover:underline focus:outline-none">
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
                Home
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link
                to="/favorite"
                className={`no-underline focus:outline-none ${location.pathname === '/favorite' ? 'text-orange-300' : ''}`}
              >
=======
              <Link to="/favorite" className="hover:underline focus:outline-none">
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
                Favorite
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link
                to="/new_story"
                className={`no-underline focus:outline-none ${location.pathname === '/new_story' ? 'text-orange-300' : ''}`}
              >
=======
              <Link to="/new_story" className="hover:underline focus:outline-none">
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
                Create
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link
                to="/gallery"
                className={`no-underline focus:outline-none ${location.pathname === '/gallery' ? 'text-orange-300' : ''}`}
              >
=======
              <Link to="/gallery" className="hover:underline focus:outline-none">
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
                Gallery
              </Link>
            </li>
            <li>
<<<<<<< HEAD
              <Link
                to="/profile"
                className={`no-underline focus:outline-none ${location.pathname === '/profile' ? 'text-orange-300' : ''}`}
              >
=======
              <Link to="/profile" className="hover:underline focus:outline-none">
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4 ml-auto md:ml-0">
<<<<<<< HEAD
          {!hideSearch && (
            <button
              className="text-2xl -ml-52 mr-52"
=======
          {!hideSearch && ( /* Conditionally render the search icon */
            <button
              className="text-2xl ml-2"
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
              style={{ fontSize: '24px' }}
              onClick={toggleSearch}
            >
              <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
            </button>
          )}
        </div>

<<<<<<< HEAD
        {/* Profile Image Circle in the Right Corner */}
        <Link to="/profile" className="absolute top-0 right-0 mt-8 mr-20">
          <div className="bg-white rounded-full w-9 h-9 overflow-hidden cursor-pointer">
            <img src={profileImage || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Link>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      </nav>
=======
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
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
    </>
  );
}

export default NavBar;
