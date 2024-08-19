import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaStop } from 'react-icons/fa';
import NavBar from '../../Common_Parts/Common/NavBar';

const PDFViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure with a fallback to query parameters
  const { pdfUrl, story } = location.state || {};

  // If state is null, parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const urlFromParams = searchParams.get('pdfUrl');
  const storyFromParams = searchParams.get('story');

  const finalPdfUrl = pdfUrl || urlFromParams;
  const finalStory = story || storyFromParams;

  // State to track whether speech is ongoing
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0); // Track the current character index in the story
  const utteranceRef = useRef(null);

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop the speech
      setIsSpeaking(false); // Update state to reflect that speech has stopped
    } else {
      const cleanedStory = finalStory || "No story available"; // Fallback if story is not available

      const utterance = new SpeechSynthesisUtterance(cleanedStory.slice(currentCharIndex));
      utteranceRef.current = utterance;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setCurrentCharIndex(currentCharIndex + event.charIndex);
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentCharIndex(0); // Reset the character index when speech ends naturally
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true); // Update state to reflect that speech has started
    }
  };

  // If there's no pdfUrl, show an error message and navigate back to the gallery
  if (!finalPdfUrl) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500">No PDF selected. Redirecting to the gallery...</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => navigate('/')}
        >
          Go to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <NavBar hideSearch={true} />

      <div style={{ paddingTop: '18px' }}></div>

      <iframe
        src={finalPdfUrl}
        className="w-full"
        title="PDF Viewer"
        style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }} // Adjusting for the NavBar height
      ></iframe>

      {/* Speaker Button */}
      <div className="fixed top-40 right-16">
        {isSpeaking ? (
          <FaStop 
            onClick={handleSpeechToggle}
            className="cursor-pointer text-black p-2 border border-black" 
            style={{ 
              fontSize: '30px',
              borderRadius: '10px',
              backgroundColor: 'white',
              width: '40px',
              height: '40px',
            }} 
          />
        ) : (
          <FaVolumeUp 
            onClick={handleSpeechToggle}
            className="cursor-pointer text-black p-2 border border-black" 
            style={{ 
              fontSize: '40px',
              borderRadius: '10px',
              backgroundColor: 'orange',
              width: '50px',
              height: '50px',
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
