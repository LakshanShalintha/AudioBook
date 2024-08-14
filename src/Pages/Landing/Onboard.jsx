import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/welcome'); // Navigate to WelcomePage
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    navigate('/welcome'); // Navigate to WelcomePage
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-75"></div>

      {/* Background Image */}
      <img
        src="/images/Onboarding/OnBoardingBackground.jpg"
        alt="Onboarding Background"
        className="w-full h-full object-cover"
      />

      {/* Skip Button */}
      {currentPage < 3 && (
        <button
          className="absolute top-4 right-4 bg-transparent text-white text-sm font-medium"
          onClick={handleSkip}
          style={{ fontSize: '18px' }}
        >
          Skip
        </button>
      )}

      {/* Content Based on Current Page */}
      <div className="absolute" style={{ top: '10%', width: '100%' }}>
        <div className="flex flex-col items-center px-4">
          <div
            className="bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden"
            style={{ width: '350px', height: '350px' }}
          >
            <img
              src={`/images/Onboarding/onboard0${currentPage}.webp`}
              alt={`Onboarding Image ${currentPage}`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-white text-2xl font-bold text-center">
            {currentPage === 1 && 'Welcome to Your Best Digital Solution'}
            {currentPage === 2 && 'Discover New Features'}
            {currentPage === 3 && 'Get Ready to Explore'}
          </h1>
          <p className="text-white text-center mt-2">
            {currentPage === 1 &&
              'Step into a world where stories come to life, where every page is an adventure, and every word is a journey!'}
            {currentPage === 2 &&
              'Discover a vast library of audiobooks from all genres. With AudiRAB, you can listen to your favorite stories anytime, anywhere.'}
            {currentPage === 3 && 
            'Join our community of audiobook enthusiasts and start your journey with AudiRAB today. Your next great listen is just a tap away!!'}
          </p>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-32 w-full flex justify-center items-center">
        <div className="flex space-x-3">
          <span className={`block w-3 h-3 ${currentPage >= 1 ? 'bg-white' : 'bg-gray-400'} rounded-full`}></span>
          <span className={`block w-3 h-3 ${currentPage >= 2 ? 'bg-white' : 'bg-gray-400'} rounded-full`}></span>
          <span className={`block w-3 h-3 ${currentPage >= 3 ? 'bg-white' : 'bg-gray-400'} rounded-full`}></span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-10 w-full flex justify-center items-center">
        {currentPage > 1 && (
          <button
            className="bg-white text-black px-16 py-3 rounded-full text-lg font-medium mr-4"
            onClick={handlePrevious}
            style={{ maxWidth: '300px', width: '100%' }}
          >
            Previous
          </button>
        )}
        <button
          className="bg-white text-black px-16 py-3 rounded-full text-lg font-medium"
          onClick={handleNext}
          style={{ maxWidth: '300px', width: '100%' }}
        >
          {currentPage < 3 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
}

export default Onboard;
