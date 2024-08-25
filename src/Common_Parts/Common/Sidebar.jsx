// src/Common_Parts/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ zIndex: 60 }}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={onClose} className="text-2xl">
          &times; {/* Close icon */}
        </button>
      </div>
      <ul className="flex flex-col space-y-4 p-4">
        <li>
          <Link to="/home" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/new_story" className="hover:underline">Create</Link>
        </li>
        <li>
        <Link to="/gallery" className="hover:underline">Gallery</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">About</Link>
        </li>
        <li>
          <Link to="/reviews" className="hover:underline">Reviews</Link>
        </li>
        <li>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
