import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p>011-23231230 / 077-2323112</p>
          <p>
            E-mail: <a href="mailto:travel123@gmail.com" className="no-underline">audirab123@gmail.com</a>
          </p>
        </div>
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="list-disc list-inside text-white"> {/* Add text-white to change bullet color */}
            <li><a href="home" className="no-underline">Home</a></li>
            <li><a href="favorite" className="no-underline">Favorite</a></li>
            <li><a href="/new_story" className="no-underline">Create</a></li>
            <li><a href="gallery" className="no-underline">Gallery</a></li>
            <li><a href="profile" className="no-underline">Profile</a></li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <ul className="list-disc list-inside text-white"> {/* Add text-white to change bullet color */}
            <li><a href="https://www.facebook.com" className="no-underline">Facebook</a></li>
            <li><a href="https://www.instagram.com" className="no-underline">Instagram</a></li>
            <li><a href="https://www.twitter.com" className="no-underline">Twitter</a></li>
            <li><a href="https://www.tiktok.com" className="no-underline">TikTok</a></li>
            <li><a href="#viber" className="no-underline">Viber</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-gray-600 pt-4">
        <p>Created By <span className="text-orange-500 font-semibold">AudiRAB Team</span> | All Rights Reserved!</p>
      </div>
    </footer>
  );
}

export default Footer;
